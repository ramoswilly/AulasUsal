import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Materia from "@/models/Materia";
import Carrera from "@/models/Carrera";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();

    const {
      codigo_materia,
      nombre_materia,
      carrera_id,
      anio_carrera,
      cuatrimestre,
    } = body;

    // --- VALIDACIONES BÁSICAS ---
    if (
      !codigo_materia ||
      !nombre_materia ||
      !carrera_id ||
      !anio_carrera ||
      !cuatrimestre
    ) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    // --- VALIDAR DUPLICADOS ---
    const materiaExistente = await Materia.findOne({
      $or: [
        { codigo_materia },
        { nombre_materia: new RegExp(`^${nombre_materia}$`, "i") },
      ],
    });

    if (materiaExistente) {
      return NextResponse.json(
        {
          error:
            "Ya existe una materia con ese código o nombre. Verifica los datos.",
        },
        { status: 409 }
      );
    }

    // --- VALIDAR QUE LA CARRERA EXISTA ---
    const carrera = await Carrera.findById(carrera_id);

    if (!carrera) {
      return NextResponse.json(
        { error: "La carrera seleccionada no existe." },
        { status: 400 }
      );
    }

    // --- VALIDAR AÑO Y CUATRIMESTRE ---
    if (anio_carrera < 1 || anio_carrera > carrera.anios) {
      return NextResponse.json(
        {
          error: `El año de carrera debe estar entre 1 y ${carrera.anios}.`,
        },
        { status: 400 }
      );
    }

    if (![1, 2, 3].includes(cuatrimestre)) {
      return NextResponse.json(
        { error: "Debe seleccionar un cuatrimestre." },
        { status: 400 }
      );
    }

    // --- CREAR MATERIA ---
    const nuevaMateria = await Materia.create({
      codigo_materia,
      nombre_materia,
      carrera_id,
      anio_carrera,
      cuatrimestre,
    });

    return NextResponse.json(nuevaMateria, { status: 201 });
  } catch (error) {
    console.error("Error creando materia:", error);
    return NextResponse.json(
      { error: "Error creando materia." },
      { status: 500 }
    );
  }
}
