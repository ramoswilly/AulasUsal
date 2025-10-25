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
  noStore(); // Opt out of static rendering
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
    const sede = await Sede.findById(id);
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
    const edificios = await Edificio.find({}).populate("sede_id");
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
    const edificio = await Edificio.findById(id).populate("sede_id");
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
      populate: {
        path: "sede_id",
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
    const carreras = await Carrera.find({});
    return serialize(carreras);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch carreras.");
  }
}

// --- MATERIA ---
export async function getMaterias() {
  noStore();
  try {
    await connectToDB();
    const materias = await Materia.find({}).populate("carrera_id");
    return serialize(materias);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch materias.");
  }
}

// --- COMISION ---
export async function getComisiones() {
  noStore();
  try {
    await connectToDB();
    const comisiones = await Comision.find({})
      .populate("materia_ids")
      .populate("asignacion.aula_id");
    return serialize(comisiones);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch comisiones.");
  }
}

/*
NOTE: The original file also had 'resources' and 'programs'.
'programs' has now been implemented as 'Carreras'.
'resources' are still not in the schema.
*/
