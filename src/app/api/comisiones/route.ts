// src/app/api/comisiones/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";

import Comision from "@/models/Comision";
import Sede from "@/models/Sede";
import Carrera from "@/models/Carrera";
import Materia from "@/models/Materia";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
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
      anio_por_carrera,
    } = body;

    if (
      !nombre_comision ||
      !anio_dictado ||
      !horario?.dia ||
      !horario?.turno ||
      !sede_id ||
      !carrera_ids?.length ||
      !materia_ids?.length
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    // 1. Validar sede
    const sede = await Sede.findById(sede_id);
    if (!sede)
      return NextResponse.json(
        { error: "Sede no encontrada." },
        { status: 404 }
      );

    // 2. Validar carreras pertenecientes a la sede
    const carreras = await Carrera.find({
      _id: { $in: carrera_ids },
      sede_ids: sede_id,
    });

    if (carreras.length !== carrera_ids.length) {
      return NextResponse.json(
        { error: "Una o más carreras no pertenecen a la sede seleccionada." },
        { status: 400 }
      );
    }

    // 3. Validar materias existan
    const materias = await Materia.find({
      _id: { $in: materia_ids },
    });

    if (materias.length !== materia_ids.length) {
      return NextResponse.json(
        { error: "Una o más materias no existen." },
        { status: 400 }
      );
    }

    const nueva = await Comision.create({
      nombre_comision,
      anio_dictado,
      inscriptos: inscriptos || 0,
      profesor,
      horario,
      sede_id,
      carrera_ids,
      materia_ids,
      recursos: recursos || [],
      anio_por_carrera: anio_por_carrera || [],
    });

    return NextResponse.json(nueva, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creando comision." },
      { status: 500 }
    );
  }
}
