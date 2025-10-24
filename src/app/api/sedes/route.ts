import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Sede from "@/models/Sede";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();
    const { nombre, direccion } = body;

    if (!nombre) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const newSede = await Sede.create({ nombre, direccion });
    return NextResponse.json(newSede);
  } catch (error: any) {
    console.error(error);

    // Manejo de duplicados
    if (error.code === 11000) {
      return NextResponse.json(
        {
          error: `Ya existe una sede con el nombre "${error.keyValue.nombre}".`,
        },
        { status: 409 } // 409 Conflict
      );
    }

    return NextResponse.json(
      { error: "Error creando la sede" },
      { status: 500 }
    );
  }
}
