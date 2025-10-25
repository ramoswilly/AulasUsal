import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Edificio from "@/models/Edificio";
import Aula from "@/models/Aula";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const { id } = params;
    const body = await req.json();
    const { nombre, tipo, sede_id } = body;

    if (!nombre)
      return NextResponse.json(
        { error: "Nombre obligatorio" },
        { status: 400 }
      );

    const duplicado = await Edificio.findOne({
      nombre,
      sede_id,
      _id: { $ne: id },
    });
    if (duplicado)
      return NextResponse.json(
        { error: `Ya existe un edificio con nombre "${nombre}" en esta sede.` },
        { status: 409 }
      );

    const updated = await Edificio.findByIdAndUpdate(
      id,
      { nombre, tipo },
      { new: true }
    );
    if (!updated)
      return NextResponse.json(
        { error: "Edificio no encontrado" },
        { status: 404 }
      );

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error actualizando el edificio" },
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

    // Eliminar aulas asociadas
    await Aula.deleteMany({ edificio_id: id });

    // Eliminar el edificio
    const deleted = await Edificio.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json(
        { error: "Edificio no encontrado" },
        { status: 404 }
      );

    return NextResponse.json({
      message: "Edificio y todas sus aulas eliminadas correctamente",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error eliminando el edificio" },
      { status: 500 }
    );
  }
}
