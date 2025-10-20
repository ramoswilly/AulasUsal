import type { Campus, Building, Classroom, Resource, Program, Course, Section } from './types';

export const resources: Resource[] = [
  { id: 'res-1', name: 'Cañón' },
  { id: 'res-2', name: 'PC' },
  { id: 'res-3', name: 'Laboratorio' },
  { id: 'res-4', name: 'Pizarra Digital' },
  { id: 'res-5', name: 'Micrófono' },
];

export const campuses: Campus[] = [
    { id: 'campus-1', name: 'Sede Centro' },
    { id: 'campus-2', name: 'Campus Pilar' },
];

export const buildings: Building[] = [
    { id: 'building-1', name: 'Centro Tecnológico', label: 'Centro Tecnológico', campusId: 'campus-1' },
    { id: 'building-2', name: 'Edificio de Humanidades', label: 'Edificio de Carrera', campusId: 'campus-1' },
    { id: 'building-3', name: 'Módulo A', label: 'Módulo', campusId: 'campus-2' },
    { id: 'building-4', name: 'Edificio Anexo', label: 'Genérico', campusId: 'campus-2' },
    { id: 'building-5', name: 'Centro tecnologico A', label: 'Laboratorio', campusId: 'campus-2' },
    { id: 'building-6', name: 'Edificio veterinaria', label: 'Edificio veterinario', campusId: 'campus-2' },
];

export const classrooms: Classroom[] = [
  // Campus 1, Building 1
  { id: 'room-101', name: 'Aula 101', buildingId: 'building-1', capacity: 50, resources: ['res-1', 'res-2'] },
  { id: 'room-102', name: 'Aula 102', buildingId: 'building-1', capacity: 30, resources: ['res-1'] },
  { id: 'room-103', name: 'Laboratorio 1', buildingId: 'building-1', capacity: 25, resources: ['res-2', 'res-3'] },
  // Campus 1, Building 2
  { id: 'room-201', name: 'Aula 201', buildingId: 'building-2', capacity: 60, resources: ['res-1', 'res-4'] },
  { id: 'room-202', name: 'Aula Magna', buildingId: 'building-2', capacity: 150, resources: ['res-1', 'res-5'] },
  // Campus 2, Building 3
  { id: 'room-301', name: 'Aula 301', buildingId: 'building-3', capacity: 40, resources: [] },
  { id: 'room-302', name: 'Aula 302', buildingId: 'building-3', capacity: 40, resources: ['res-1'] },
  // Campus 2, Building 4
  { id: 'room-401', name: 'Aula 401', buildingId: 'building-4', capacity: 75, resources: ['res-1', 'res-2', 'res-4'] },
];

export const programs: Program[] = [
  { id: 'prog-1', name: 'Ingeniería en Informática' },
  { id: 'prog-2', name: 'Licenciatura en Psicología' },
  { id: 'prog-3', name: 'Arquitectura' },
];

