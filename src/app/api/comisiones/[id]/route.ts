import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";

import Comision from "@/models/Comision";
import Sede from "@/models/Sede";
import Carrera from "@/models/Carrera";
import Materia from "@/models/Materia";

export async function PUT(req: NextRequest, { params }) {
  try {
    await connectToDB();

    const id = params.id;
    const body = await req.json();

    const {
      nombre_comision,
      anio_dictado,
      inscriptos,
      profesor,
      horario,
      sede_id,
      carrera_ids,
      materia_ids,
      recursos,
    } = body;

    const existe = await Comision.findById(id);
    if (!existe)
      return NextResponse.json(
        { error: "Comisión no encontrada" },
        { status: 404 }
      );

    // Validar sede
    const sede = await Sede.findById(sede_id);
    if (!sede)
      return NextResponse.json(
        { error: "Sede no encontrada" },
        { status: 400 }
      );

    // Validar carreras
    const carreras = await Carrera.find({
      _id: { $in: carrera_ids },
      sede_ids: sede_id,
    });

    if (carreras.length !== carrera_ids.length)
      return NextResponse.json(
        { error: "Una o más carreras no pertenecen a la sede" },
        { status: 400 }
      );

    // Validar materias
    const materias = await Materia.find({
      _id: { $in: materia_ids },
    });

    if (materias.length !== materia_ids.length)
      return NextResponse.json(
        { error: "Una o más materias no existen" },
        { status: 400 }
      );

    const updated = await Comision.findByIdAndUpdate(
      id,
      {
        nombre_comision,
        anio_dictado,
        inscriptos: inscriptos || 0,
        profesor,
        horario,
        sede_id,
        carrera_ids,
        materia_ids,
        recursos: recursos || [],
      },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error actualizando comisión" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }) {
  try {
    await connectToDB();

    const id = params.id;

    const existe = await Comision.findById(id);
    if (!existe)
      return NextResponse.json(
        { error: "Comisión no encontrada" },
        { status: 404 }
      );

    await Comision.findByIdAndDelete(id);

    return NextResponse.json({ message: "Comisión eliminada" });
  } catch (err) {
    return NextResponse.json(
      { error: "Error eliminando comisión" },
      { status: 500 }
    );
  }
}
