import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Materia from "@/models/Materia";
import Carrera from "@/models/Carrera";

export async function PUT(req, { params }) {
  try {
    await connectToDB();

    const materiaId = params.id;
    const body = await req.json();

    const {
      codigo_materia,
      nombre_materia,
      carrera_id,
      anio_carrera,
      cuatrimestre,
    } = body;

    const carrera = await Carrera.findById(carrera_id);

    if (!carrera) {
      return NextResponse.json(
        { error: "La carrera seleccionada no existe." },
        { status: 400 }
      );
    }

    if (anio_carrera < 1 || anio_carrera > carrera.anios) {
      return NextResponse.json(
        {
          error: `El año debe estar entre 1 y ${carrera.anios}.`,
        },
        { status: 400 }
      );
    }

    const updated = await Materia.findByIdAndUpdate(
      materiaId,
      {
        codigo_materia,
        nombre_materia,
        carrera_id,
        anio_carrera,
        cuatrimestre,
      },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error editando materia" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    await Materia.findByIdAndDelete(params.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error eliminando materia" },
      { status: 500 }
    );
  }
}