export const courses: Course[] = [
    // 1st Year
    { id: '142-01/05/06', name: 'Análisis Matemático I', programId: 'prog-1', year: 1 },
    { id: '141-01/05/06', name: 'Sistemas Numéricos', programId: 'prog-1', year: 1 },
    { id: '144-05/06', name: 'Introducción a la Programación', programId: 'prog-1', year: 1 },
    { id: '143-05/06', name: 'Metodología de la Investigación', programId: 'prog-1', year: 1 },
    { id: '146-01/05/06', name: 'Álgebra I', programId: 'prog-1', year: 1 },
    { id: '149-01/06', name: 'Sistemas de Representación', programId: 'prog-1', year: 1 },
    { id: '147-05/06', name: 'Paradigmas de Programación', programId: 'prog-1', year: 1 },
    { id: '148-05/06', name: 'Programación I', programId: 'prog-1', year: 1 },
    { id: '154-01/05/06', name: 'Álgebra II', programId: 'prog-1', year: 1 },
    { id: '145-01/05/06', name: 'Arquitectura de Computadoras', programId: 'prog-1', year: 1 },
    { id: '159-01/06', name: 'Química General', programId: 'prog-1', year: 1 },
    
    // 2nd Year
    { id: '158-01/05/06', name: 'Análisis Matemático II', programId: 'prog-1', year: 2 },
    { id: '140-05/06', name: 'Intr. a la Admin. de Empresas', programId: 'prog-1', year: 2 },
    { id: '153-05/06', name: 'Sistemas de Información I', programId: 'prog-1', year: 2 },
    { id: '150-06', name: 'Física I', programId: 'prog-1', year: 2 },
    { id: '151-01/05/06', name: 'Cálculo Numérico', programId: 'prog-1', year: 2 },
    { id: '152-05/06', name: 'Estructuras de Datos y Algoritmos', programId: 'prog-1', year: 2 },
    { id: '156-05/06', name: 'Programación II', programId: 'prog-1', year: 2 },
    { id: '150-06-2', name: 'Física II', programId: 'prog-1', year: 2 }, 
    { id: '155-01/05/06', name: 'Filosofía', programId: 'prog-1', year: 2 },
    { id: '157-05/06', name: 'Teoría de Lenguajes', programId: 'prog-1', year: 2 },

    // 3rd Year
    { id: '163-05/06', name: 'Sistemas de Bases de Datos', programId: 'prog-1', year: 3 },
    { id: '161-05/06', name: 'Sistemas Operativos', programId: 'prog-1', year: 3 },
    { id: 'r165-05/06', name: 'Programación Avanzada', programId: 'prog-1', year: 3 },
    { id: '164-05/06', name: 'Probabilidad y Estadística', programId: 'prog-1', year: 3 },
    { id: '162-05/06', name: 'Sistemas de Información II', programId: 'prog-1', year: 3 },
    { id: '166-05/06', name: 'Teleinformática', programId: 'prog-1', year: 3 },

    // 4th Year
    { id: '178-05/06', name: 'Modelos y Simulación', programId: 'prog-1', year: 4 },
    { id: '170-05/06', name: 'Tecnología Informática', programId: 'prog-1', year: 4 },
    { id: '173-05/06', name: 'Investigación Operativa', programId: 'prog-1', year: 4 },
    { id: '174-05/06', name: 'Arquitectura de Redes', programId: 'prog-1', year: 4 },
    { id: '172-05/06', name: 'Seminario de Integ. Profesional', programId: 'prog-1', year: 4 },
    { id: '176-05/06', name: 'Auditoría de Sistemas', programId: 'prog-1', year: 4 },
    { id: '171-DS/D6', name: 'Ingeniería del Software', programId: 'prog-1', year: 4 },
    { id: '177-01/05/06', name: 'Teología', programId: 'prog-1', year: 4 },
    { id: '175-06', name: 'Dir. de Proyectos Informáticos', programId: 'prog-1', year: 4 },
    { id: '180-01/05/06', name: 'Ética Profesional', programId: 'prog-1', year: 4 },
    { id: '179-05/06', name: 'Derecho Informático', programId: 'prog-1', year: 4 },
    { id: 'pps-4', name: 'PPS Práctica Profesional Supervisada', programId: 'prog-1', year: 4 },

    // 5th Year
    { id: '187-01/05/06', name: 'Elementos de Economía', programId: 'prog-1', year: 5 },
    { id: '184-06', name: 'Gestión Ambiental', programId: 'prog-1', year: 5 },
    { id: '183-06', name: 'Proyecto Final de Ing. Informática', programId: 'prog-1', year: 5 },
    { id: '181-06', name: 'Tecnologías Emergentes', programId: 'prog-1', year: 5 },
    { id: '186-05/06', name: 'Seguridad Informática', programId: 'prog-1', year: 5 },
    { id: '185-06', name: 'Aseguramiento de La Calidad', programId: 'prog-1', year: 5 },
    { id: '182-05/06', name: 'Sistemas Inteligentes', programId: 'prog-1', year: 5 },
];

