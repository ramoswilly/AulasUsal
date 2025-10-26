import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Aula from "@/models/Aula";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const { id } = params;
    const body = await req.json();
    const { nombre_o_numero, tipo_aula, capacidad, recursos } = body;

    if (!nombre_o_numero)
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );

    const aula = await Aula.findByIdAndUpdate(
      id,
      { nombre_o_numero, tipo_aula, capacidad, recursos: recursos || [] },
      { new: true }
    );

    if (!aula)
      return NextResponse.json(
        { error: "Aula no encontrada" },
        { status: 404 }
      );

    return NextResponse.json(aula);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error actualizando el aula" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const { id } = params;

    const aula = await Aula.findByIdAndDelete(id);
    if (!aula)
      return NextResponse.json(
        { error: "Aula no encontrada" },
        { status: 404 }
      );

    return NextResponse.json({
      message: `Aula "${aula.nombre_o_numero}" eliminada correctamente.`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error eliminando el aula" },
      { status: 500 }
    );
  }
}
