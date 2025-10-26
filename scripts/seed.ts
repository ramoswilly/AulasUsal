import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import Sede from '../src/models/Sede';
import Edificio from '../src/models/Edificio';
import Aula from '../src/models/Aula';
import Carrera from '../src/models/Carrera';
import Materia from '../src/models/Materia';
import Comision from '../src/models/Comision';

const MONGODB_URI = process.env.MONGODB_URI;

const seedDatabase = async () => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI no está definida en .env.local');
  }

  await mongoose.connect(MONGODB_URI);

  console.log('Limpiando la base de datos...');
  await Promise.all([
    Sede.deleteMany({}),
    Edificio.deleteMany({}),
    Aula.deleteMany({}),
    Carrera.deleteMany({}),
    Materia.deleteMany({}),
    Comision.deleteMany({}),
  ]);

  console.log('Base de datos limpiada.');

  console.log('Cargando Sedes...');
  const sedes = await Sede.insertMany([
    { nombre: 'Sede Centro', direccion: 'Dirección Centro' },
    { nombre: 'Campus Pilar', direccion: 'Dirección Pilar' },
  ]);
  const sedeCentro = sedes.find(s => s.nombre === 'Sede Centro');

  console.log('Cargando Edificios...');
  const edificios = await Edificio.insertMany([
    { nombre: 'Centro Tecnológico', tipo: 'Centro Tecnológico', sede_id: sedeCentro._id },
  ]);
  const ct = edificios[0];

  console.log('Cargando Aulas...');
  const aulas = await Aula.insertMany([
    { nombre_o_numero: 'Aula 101', capacidad: 50, tipo_aula: 'Común', edificio_id: ct._id },
    { nombre_o_numero: 'Laboratorio 1', capacidad: 25, tipo_aula: 'Laboratorio', edificio_id: ct._id },
  ]);
  const aula101 = aulas[0];

  console.log('Cargando Carreras...');
  const carreras = await Carrera.insertMany([
      { nombre_carrera: 'Ingeniería en Informática', codigo_carrera: 'IINF', anios: 5 },
      { nombre_carrera: 'Licenciatura en Psicología', codigo_carrera: 'LPSI', anios: 5 },
  ]);
  const ingInformatica = carreras.find(c => c.nombre_carrera === 'Ingeniería en Informática');

  console.log('Cargando Materias...');
  const materias = await Materia.insertMany([
    { nombre_materia: 'Análisis Matemático I', codigo_materia: 'AMI', carrera_id: ingInformatica._id},
    { nombre_materia: 'Introducción a la Programación', codigo_materia: 'IP', carrera_id: ingInformatica._id },
    { nombre_materia: 'Sistemas de Bases de Datos', codigo_materia: 'SBD', carrera_id: ingInformatica._id },
  ]);
  const am1 = materias.find(m => m.nombre_materia === 'Análisis Matemático I');

  console.log('Cargando Comisiones...');
  await Comision.insertMany([
    {
      nombre_comision: '1º-NOCHE',
      anio_dictado: 2024,
      inscriptos: 30,
      profesor: 'Maciel Abel',
      horario: { dia: 'Lunes', turno: 'NOCHE' },
      asignacion: {
        aula_id: aula101._id,
        fecha_asignacion: new Date(),
      },
      materia_id: am1._id,
      carrera_ids: [ingInformatica._id],
      anio_por_carrera: [{
        carrera_id: ingInformatica._id,
        anio: 1
      }]
    },
  ]);

  console.log('¡Datos de prueba cargados exitosamente!');

  await mongoose.connection.close();
};

seedDatabase().catch(err => {
  console.error('Error cargando datos:', err);
  mongoose.connection.close();
});