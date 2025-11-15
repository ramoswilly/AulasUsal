import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Carrera from "@/models/Carrera";
import Sede from "@/models/Sede";

export async function GET(req: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const sedeId = searchParams.get("sedeId");

    if (!sedeId) {
      return NextResponse.json({ error: "Missing sedeId" }, { status: 400 });
    }

    const carreras = await Carrera.find({ sede_ids: sedeId });

    return NextResponse.json(carreras);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();

    const { codigo_carrera, nombre_carrera, anios, sede_ids } = body;

    // --- VALIDACIONES BÁSICAS ---
    if (!codigo_carrera || !nombre_carrera || !anios) {
      return NextResponse.json(
        { error: "Código, nombre y años de la carrera son obligatorios." },
        { status: 400 }
      );
    }

    // sede_ids debe ser array
    if (sede_ids && !Array.isArray(sede_ids)) {
      return NextResponse.json(
        { error: "sede_ids debe ser un array." },
        { status: 400 }
      );
    }

    // --- VALIDAR DUPLICADOS ---
    const carreraExistente = await Carrera.findOne({
      $or: [
        { codigo_carrera },
        { nombre_carrera: new RegExp(`^${nombre_carrera}$`, "i") },
      ],
    });

    if (carreraExistente) {
      return NextResponse.json(
        {
          error:
            "Ya existe una carrera con ese código o nombre. Verifica los datos.",
        },
        { status: 409 }
      );
    }

    // --- VALIDAR QUE TODAS LAS SEDES EXISTAN ---
    if (sede_ids && sede_ids.length > 0) {
      const sedes = await Sede.find({ _id: { $in: sede_ids } });

      if (sedes.length !== sede_ids.length) {
        return NextResponse.json(
          { error: "Una o más sedes no existen." },
          { status: 400 }
        );
      }
    }

    // --- CREAR CARRERA ---
    const nuevaCarrera = await Carrera.create({
      codigo_carrera,
      nombre_carrera,
      anios,
      sede_ids: sede_ids || [],
    });

    return NextResponse.json(nuevaCarrera, { status: 201 });
  } catch (error) {
    console.error("Error creando carrera:", error);
    return NextResponse.json(
      { error: "Error creando carrera." },
      { status: 500 }
    );
  }
}
