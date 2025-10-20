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
    { id: '145-01/05/06', name: 'Arquitectura de Computadoras', programId: 'prog-1', year: 1 },
    { id: '146-01/05/06', name: 'Álgebra I', programId: 'prog-1', year: 1 },
    { id: '147-05/06', name: 'Paradigmas de Programación', programId: 'prog-1', year: 1 },
    { id: '143-05/06', name: 'Metodología de la Investigación', programId: 'prog-1', year: 1 },
    { id: '154-01/05/06', name: 'Álgebra II', programId: 'prog-1', year: 1 },
    { id: '144-05/06', name: 'Introducción a la Programación', programId: 'prog-1', year: 1 },
    { id: '148-05/06', name: 'Programación I', programId: 'prog-1', year: 1 },
    { id: '149-01/06', name: 'Sistemas de Representación', programId: 'prog-1', year: 1 },
    { id: '159-01/06', name: 'Química General', programId: 'prog-1', year: 1 },
    
    // 2nd Year
    { id: '140-05/06', name: 'Intr. a la Admin. de Empresas', programId: 'prog-1', year: 2 },
    { id: '156-05/06', name: 'Programación II', programId: 'prog-1', year: 2 },
    { id: '158-01/05/06', name: 'Análisis Matemático II', programId: 'prog-1', year: 2 },
    { id: '151-01/05/06', name: 'Cálculo Numérico', programId: 'prog-1', year: 2 },
    { id: '153-05/06', name: 'Sistemas de Información I', programId: 'prog-1', year: 2 },
    { id: '152-05/06', name: 'Estructuras de Datos y Algoritmos', programId: 'prog-1', year: 2 },
    { id: '150-06', name: 'Física I', programId: 'prog-1', year: 2 },
    { id: '155-01/05/06', name: 'Filosofía', programId: 'prog-1', year: 2 },
    { id: '157-05/06', name: 'Teoría de Lenguajes', programId: 'prog-1', year: 2 },

    // 3rd Year
    { id: '162-05/06', name: 'Sistemas de Información II', programId: 'prog-1', year: 3 },
    { id: 'r165-05/06', name: 'Programación Avanzada', programId: 'prog-1', year: 3 },
    { id: '161-05/06', name: 'Sistemas Operativos', programId: 'prog-1', year: 3 },
    { id: '163-05/06', name: 'Sistemas de Bases de Datos', programId: 'prog-1', year: 3 },
    { id: '164-05/06', name: 'Probabilidad y Estadística', programId: 'prog-1', year: 3 },
    { id: '166-05/06', name: 'Teleinformática', programId: 'prog-1', year: 3 },
    { id: '150-06-2', name: 'Física II', programId: 'prog-1', year: 3 }, // Assuming new ID for Fisica II
    { id: '167-01/06', name: 'Física III', programId: 'prog-1', year: 3 },

    // 4th Year
    { id: 'pps-4', name: 'PPS Práctica Profesional Supervisada', programId: 'prog-1', year: 4 },
];

