import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Sede from "@/models/Sede";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();
    const { nombre, direccion } = body;

    if (!nombre)
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );

    const newSede = await Sede.create({ nombre, direccion });
    return NextResponse.json(newSede);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creando la sede" },
      { status: 500 }
    );
  }
}