export const sections: Section[] = [
    // 1º AÑO - TURNO NOCHE
    { id: 'sec-1-n-1', courseId: '142-01/05/06', commission: '1º-NOCHE', semester: 1, days: ['Lunes'], startTime: '18:30', endTime: '20:00', professor: 'Maciel Abel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-n-2', courseId: '142-01/05/06', commission: '1º-NOCHE', semester: 1, days: ['Lunes'], startTime: '20:15', endTime: '21:30', professor: 'Maciel Abel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-n-3', courseId: '142-01/05/06', commission: '1º-NOCHE', semester: 2, days: ['Lunes'], startTime: '18:30', endTime: '20:00', professor: 'Maciel Abel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-n-4', courseId: '142-01/05/06', commission: '1º-NOCHE', semester: 2, days: ['Lunes'], startTime: '20:15', endTime: '21:30', professor: 'Maciel Abel', enrolledStudents: 30, desiredResources: [] },
    
    { id: 'sec-1-n-5', courseId: '141-01/05/06', commission: '1º-NOCHE', semester: 1, days: ['Martes'], startTime: '18:30', endTime: '20:00', professor: 'Paez Roberto', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-n-6', courseId: '141-01/05/06', commission: '1º-NOCHE', semester: 1, days: ['Martes'], startTime: '20:15', endTime: '21:30', professor: 'Paez Roberto', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-n-7', courseId: '147-05/06', commission: '1º-NOCHE', semester: 2, days: ['Martes'], startTime: '18:30', endTime: '20:00', professor: 'Rebagliati Pablo', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-1-n-8', courseId: '147-05/06', commission: '1º-NOCHE', semester: 2, days: ['Martes'], startTime: '20:15', endTime: '21:30', professor: 'Rebagliati Pablo', enrolledStudents: 30, desiredResources: ['res-2'] },

    { id: 'sec-1-n-9', courseId: '144-05/06', commission: '1º-NOCHE', semester: 1, days: ['Miércoles'], startTime: '18:30', endTime: '20:00', professor: 'Rodriguez Goñi, Cecilia', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-1-n-10', courseId: '144-05/06', commission: '1º-NOCHE', semester: 1, days: ['Miércoles'], startTime: '20:15', endTime: '21:30', professor: 'Rodriguez Goñi, Cecilia', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-1-n-11', courseId: '148-05/06', commission: '1º-NOCHE', semester: 2, days: ['Miércoles'], startTime: '18:30', endTime: '20:00', professor: 'Rodriguez Goñi, Cecilia', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-1-n-12', courseId: '148-05/06', commission: '1º-NOCHE', semester: 2, days: ['Miércoles'], startTime: '20:15', endTime: '21:30', professor: 'Rodríguez Goñi, Cecilia', enrolledStudents: 30, desiredResources: ['res-2'] },

    { id: 'sec-1-n-13', courseId: '143-05/06', commission: '1º-NOCHE', semester: 1, days: ['Jueves'], startTime: '18:30', endTime: '20:00', professor: 'Chinni Guillermo', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-n-14', courseId: '143-05/06', commission: '1º-NOCHE', semester: 1, days: ['Jueves'], startTime: '20:15', endTime: '21:30', professor: 'Chinni Guillermo', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-n-15', courseId: '154-01/05/06', commission: '1º-NOCHE', semester: 2, days: ['Jueves'], startTime: '18:30', endTime: '20:00', professor: 'Barrios Carlos', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-n-16', courseId: '154-01/05/06', commission: '1º-NOCHE', semester: 2, days: ['Jueves'], startTime: '20:15', endTime: '21:30', professor: 'Barrios Carlos', enrolledStudents: 30, desiredResources: [] },
    
    { id: 'sec-1-n-17', courseId: '146-01/05/06', commission: '1º-NOCHE', semester: 1, days: ['Viernes'], startTime: '18:30', endTime: '20:00', professor: 'Barrios Carlos', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-n-18', courseId: '146-01/05/06', commission: '1º-NOCHE', semester: 1, days: ['Viernes'], startTime: '20:15', endTime: '21:30', professor: 'Barrios Carlos', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-n-19', courseId: '145-01/05/06', commission: '1º-NOCHE', semester: 2, days: ['Viernes'], startTime: '18:30', endTime: '20:00', professor: 'Paez Roberto', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-1-n-20', courseId: '145-01/05/06', commission: '1º-NOCHE', semester: 2, days: ['Viernes'], startTime: '20:15', endTime: '21:30', professor: 'Paez Roberto', enrolledStudents: 30, desiredResources: ['res-2'] },

    { id: 'sec-1-n-21', courseId: '149-01/06', commission: '1º-NOCHE', semester: 1, days: ['Sábado'], startTime: '18:30', endTime: '20:00', professor: 'Ríos Noelia', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-n-22', courseId: '149-01/06', commission: '1º-NOCHE', semester: 1, days: ['Sábado'], startTime: '20:15', endTime: '21:30', professor: 'Ríos Noelia', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-n-23', courseId: '159-01/06', commission: '1º-NOCHE', semester: 2, days: ['Sábado'], startTime: '18:30', endTime: '20:00', professor: 'Buela Juan', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-n-24', courseId: '159-01/06', commission: '1º-NOCHE', semester: 2, days: ['Sábado'], startTime: '20:15', endTime: '21:30', professor: 'Buela Juan', enrolledStudents: 30, desiredResources: [] },

    // 2º AÑO - TURNO NOCHE
    { id: 'sec-2-n-1', courseId: '158-01/05/06', commission: '2º-NOCHE', semester: 1, days: ['Lunes'], startTime: '18:30', endTime: '20:00', professor: 'Acosta Cesar', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-n-2', courseId: '158-01/05/06', commission: '2º-NOCHE', semester: 1, days: ['Lunes'], startTime: '20:15', endTime: '21:30', professor: 'Acosta Cesar', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-n-3', courseId: '140-05/06', commission: '2º-NOCHE', semester: 2, days: ['Lunes'], startTime: '18:30', endTime: '20:00', professor: 'Consiglio, Abel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-n-4', courseId: '140-05/06', commission: '2º-NOCHE', semester: 2, days: ['Lunes'], startTime: '20:15', endTime: '21:30', professor: 'Consiglio Abel', enrolledStudents: 30, desiredResources: [] },

    { id: 'sec-2-n-5', courseId: '153-05/06', commission: '2º-NOCHE', semester: 1, days: ['Martes'], startTime: '18:30', endTime: '20:00', professor: 'Fernández Claudio', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-n-6', courseId: '153-05/06', commission: '2º-NOCHE', semester: 1, days: ['Martes'], startTime: '20:15', endTime: '21:30', professor: 'Fernández Claudio', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-n-7', courseId: '153-05/06', commission: '2º-NOCHE', semester: 2, days: ['Martes'], startTime: '18:30', endTime: '20:00', professor: 'Fernández Claudio', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-n-8', courseId: '153-05/06', commission: '2º-NOCHE', semester: 2, days: ['Martes'], startTime: '20:15', endTime: '21:30', professor: 'Fernández Claudio', enrolledStudents: 30, desiredResources: [] },

    { id: 'sec-2-n-9', courseId: '150-06', commission: '2º-NOCHE', semester: 1, days: ['Miércoles'], startTime: '18:30', endTime: '20:00', professor: 'Buela Juan', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-n-10', courseId: '150-06', commission: '2º-NOCHE', semester: 1, days: ['Miércoles'], startTime: '20:15', endTime: '21:30', professor: 'Buela Juan', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-n-11', courseId: '151-01/05/06', commission: '2º-NOCHE', semester: 2, days: ['Miércoles'], startTime: '18:30', endTime: '20:00', professor: 'Acosta Cesar', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-n-12', courseId: '151-01/05/06', commission: '2º-NOCHE', semester: 2, days: ['Miércoles'], startTime: '20:15', endTime: '21:30', professor: 'Acosta Cesar', enrolledStudents: 30, desiredResources: [] },

    { id: 'sec-2-n-13', courseId: '152-05/06', commission: '2º-NOCHE', semester: 1, days: ['Jueves'], startTime: '18:30', endTime: '20:00', professor: 'Mengide Juan Pablo', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-2-n-14', courseId: '152-05/06', commission: '2º-NOCHE', semester: 1, days: ['Jueves'], startTime: '20:15', endTime: '21:30', professor: 'Mengide Juan Pablo', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-2-n-15', courseId: '152-05/06', commission: '2º-NOCHE', semester: 2, days: ['Jueves'], startTime: '18:30', endTime: '20:00', professor: 'Mengide Juan Pablo', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-2-n-16', courseId: '152-05/06', commission: '2º-NOCHE', semester: 2, days: ['Jueves'], startTime: '20:15', endTime: '21:30', professor: 'Mengide Juan Pablo', enrolledStudents: 30, desiredResources: ['res-2'] },
    
    { id: 'sec-2-n-17', courseId: '156-05/06', commission: '2º-NOCHE', semester: 1, days: ['Viernes'], startTime: '18:30', endTime: '20:00', professor: 'Rebagliati Pablo', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-2-n-18', courseId: '156-05/06', commission: '2º-NOCHE', semester: 1, days: ['Viernes'], startTime: '20:15', endTime: '21:30', professor: 'Rebagliati Pablo', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-2-n-19', courseId: '150-06-2', commission: '2º-NOCHE', semester: 2, days: ['Viernes'], startTime: '18:30', endTime: '20:00', professor: 'Barrios, Carlos', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-n-20', courseId: '150-06-2', commission: '2º-NOCHE', semester: 2, days: ['Viernes'], startTime: '20:15', endTime: '21:30', professor: 'Barrios, Carlos', enrolledStudents: 30, desiredResources: [] },
    
    { id: 'sec-2-n-21', courseId: '155-01/05/06', commission: '2º-NOCHE', semester: 1, days: ['Sábado'], startTime: '18:30', endTime: '20:00', professor: 'Carla Ferreyra', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-n-22', courseId: '155-01/05/06', commission: '2º-NOCHE', semester: 1, days: ['Sábado'], startTime: '20:15', endTime: '21:30', professor: 'Carla Ferreyra', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-n-23', courseId: '157-05/06', commission: '2º-NOCHE', semester: 2, days: ['Sábado'], startTime: '18:30', endTime: '20:00', professor: 'Abud, Hector', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-n-24', courseId: '157-05/06', commission: '2º-NOCHE', semester: 2, days: ['Sábado'], startTime: '20:15', endTime: '21:30', professor: 'Abud, Hector', enrolledStudents: 30, desiredResources: [] },

    // 3º AÑO - TURNO NOCHE
    { id: 'sec-3-n-1', courseId: '163-05/06', commission: '3º-NOCHE', semester: 1, days: ['Lunes'], startTime: '18:30', endTime: '20:00', professor: 'Henriksen, Silvina', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-n-2', courseId: '163-05/06', commission: '3º-NOCHE', semester: 1, days: ['Lunes'], startTime: '20:15', endTime: '21:30', professor: 'Henriksen, Silvina', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-n-3', courseId: '163-05/06', commission: '3º-NOCHE', semester: 2, days: ['Lunes'], startTime: '18:30', endTime: '20:00', professor: 'Henriksen, Silvina', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-n-4', courseId: '163-05/06', commission: '3º-NOCHE', semester: 2, days: ['Lunes'], startTime: '20:15', endTime: '21:30', professor: 'Henriksen, Silvina', enrolledStudents: 30, desiredResources: [] },
    
    { id: 'sec-3-n-5', courseId: '161-05/06', commission: '3º-NOCHE', semester: 1, days: ['Martes'], startTime: '18:30', endTime: '20:00', professor: 'Consiglio, Abel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-n-6', courseId: '161-05/06', commission: '3º-NOCHE', semester: 1, days: ['Martes'], startTime: '20:15', endTime: '21:30', professor: 'Consiglio, Abel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-n-7', courseId: '161-05/06', commission: '3º-NOCHE', semester: 2, days: ['Martes'], startTime: '18:30', endTime: '20:00', professor: 'Consiglio, Abel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-n-8', courseId: '161-05/06', commission: '3º-NOCHE', semester: 2, days: ['Martes'], startTime: '20:15', endTime: '21:30', professor: 'Consilio. Abel', enrolledStudents: 30, desiredResources: [] },

    { id: 'sec-3-n-9', courseId: 'r165-05/06', commission: '3º-NOCHE', semester: 1, days: ['Miércoles'], startTime: '18:30', endTime: '20:00', professor: 'Macrino Matías Weingand Gastón', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-3-n-10', courseId: 'r165-05/06', commission: '3º-NOCHE', semester: 1, days: ['Miércoles'], startTime: '20:15', endTime: '21:30', professor: 'Macrino Matías Weingand Gastón', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-3-n-11', courseId: 'r165-05/06', commission: '3º-NOCHE', semester: 2, days: ['Miércoles'], startTime: '18:30', endTime: '20:00', professor: 'Macrino Matías Weingand Gastón', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-3-n-12', courseId: 'r165-05/06', commission: '3º-NOCHE', semester: 2, days: ['Miércoles'], startTime: '20:15', endTime: '21:30', professor: 'Macrino Matías Weingand Gastón', enrolledStudents: 30, desiredResources: ['res-2'] },

    { id: 'sec-3-n-13', courseId: '164-05/06', commission: '3º-NOCHE', semester: 1, days: ['Jueves'], startTime: '18:30', endTime: '20:00', professor: 'Acosta Cesar', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-n-14', courseId: '164-05/06', commission: '3º-NOCHE', semester: 1, days: ['Jueves'], startTime: '20:15', endTime: '21:30', professor: 'Acosta Cesar', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-n-15', courseId: '164-05/06', commission: '3º-NOCHE', semester: 2, days: ['Jueves'], startTime: '18:30', endTime: '20:00', professor: 'Acosta Cesar', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-n-16', courseId: '164-05/06', commission: '3º-NOCHE', semester: 2, days: ['Jueves'], startTime: '20:15', endTime: '21:30', professor: 'Acosta Cesar', enrolledStudents: 30, desiredResources: [] },

    { id: 'sec-3-n-17', courseId: '162-05/06', commission: '3º-NOCHE', semester: 1, days: ['Viernes'], startTime: '18:30', endTime: '20:00', professor: 'Claudio Fernández', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-n-18', courseId: '162-05/06', commission: '3º-NOCHE', semester: 1, days: ['Viernes'], startTime: '20:15', endTime: '21:30', professor: 'Claudio Fernández', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-n-19', courseId: '162-05/06', commission: '3º-NOCHE', semester: 2, days: ['Viernes'], startTime: '18:30', endTime: '20:00', professor: 'Claudio Fernández', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-n-20', courseId: '162-05/06', commission: '3º-NOCHE', semester: 2, days: ['Viernes'], startTime: '20:15', endTime: '21:30', professor: 'Claudio Fernández', enrolledStudents: 30, desiredResources: [] },

    { id: 'sec-3-n-21', courseId: '166-05/06', commission: '3º-NOCHE', semester: 1, days: ['Sábado'], startTime: '18:30', endTime: '20:00', professor: 'Seccatore, Miguel', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-3-n-22', courseId: '166-05/06', commission: '3º-NOCHE', semester: 1, days: ['Sábado'], startTime: '20:15', endTime: '21:30', professor: 'Seccatore, Miguel', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-3-n-23', courseId: '166-05/06', commission: '3º-NOCHE', semester: 2, days: ['Sábado'], startTime: '18:30', endTime: '20:00', professor: 'Seccatore, Miguel', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-3-n-24', courseId: '166-05/06', commission: '3º-NOCHE', semester: 2, days: ['Sábado'], startTime: '20:15', endTime: '21:30', professor: 'Seccatore, Miguel', enrolledStudents: 30, desiredResources: ['res-2'] },
    
    // 4º AÑO - TURNO NOCHE
    { id: 'sec-4-n-1', courseId: '178-05/06', commission: '4º-NOCHE', semester: 1, days: ['Lunes'], startTime: '18:30', endTime: '20:00', professor: 'Romera Nahuel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-4-n-2', courseId: '178-05/06', commission: '4º-NOCHE', semester: 1, days: ['Lunes'], startTime: '20:15', endTime: '21:30', professor: 'Romera Nahuel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-4-n-3', courseId: '170-05/06', commission: '4º-NOCHE', semester: 2, days: ['Lunes'], startTime: '18:30', endTime: '20:00', professor: 'Serralta Gabriel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-4-n-4', courseId: '170-05/06', commission: '4º-NOCHE', semester: 2, days: ['Lunes'], startTime: '20:15', endTime: '21:30', professor: 'Serralta Gabriel', enrolledStudents: 30, desiredResources: [] },
    
    { id: 'sec-4-n-5', courseId: '173-05/06', commission: '4º-NOCHE', semester: 1, days: ['Martes'], startTime: '18:30', endTime: '20:00', professor: 'Herrera Javier', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-4-n-6', courseId: '173-05/06', commission: '4º-NOCHE', semester: 1, days: ['Martes'], startTime: '20:15', endTime: '21:30', professor: 'Herrera Javier', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-4-n-7', courseId: '174-05/06', commission: '4º-NOCHE', semester: 2, days: ['Martes'], startTime: '18:30', endTime: '20:00', professor: 'Inverni, Pablo', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-4-n-8', courseId: '174-05/06', commission: '4º-NOCHE', semester: 2, days: ['Martes'], startTime: '20:15', endTime: '21:30', professor: 'Inverni, Pablo', enrolledStudents: 30, desiredResources: ['res-2'] },

    { id: 'sec-4-n-9', courseId: '172-05/06', commission: '4º-NOCHE', semester: 1, days: ['Miércoles'], startTime: '18:30', endTime: '20:00', professor: 'Machain Martin Azul De León Aboy Azul Nievas Ciro', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-4-n-10', courseId: '172-05/06', commission: '4º-NOCHE', semester: 1, days: ['Miércoles'], startTime: '20:15', endTime: '21:30', professor: 'Machain Martin Azul De León Aboy Azul Nievas Ciro', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-4-n-11', courseId: '172-05/06', commission: '4º-NOCHE', semester: 2, days: ['Miércoles'], startTime: '18:30', endTime: '20:00', professor: 'Machain Martin De León Aboy Azul Nievas Ciro', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-4-n-12', courseId: '172-05/06', commission: '4º-NOCHE', semester: 2, days: ['Miércoles'], startTime: '20:15', endTime: '21:30', professor: 'Machain Martin De León Aboy Azul Nievas Ciro', enrolledStudents: 30, desiredResources: [] },

    { id: 'sec-4-n-13', courseId: '176-05/06', commission: '4º-NOCHE', semester: 1, days: ['Jueves'], startTime: '18:30', endTime: '20:00', professor: 'Fernández Claudio', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-4-n-14', courseId: '176-05/06', commission: '4º-NOCHE', semester: 1, days: ['Jueves'], startTime: '20:15', endTime: '21:30', professor: 'Fernández Claudio', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-4-n-15', courseId: '171-DS/D6', commission: '4º-NOCHE', semester: 2, days: ['Jueves'], startTime: '18:30', endTime: '20:00', professor: 'Fernández Claudio', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-4-n-16', courseId: '171-DS/D6', commission: '4º-NOCHE', semester: 2, days: ['Jueves'], startTime: '20:15', endTime: '21:30', professor: 'Fernández Claudio', enrolledStudents: 30, desiredResources: ['res-2'] },

    { id: 'sec-4-n-17', courseId: '177-01/05/06', commission: '4º-NOCHE', semester: 1, days: ['Viernes'], startTime: '18:30', endTime: '20:00', professor: 'Sabatino Karina', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-4-n-18', courseId: '177-01/05/06', commission: '4º-NOCHE', semester: 1, days: ['Viernes'], startTime: '20:15', endTime: '21:30', professor: 'Sabatino Karina', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-4-n-19', courseId: '175-06', commission: '4º-NOCHE', semester: 2, days: ['Viernes'], startTime: '18:30', endTime: '20:00', professor: 'Rodriguez Esquivel Walter Sarlo Daniel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-4-n-20', courseId: '175-06', commission: '4º-NOCHE', semester: 2, days: ['Viernes'], startTime: '20:15', endTime: '21:30', professor: 'Rodriguez Esquivel Walter Sarlo Daniel', enrolledStudents: 30, desiredResources: [] },

    { id: 'sec-4-n-21', courseId: '180-01/05/06', commission: '4º-NOCHE', semester: 1, days: ['Sábado'], startTime: '18:30', endTime: '20:00', professor: 'D\'Urbano Gustavo', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-4-n-22', courseId: '180-01/05/06', commission: '4º-NOCHE', semester: 1, days: ['Sábado'], startTime: '20:15', endTime: '21:30', professor: 'D\'Urbano Gustavo', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-4-n-23', courseId: '179-05/06', commission: '4º-NOCHE', semester: 2, days: ['Sábado'], startTime: '18:30', endTime: '20:00', professor: 'Pugliese Rut', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-4-n-24', courseId: '179-05/06', commission: '4º-NOCHE', semester: 2, days: ['Sábado'], startTime: '20:15', endTime: '21:30', professor: 'Pugliese Rut', enrolledStudents: 30, desiredResources: [] },
    
    // 5º AÑO - TURNO NOCHE
    { id: 'sec-5-n-1', courseId: '187-01/05/06', commission: '5º-NOCHE', semester: 1, days: ['Lunes'], startTime: '18:30', endTime: '20:00', professor: 'Consiglio, Abel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-5-n-2', courseId: '187-01/05/06', commission: '5º-NOCHE', semester: 1, days: ['Lunes'], startTime: '20:15', endTime: '21:30', professor: 'Consiglio, Abel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-5-n-3', courseId: '187-01/05/06', commission: '5º-NOCHE', semester: 2, days: ['Lunes'], startTime: '18:30', endTime: '20:00', professor: 'Consiglio, Abel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-5-n-4', courseId: '187-01/05/06', commission: '5º-NOCHE', semester: 2, days: ['Lunes'], startTime: '20:15', endTime: '21:30', professor: 'Consiglio, Abel', enrolledStudents: 30, desiredResources: [] },

    { id: 'sec-5-n-5', courseId: '184-06', commission: '5º-NOCHE', semester: 1, days: ['Martes'], startTime: '18:30', endTime: '20:00', professor: 'Chinni Guillermo Alfie Carbone', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-5-n-6', courseId: '184-06', commission: '5º-NOCHE', semester: 1, days: ['Martes'], startTime: '20:15', endTime: '21:30', professor: 'Chinni Guillermo Alfie Carbone', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-5-n-7', courseId: '183-06', commission: '5º-NOCHE', semester: 2, days: ['Martes'], startTime: '18:30', endTime: '20:00', professor: 'Tissera Esteban', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-5-n-8', courseId: '183-06', commission: '5º-NOCHE', semester: 2, days: ['Martes'], startTime: '20:15', endTime: '21:30', professor: 'Tissera Esteban', enrolledStudents: 30, desiredResources: [] },

    { id: 'sec-5-n-9', courseId: '183-06', commission: '5º-NOCHE', semester: 1, days: ['Miércoles'], startTime: '18:30', endTime: '20:00', professor: 'Tissera Esteban', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-5-n-10', courseId: '183-06', commission: '5º-NOCHE', semester: 1, days: ['Miércoles'], startTime: '20:15', endTime: '21:30', professor: 'Tissera Esteban', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-5-n-11', courseId: '181-06', commission: '5º-NOCHE', semester: 2, days: ['Miércoles'], startTime: '18:30', endTime: '20:00', professor: 'Buchniv German Charlon Rodrigo', enrolledStudents: 30, desiredResources: ['res-3'] },
    { id: 'sec-5-n-12', courseId: '181-06', commission: '5º-NOCHE', semester: 2, days: ['Miércoles'], startTime: '20:15', endTime: '21:30', professor: 'Buchniv German Charlon Rodrigo', enrolledStudents: 30, desiredResources: ['res-3'] },

    { id: 'sec-5-n-13', courseId: '186-05/06', commission: '5º-NOCHE', semester: 1, days: ['Jueves'], startTime: '18:30', endTime: '20:00', professor: 'Taverna, Agostina Rossi Gustavo', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-5-n-14', courseId: '186-05/06', commission: '5º-NOCHE', semester: 1, days: ['Jueves'], startTime: '20:15', endTime: '21:30', professor: 'Taverna, Agostina Rossi Gustavo', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-5-n-15', courseId: '185-06', commission: '5º-NOCHE', semester: 2, days: ['Jueves'], startTime: '18:30', endTime: '20:00', professor: 'Milich, Gustavo', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-5-n-16', courseId: '185-06', commission: '5º-NOCHE', semester: 2, days: ['Jueves'], startTime: '20:15', endTime: '21:30', professor: 'Milich, Gustavo', enrolledStudents: 30, desiredResources: [] },

    { id: 'sec-5-n-17', courseId: '182-05/06', commission: '5º-NOCHE', semester: 1, days: ['Viernes'], startTime: '18:30', endTime: '20:00', professor: 'Bender Adrian', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-5-n-18', courseId: '182-05/06', commission: '5º-NOCHE', semester: 1, days: ['Viernes'], startTime: '20:15', endTime: '21:30', professor: 'Bender Adrian', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-5-n-19', courseId: '182-05/06', commission: '5º-NOCHE', semester: 2, days: ['Viernes'], startTime: '18:30', endTime: '20:00', professor: 'Bender Adrian', enrolledStudents: 30, desiredResources: ['res-2'] },
    { id: 'sec-5-n-20', courseId: '182-05/06', commission: '5º-NOCHE', semester: 2, days: ['Viernes'], startTime: '20:15', endTime: '21:30', professor: 'Bender Adrian', enrolledStudents: 30, desiredResources: ['res-2'] },
];

    
