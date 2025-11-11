import connectToDB from "./mongodb";
import Sede from "../models/Sede";
import Edificio from "../models/Edificio";
import Aula from "../models/Aula";
import Materia from "../models/Materia";
import Comision from "../models/Comision";
import Carrera from "../models/Carrera"; // Import Carrera
import { unstable_noStore as noStore } from "next/cache";

// Helper to serialize MongoDB documents to plain objects
export function serialize(docs) {
  return JSON.parse(
    JSON.stringify(docs, (key, value) =>
      typeof value === "object" && value?._bsontype === "ObjectID"
        ? value.toString()
        : value
    )
  );
}

// --- SEDE ---
export async function getSedes() {
  noStore();
  try {
    await connectToDB();
    const sedes = await Sede.find({});
    return serialize(sedes);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch sedes.");
  }
}

export async function getSedeById(id) {
  noStore();
  try {
    await connectToDB();
    const sede = await Sede.findOne({ _id: id });
    return serialize(sede);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch sede.");
  }
}

// --- EDIFICIO ---
export async function getEdificios() {
  noStore();
  try {
    await connectToDB();
    const edificios = await Edificio.find({}).populate({
      path: "sede_id",
    });
    return serialize(edificios);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch edificios.");
  }
}

export async function getEdificioById(id) {
  noStore();
  try {
    await connectToDB();
    const edificio = await Edificio.findOne({
      _id: id,
    }).populate({
      path: "sede_id",
    });
    return serialize(edificio);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch edificio.");
  }
}

export async function getEdificiosBySede(sedeId) {
  noStore();
  try {
    await connectToDB();
    const edificios = await Edificio.find({ sede_id: sedeId });
    return serialize(edificios);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch edificios for sede.");
  }
}

// --- AULA ---
export async function getAulas() {
  noStore();
  try {
    await connectToDB();
    const aulas = await Aula.find({}).populate({
      path: "edificio_id",
      match: {},
      populate: {
        path: "sede_id",
        match: {},
      },
    });
    return serialize(aulas);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch aulas.");
  }
}

export async function getAulasByEdificio(edificioId) {
  noStore();
  try {
    await connectToDB();
    const aulas = await Aula.find({ edificio_id: edificioId });
    return serialize(aulas);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch aulas for edificio.");
  }
}

// --- CARRERA ---
export async function getCarreras() {
  noStore();
  try {
    await connectToDB();
    const carreras = await Carrera.find({ deletedAt: null });
    return serialize(carreras);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch carreras.");
  }
}

export async function getCarreraById(id) {
  noStore();
  try {
    await connectToDB();
    const carrera = await Carrera.findOne({ _id: id, deletedAt: null });
    return serialize(carrera);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch carrera by id.");
  }
}

export async function createCarrera(data) {
  try {
    await connectToDB();

    const existing = await Carrera.findOne({
      $or: [
        { nombre_carrera: data.nombre_carrera.trim() },
        { codigo_carrera: data.codigo_carrera.trim() },
      ],
      deletedAt: null,
    });

    if (existing) throw new Error("La carrera ya existe (nombre o código).");

    const nuevaCarrera = new Carrera({
      codigo_carrera: data.codigo_carrera.trim(),
      nombre_carrera: data.nombre_carrera.trim(),
      anios: data.anios,
      sede_ids: Array.isArray(data.sede_ids) ? data.sede_ids : [],
    });

    await nuevaCarrera.save();
    return serialize(nuevaCarrera);
  } catch (error) {
    console.error("Error creating carrera:", error);
    throw error;
  }
}


export async function updateCarrera(id, data) {
  try {
    await connectToDB();
    const carrera = await Carrera.findByIdAndUpdate(id, data, { new: true });
    return serialize(carrera);
  } catch (error) {
    console.error("Error updating carrera:", error);
    throw error;
  }
}

export async function deleteCarrera(id) {
  try {
    await connectToDB();
    const carrera = await Carrera.findByIdAndUpdate(id, { deletedAt: new Date() });
    return serialize(carrera);
  } catch (error) {
    console.error("Error deleting carrera:", error);
    throw error;
  }
}


// --- MATERIA ---
export async function getMaterias() {
  noStore();
  try {
    await connectToDB();
    const materias = await Materia.find({ deletedAt: null }).populate("carrera_id");
    return serialize(materias);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch materias.");
  }
}

export async function getMateriaById(id) {
  try {
    await connectToDB();
    const materia = await Materia.findOne({ _id: id, deletedAt: null }).populate("carrera_id");
    return serialize(materia);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch materia.");
  }
}

export async function createMateria(data) {
  try {
    await connectToDB();

    // Validación: código único global (activo) y nombre único por carrera (activo)
    const codeClash = await Materia.findOne({
      codigo_materia: data.codigo_materia.trim(),
      deletedAt: null,
    });
    if (codeClash) throw new Error("Ya existe una materia con ese código.");

    const nameClash = await Materia.findOne({
      nombre_materia: data.nombre_materia.trim(),
      carrera_id: data.carrera_id,
      deletedAt: null,
    });
    if (nameClash) throw new Error("Ya existe una materia con ese nombre en esta carrera.");

    const nuevaMateria = new Materia({
      codigo_materia: data.codigo_materia.trim(),
      nombre_materia: data.nombre_materia.trim(),
      carrera_id: data.carrera_id,
      anio_carrera: data.anio_carrera,
      cuatrimestre: data.cuatrimestre,
    });

    await nuevaMateria.save();
    return serialize(nuevaMateria);
  } catch (error) {
    console.error("Error creating materia:", error);
    throw error;
  }
}

export async function updateMateria(id, data) {
  try {
    await connectToDB();
    const materia = await Materia.findByIdAndUpdate(id, data, { new: true });
    return serialize(materia);
  } catch (error) {
    console.error("Error updating materia:", error);
    throw error;
  }
}

export async function deleteMateria(id) {
  try {
    await connectToDB();
    const materia = await Materia.findByIdAndUpdate(id, { deletedAt: new Date() });
    return serialize(materia);
  } catch (error) {
    console.error("Error deleting materia:", error);
    throw error;
  }
}



// --- COMISION ---
export async function getComisiones() {
  try {
    await connectToDB();
    const comisiones = await Comision.find({ deletedAt: null })
      .populate({
        path: "materia_ids",
        populate: { path: "carrera_id" },
      })
      .populate("asignacion.aula_id");

    return serialize(comisiones);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch comisiones.");
  }
}

