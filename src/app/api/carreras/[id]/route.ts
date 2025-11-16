import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Carrera from "@/models/Carrera";
import Sede from "@/models/Sede";

export async function GET(_, { params }) {
  try {
    await connectToDB();
    const carrera = await Carrera.findById(params.id);

    if (!carrera)
      return NextResponse.json(
        { error: "Carrera no encontrada" },
        { status: 404 }
      );

    return NextResponse.json(carrera);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }) {
  try {
    await connectToDB();
    const body = await req.json();
    const { codigo_carrera, nombre_carrera, anios, sede_ids } = body;

    const carrera = await Carrera.findById(params.id);
    if (!carrera)
      return NextResponse.json(
        { error: "Carrera no encontrada" },
        { status: 404 }
      );

    // VALIDAR SEDES
    if (sede_ids && sede_ids.length > 0) {
      const sedes = await Sede.find({ _id: { $in: sede_ids } });
      if (sedes.length !== sede_ids.length) {
        return NextResponse.json(
          { error: "Una o más sedes no existen." },
          { status: 400 }
        );
      }
    }

    carrera.codigo_carrera = codigo_carrera;
    carrera.nombre_carrera = nombre_carrera;
    carrera.anios = anios;
    carrera.sede_ids = sede_ids || [];

    await carrera.save();

    return NextResponse.json(carrera);
  } catch (error) {
    return NextResponse.json(
      { error: "Error actualizando carrera" },
      { status: 500 }
    );
  }
}

export async function DELETE(_, { params }) {
  try {
    await connectToDB();
    const carrera = await Carrera.findByIdAndDelete(params.id);

    if (!carrera)
      return NextResponse.json(
        { error: "Carrera no encontrada" },
        { status: 404 }
      );

    return NextResponse.json({ message: "Carrera eliminada correctamente" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
