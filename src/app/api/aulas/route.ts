// src/app/api/aulas/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Aula from "@/models/Aula";
import Edificio from "@/models/Edificio";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();
    const { nombre_o_numero, capacidad, tipo_aula, edificio_id } = body;

    if (!nombre_o_numero || !capacidad || !tipo_aula || !edificio_id) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    // Obtenemos la sede del edificio
    const edificio = await Edificio.findById(edificio_id);
    if (!edificio) {
      return NextResponse.json(
        { error: "Edificio no encontrado." },
        { status: 404 }
      );
    }

    const sede_id = edificio.sede_id;

    // Verificamos si ya existe un aula con el mismo nombre en esta sede
    const aulasExistentes = await Aula.find({
      nombre_o_numero,
    }).populate({
      path: "edificio_id",
      match: { sede_id },
      select: "_id sede_id",
    });

    const aulaDuplicada = aulasExistentes.find((a) => a.edificio_id !== null);

    if (aulaDuplicada) {
      return NextResponse.json(
        {
          error: `Ya existe un aula con el nombre "${nombre_o_numero}" en esta sede.`,
        },
        { status: 409 }
      );
    }

    // Crear aula
    const nuevaAula = await Aula.create({
      nombre_o_numero,
      capacidad,
      tipo_aula,
      edificio_id,
    });

    return NextResponse.json(nuevaAula, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Error creando aula." }, { status: 500 });
  }
}
