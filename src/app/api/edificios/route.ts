import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Edificio from "@/models/Edificio";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();
    const { nombre, tipo, sede_id } = body;

    if (!nombre || !sede_id) {
      return NextResponse.json(
        { error: "Nombre y sede son obligatorios" },
        { status: 400 }
      );
    }

    const newEdificio = await Edificio.create({ nombre, tipo, sede_id });
    return NextResponse.json(newEdificio);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creando edificio" },
      { status: 500 }
    );
  }
}
