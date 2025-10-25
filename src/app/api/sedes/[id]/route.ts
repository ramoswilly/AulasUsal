import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Sede from "@/models/Sede";
import Edificio from "@/models/Edificio";
import Aula from "@/models/Aula";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } } // Ahora sí funciona
) {
  try {
    await connectToDB();
    const { id } = params;
    const body = await req.json();
    const { nombre, direccion } = body;

    if (!nombre) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const duplicado = await Sede.findOne({ nombre, _id: { $ne: id } });
    if (duplicado) {
      return NextResponse.json(
        { error: `Ya existe una sede con el nombre "${nombre}".` },
        { status: 409 }
      );
    }

    const updated = await Sede.findByIdAndUpdate(
      id,
      { nombre, direccion },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Sede no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error actualizando la sede" },
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

    const sede = await Sede.findById(id);
    if (!sede) {
      return NextResponse.json(
        { error: "Sede no encontrada" },
        { status: 404 }
      );
    }

    // Buscar edificios de la sede
    const edificios = await Edificio.find({ sede_id: id });
    const edificioIds = edificios.map((e) => e._id);

    // Eliminar aulas asociadas a los edificios
    await Aula.deleteMany({ edificio_id: { $in: edificioIds } });

    // Eliminar los edificios
    await Edificio.deleteMany({ sede_id: id });

    // Finalmente eliminar la sede
    await Sede.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Sede y todos sus edificios y aulas eliminados correctamente",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error eliminando la sede" },
      { status: 500 }
    );
  }
}