export const sections: Section[] = [
    // 1st Year, Morning
    { id: 'sec-1-1', courseId: '142-01/05/06', commission: '1º-A', enrolledStudents: 30, days: ['Lunes'], startTime: '09:00', endTime: '12:00', professor: 'Acosta Cesar', desiredResources: [], semester: 1, assignedClassroomId: 'room-101' },
    { id: 'sec-1-2', courseId: '141-01/05/06', commission: '1º-A', enrolledStudents: 30, days: ['Martes'], startTime: '09:00', endTime: '12:00', professor: 'Paez Roberto', desiredResources: [], semester: 1, assignedClassroomId: 'room-102' },
    { id: 'sec-1-3', courseId: '146-01/05/06', commission: '1º-A', enrolledStudents: 30, days: ['Miércoles'], startTime: '09:00', endTime: '12:00', professor: 'Acosta Cesar', desiredResources: [], semester: 1 },
    { id: 'sec-1-4', courseId: '143-05/06', commission: '1º-A', enrolledStudents: 30, days: ['Jueves'], startTime: '09:00', endTime: '12:00', professor: 'Chinni Guillermo', desiredResources: [], semester: 1 },
    { id: 'sec-1-5', courseId: '144-05/06', commission: '1º-A', enrolledStudents: 30, days: ['Viernes'], startTime: '09:00', endTime: '12:00', professor: 'Rodriguez Goñi, Cecilia', desiredResources: [], semester: 1 },
    { id: 'sec-1-6', courseId: '149-01/06', commission: '1º-A', enrolledStudents: 30, days: ['Sábado'], startTime: '09:00', endTime: '12:00', professor: 'Rios Noelia', desiredResources: [], semester: 1 },
    
    { id: 'sec-1-7', courseId: '142-01/05/06', commission: '1º-A', enrolledStudents: 30, days: ['Lunes'], startTime: '09:00', endTime: '12:00', professor: 'Acosta Cesar', desiredResources: [], semester: 2, assignedClassroomId: 'room-101' },
    { id: 'sec-1-8', courseId: '145-01/05/06', commission: '1º-A', enrolledStudents: 30, days: ['Martes'], startTime: '09:00', endTime: '12:00', professor: 'Paez Roberto', desiredResources: [], semester: 2 },
    { id: 'sec-1-9', courseId: '147-05/06', commission: '1º-A', enrolledStudents: 30, days: ['Miércoles'], startTime: '09:00', endTime: '12:00', professor: 'Weingand Gastón', desiredResources: [], semester: 2 },
    { id: 'sec-1-10', courseId: '154-01/05/06', commission: '1º-A', enrolledStudents: 30, days: ['Jueves'], startTime: '09:00', endTime: '12:00', professor: 'Semprun Diosmar', desiredResources: [], semester: 2 },
    { id: 'sec-1-11', courseId: '148-05/06', commission: '1º-A', enrolledStudents: 30, days: ['Viernes'], startTime: '09:00', endTime: '12:00', professor: 'Rodriguez Goñi, Cecilia', desiredResources: [], semester: 2 },
    { id: 'sec-1-12', courseId: '159-01/06', commission: '1º-A', enrolledStudents: 30, days: ['Sábado'], startTime: '09:00', endTime: '12:00', professor: 'Buela Juan', desiredResources: [], semester: 2 },
    
    // 2nd Year, Morning
    { id: 'sec-2-1', courseId: '140-05/06', commission: '2º', enrolledStudents: 30, days: ['Lunes'], startTime: '09:00', endTime: '12:30', professor: 'Garcia Jimena', desiredResources: [], semester: 1 },
    { id: 'sec-2-2', courseId: '158-01/05/06', commission: '2º', enrolledStudents: 30, days: ['Martes'], startTime: '09:00', endTime: '12:30', professor: 'Maciel, Abel', desiredResources: [], semester: 1 },
    { id: 'sec-2-3', courseId: '153-05/06', commission: '2º', enrolledStudents: 30, days: ['Miércoles'], startTime: '09:00', endTime: '12:30', professor: 'Mengide Juan', desiredResources: [], semester: 1 },
    { id: 'sec-2-4', courseId: '152-05/06', commission: '2º', enrolledStudents: 30, days: ['Jueves'], startTime: '09:00', endTime: '12:30', professor: 'Mengide Juan', desiredResources: [], semester: 1 },
    { id: 'sec-2-5', courseId: '150-06', commission: '2º', enrolledStudents: 30, days: ['Viernes'], startTime: '09:00', endTime: '12:30', professor: 'Semprun, Diosmar', desiredResources: [], semester: 1 },
    { id: 'sec-2-6', courseId: '155-01/05/06', commission: '2º', enrolledStudents: 30, days: ['Sábado'], startTime: '09:00', endTime: '12:30', professor: 'Ferreyra Carla', desiredResources: [], semester: 1 },
    
    { id: 'sec-2-7', courseId: '156-05/06', commission: '2º', enrolledStudents: 30, days: ['Lunes'], startTime: '09:00', endTime: '12:30', professor: 'Inveni Pablo', desiredResources: [], semester: 2 },
    { id: 'sec-2-8', courseId: '151-01/05/06', commission: '2º', enrolledStudents: 30, days: ['Martes'], startTime: '09:00', endTime: '12:30', professor: 'Acosta, Cesar', desiredResources: [], semester: 2 },
    { id: 'sec-2-9', courseId: '153-05/06', commission: '2º', enrolledStudents: 30, days: ['Miércoles'], startTime: '09:00', endTime: '12:30', professor: 'Mengide Juan', desiredResources: [], semester: 2 },
    { id: 'sec-2-10', courseId: '152-05/06', commission: '2º', enrolledStudents: 30, days: ['Jueves'], startTime: '09:00', endTime: '12:30', professor: 'Mengide Juan', desiredResources: [], semester: 2 },
    { id: 'sec-2-11', courseId: '150-06-2', commission: '2º', enrolledStudents: 30, days: ['Viernes'], startTime: '09:00', endTime: '12:30', professor: 'Baldino, Claudio', desiredResources: [], semester: 2 },
    { id: 'sec-2-12', courseId: '157-05/06', commission: '2º', enrolledStudents: 30, days: ['Sábado'], startTime: '09:00', endTime: '12:30', professor: 'Abud, Hector', desiredResources: [], semester: 2 },

    // 3rd Year, Morning
    { id: 'sec-3-1', courseId: '162-05/06', commission: '3º', enrolledStudents: 30, days: ['Lunes'], startTime: '09:00', endTime: '12:30', professor: 'Mengide Juan Pablo', desiredResources: [], semester: 1 },
    { id: 'sec-3-2', courseId: 'r165-05/06', commission: '3º', enrolledStudents: 30, days: ['Martes'], startTime: '09:00', endTime: '12:30', professor: 'Inverni Pablo', desiredResources: [], semester: 1 },
    { id: 'sec-3-3', courseId: '161-05/06', commission: '3º', enrolledStudents: 30, days: ['Miércoles'], startTime: '09:00', endTime: '12:30', professor: 'Consiglio, Abel', desiredResources: [], semester: 1 },
    { id: 'sec-3-4', courseId: '163-05/06', commission: '3º', enrolledStudents: 30, days: ['Jueves'], startTime: '09:00', endTime: '12:30', professor: 'Inverni Pablo', desiredResources: [], semester: 1 },
    { id: 'sec-3-5', courseId: '164-05/06', commission: '3º', enrolledStudents: 30, days: ['Viernes'], startTime: '09:00', endTime: '12:30', professor: 'Sereno Gabriela', desiredResources: [], semester: 1 },
    { id: 'sec-3-6', courseId: '166-05/06', commission: '3º', enrolledStudents: 30, days: ['Sábado'], startTime: '09:00', endTime: '12:30', professor: 'Seccatore, Miguel', desiredResources: [], semester: 1 },

    { id: 'sec-3-7', courseId: '162-05/06', commission: '3º', enrolledStudents: 30, days: ['Lunes'], startTime: '09:00', endTime: '12:30', professor: 'Mengide Juan Pablo', desiredResources: [], semester: 2 },
    { id: 'sec-3-8', courseId: 'r165-05/06', commission: '3º', enrolledStudents: 30, days: ['Martes'], startTime: '09:00', endTime: '12:30', professor: 'Inverni Pablo', desiredResources: [], semester: 2 },
    { id: 'sec-3-9', courseId: '161-05/06', commission: '3º', enrolledStudents: 30, days: ['Miércoles'], startTime: '09:00', endTime: '12:30', professor: 'Consiglio, Abel', desiredResources: [], semester: 2 },
    { id: 'sec-3-10', courseId: '163-05/06', commission: '3º', enrolledStudents: 30, days: ['Jueves'], startTime: '09:00', endTime: '12:30', professor: 'Inverni Pablo', desiredResources: [], semester: 2 },
    { id: 'sec-3-11', courseId: '164-05/06', commission: '3º', enrolledStudents: 30, days: ['Viernes'], startTime: '09:00', endTime: '12:30', professor: 'Sereno Gabriela', desiredResources: [], semester: 2 },
    { id: 'sec-3-12', courseId: '166-05/06', commission: '3º', enrolledStudents: 30, days: ['Sábado'], startTime: '09:00', endTime: '12:30', professor: 'Seccatore, Miguel', desiredResources: [], semester: 2 },
    
    // 1st Year, Afternoon
    { id: 'sec-1-tarde-1', courseId: '141-01/05/06', commission: '1º-Tarde', enrolledStudents: 30, days: ['Lunes'], startTime: '14:00', endTime: '17:30', professor: 'Paez Roberto', desiredResources: [], semester: 1 },
    { id: 'sec-1-tarde-2', courseId: '142-01/05/06', commission: '1º-Tarde', enrolledStudents: 30, days: ['Martes'], startTime: '14:00', endTime: '17:30', professor: 'Rojas Oscar', desiredResources: [], semester: 1 },
    { id: 'sec-1-tarde-3', courseId: '146-01/05/06', commission: '1º-Tarde', enrolledStudents: 30, days: ['Miércoles'], startTime: '14:00', endTime: '17:30', professor: 'Rojas Oscar', desiredResources: [], semester: 1 },
    { id: 'sec-1-tarde-4', courseId: '143-05/06', commission: '1º-Tarde', enrolledStudents: 30, days: ['Jueves'], startTime: '14:00', endTime: '17:30', professor: 'Garcia Jimena', desiredResources: [], semester: 1 },
    { id: 'sec-1-tarde-5', courseId: '144-05/06', commission: '1º-Tarde', enrolledStudents: 30, days: ['Viernes'], startTime: '14:00', endTime: '17:30', professor: 'Rodriguez Goñi, Cecilia', desiredResources: [], semester: 1 },
    { id: 'sec-1-tarde-6', courseId: '149-01/06', commission: '1º-Tarde', enrolledStudents: 30, days: ['Sábado'], startTime: '14:00', endTime: '17:30', professor: 'Rios Noelia', desiredResources: [], semester: 1 },

    // 1st Year, Night
    { id: 'sec-1-noche-1', courseId: '148-05/06', commission: '1º-Noche', enrolledStudents: 30, days: ['Lunes'], startTime: '18:30', endTime: '21:30', professor: 'Quevedo Ariel', desiredResources: [], semester: 1 },
    { id: 'sec-1-noche-2', courseId: '144-05/06', commission: '1º-Noche', enrolledStudents: 30, days: ['Martes'], startTime: '18:30', endTime: '21:30', professor: 'Quevedo Ariel', desiredResources: [], semester: 2 },
];
