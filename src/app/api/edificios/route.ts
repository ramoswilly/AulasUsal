// src/app/api/edificios/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Edificio from "@/models/Edificio";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();
    const { nombre, tipo, sede_id } = body;

    if (!nombre || !sede_id || !tipo) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    // Validación: mismo nombre dentro de la misma sede
    const existente = await Edificio.findOne({ nombre, sede_id });
    if (existente) {
      return NextResponse.json(
        {
          error: `Ya existe un edificio con el nombre "${nombre}" en esta sede.`,
        },
        { status: 409 }
      );
    }

    const nuevoEdificio = await Edificio.create({ nombre, tipo, sede_id });
    return NextResponse.json(nuevoEdificio, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creando edificio." },
      { status: 500 }
    );
  }
}
