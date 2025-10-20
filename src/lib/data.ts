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
    { id: '150-06-2', name: 'Física II', programId: 'prog-1', year: 2 }, 

    // 3rd Year
    { id: '162-05/06', name: 'Sistemas de Información II', programId: 'prog-1', year: 3 },
    { id: 'r165-05/06', name: 'Programación Avanzada', programId: 'prog-1', year: 3 },
    { id: '161-05/06', name: 'Sistemas Operativos', programId: 'prog-1', year: 3 },
    { id: '163-05/06', name: 'Sistemas de Bases de Datos', programId: 'prog-1', year: 3 },
    { id: '164-05/06', name: 'Probabilidad y Estadística', programId: 'prog-1', year: 3 },
    { id: '166-05/06', name: 'Teleinformática', programId: 'prog-1', year: 3 },
    { id: '167-01/06', name: 'Física III', programId: 'prog-1', year: 3 },

    // 4th Year
    { id: 'pps-4', name: 'PPS Práctica Profesional Supervisada', programId: 'prog-1', year: 4 },
];

export const sections: Section[] = [
    // 1st Year, Morning (1º-A)
    { id: 'sec-1-a-1', courseId: '142-01/05/06', commission: '1º-A', semester: 1, days: ['Lunes'], startTime: '09:00', endTime: '13:00', professor: 'Acosta Cesar', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-a-2', courseId: '142-01/05/06', commission: '1º-A', semester: 2, days: ['Lunes'], startTime: '09:00', endTime: '13:00', professor: 'Acosta Cesar', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-a-3', courseId: '141-01/05/06', commission: '1º-A', semester: 1, days: ['Martes'], startTime: '09:00', endTime: '13:00', professor: 'Paez Roberto', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-a-4', courseId: '145-01/05/06', commission: '1º-A', semester: 2, days: ['Martes'], startTime: '09:00', endTime: '13:00', professor: 'Paez Roberto', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-a-5', courseId: '146-01/05/06', commission: '1º-A', semester: 1, days: ['Miércoles'], startTime: '09:00', endTime: '13:00', professor: 'Acosta Cesar', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-a-6', courseId: '147-05/06', commission: '1º-A', semester: 2, days: ['Miércoles'], startTime: '09:00', endTime: '13:00', professor: 'Weingand Gastón', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-a-7', courseId: '143-05/06', commission: '1º-A', semester: 1, days: ['Jueves'], startTime: '09:00', endTime: '13:00', professor: 'Chinni Guillermo', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-a-8', courseId: '154-01/05/06', commission: '1º-A', semester: 2, days: ['Jueves'], startTime: '09:00', endTime: '13:00', professor: 'Semprun Diosmar', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-a-9', courseId: '144-05/06', commission: '1º-A', semester: 1, days: ['Viernes'], startTime: '09:00', endTime: '13:00', professor: 'Rodriguez Goñi, Cecilia', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-a-10', courseId: '148-05/06', commission: '1º-A', semester: 2, days: ['Viernes'], startTime: '09:00', endTime: '13:00', professor: 'Rodríguez Goñi, Cecilia', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-a-11', courseId: '149-01/06', commission: '1º-A', semester: 1, days: ['Sábado'], startTime: '09:00', endTime: '13:00', professor: 'Rios Noelia', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-1-a-12', courseId: '159-01/06', commission: '1º-A', semester: 2, days: ['Sábado'], startTime: '09:00', endTime: '13:00', professor: 'Buela Juan', enrolledStudents: 30, desiredResources: [] },

    // 2nd Year, Morning (2º)
    { id: 'sec-2-m-1', courseId: '140-05/06', commission: '2º', semester: 1, days: ['Lunes'], startTime: '09:00', endTime: '12:30', professor: 'Garcia Jimena', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-m-2', courseId: '156-05/06', commission: '2º', semester: 2, days: ['Lunes'], startTime: '09:00', endTime: '12:30', professor: 'Inveni Pablo', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-m-3', courseId: '158-01/05/06', commission: '2º', semester: 1, days: ['Martes'], startTime: '09:00', endTime: '12:30', professor: 'Maciel, Abel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-m-4', courseId: '151-01/05/06', commission: '2º', semester: 2, days: ['Martes'], startTime: '09:00', endTime: '12:30', professor: 'Acosta, Cesar', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-m-5', courseId: '153-05/06', commission: '2º', semester: 1, days: ['Miércoles'], startTime: '09:00', endTime: '12:30', professor: 'Mengide Juan', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-m-6', courseId: '153-05/06', commission: '2º', semester: 2, days: ['Miércoles'], startTime: '09:00', endTime: '12:30', professor: 'Mengide Juan', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-m-7', courseId: '152-05/06', commission: '2º', semester: 1, days: ['Jueves'], startTime: '09:00', endTime: '12:30', professor: 'Mengide Juan', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-m-8', courseId: '152-05/06', commission: '2º', semester: 2, days: ['Jueves'], startTime: '09:00', endTime: '12:30', professor: 'Mengide Juan', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-m-9', courseId: '150-06', commission: '2º', semester: 1, days: ['Viernes'], startTime: '09:00', endTime: '12:30', professor: 'Semprun, Diosmar', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-m-10', courseId: '150-06-2', commission: '2º', semester: 2, days: ['Viernes'], startTime: '09:00', endTime: '12:30', professor: 'Baldino, Claudio', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-m-11', courseId: '155-01/05/06', commission: '2º', semester: 1, days: ['Sábado'], startTime: '09:00', endTime: '12:30', professor: 'Ferreyra Carla', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-2-m-12', courseId: '157-05/06', commission: '2º', semester: 2, days: ['Sábado'], startTime: '09:00', endTime: '12:30', professor: 'Abud, Hector', enrolledStudents: 30, desiredResources: [] },

    // 3rd Year, Morning (3º)
    { id: 'sec-3-m-1', courseId: '162-05/06', commission: '3º', semester: 1, days: ['Lunes'], startTime: '09:00', endTime: '12:30', professor: 'Mengide Juan Pablo', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-m-2', courseId: '162-05/06', commission: '3º', semester: 2, days: ['Lunes'], startTime: '09:00', endTime: '12:30', professor: 'Mengide Juan Pablo', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-m-3', courseId: 'r165-05/06', commission: '3º', semester: 1, days: ['Martes'], startTime: '09:00', endTime: '12:30', professor: 'Inverni Pablo', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-m-4', courseId: 'r165-05/06', commission: '3º', semester: 2, days: ['Martes'], startTime: '09:00', endTime: '12:30', professor: 'Inveni Pablo', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-m-5', courseId: '161-05/06', commission: '3º', semester: 1, days: ['Miércoles'], startTime: '09:00', endTime: '12:30', professor: 'Consiglio, Abel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-m-6', courseId: '161-05/06', commission: '3º', semester: 2, days: ['Miércoles'], startTime: '09:00', endTime: '12:30', professor: 'Consiglio, Abel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-m-7', courseId: '163-05/06', commission: '3º', semester: 1, days: ['Jueves'], startTime: '09:00', endTime: '12:30', professor: 'Inverni Pablo', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-m-8', courseId: '163-05/06', commission: '3º', semester: 2, days: ['Jueves'], startTime: '09:00', endTime: '12:30', professor: 'Inverni Pablo', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-m-9', courseId: '164-05/06', commission: '3º', semester: 1, days: ['Viernes'], startTime: '09:00', endTime: '12:30', professor: 'Sereno Gabriela', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-m-10', courseId: '164-05/06', commission: '3º', semester: 2, days: ['Viernes'], startTime: '09:00', endTime: '12:30', professor: 'Sereno Gabriela', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-m-11', courseId: '166-05/06', commission: '3º', semester: 1, days: ['Sábado'], startTime: '09:00', endTime: '12:30', professor: 'Seccatore, Miguel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-3-m-12', courseId: '166-05/06', commission: '3º', semester: 2, days: ['Sábado'], startTime: '09:00', endTime: '12:30', professor: 'Seccatore, Miguel', enrolledStudents: 30, desiredResources: [] },

    // Afternoon (Tarde)
    { id: 'sec-t-1', courseId: '141-01/05/06', commission: '1º-TARDE', semester: 1, days: ['Lunes'], startTime: '14:00', endTime: '17:30', professor: 'Paez Roberto', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-t-2', courseId: '145-01/05/06', commission: '1º-TARDE', semester: 2, days: ['Lunes'], startTime: '14:00', endTime: '17:30', professor: 'Paez Roberto', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-t-3', courseId: '142-01/05/06', commission: '1º-TARDE', semester: 1, days: ['Martes'], startTime: '14:00', endTime: '17:30', professor: 'Rojas Oscar', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-t-4', courseId: '142-01/05/06', commission: '1º-TARDE', semester: 2, days: ['Martes'], startTime: '14:00', endTime: '17:30', professor: 'Rojas Oscar', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-t-5', courseId: '146-01/05/06', commission: '1º-TARDE', semester: 1, days: ['Miércoles'], startTime: '14:00', endTime: '17:30', professor: 'Rojas Oscar', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-t-6', courseId: '147-05/06', commission: '1º-TARDE', semester: 2, days: ['Miércoles'], startTime: '14:00', endTime: '17:30', professor: 'Weingand Gastón', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-t-7', courseId: '143-05/06', commission: '1º-TARDE', semester: 1, days: ['Jueves'], startTime: '14:00', endTime: '17:30', professor: 'Garcia Jimena', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-t-8', courseId: '154-01/05/06', commission: '1º-TARDE', semester: 2, days: ['Jueves'], startTime: '14:00', endTime: '17:30', professor: 'Rojas Oscar', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-t-9', courseId: '144-05/06', commission: '1º-TARDE', semester: 1, days: ['Viernes'], startTime: '14:00', endTime: '17:30', professor: 'Rodriguez Goñi, Cecilia', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-t-10', courseId: '148-05/06', commission: '1º-TARDE', semester: 2, days: ['Viernes'], startTime: '14:00', endTime: '17:30', professor: 'Rodríguez Goñi, Cecilia', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-t-11', courseId: '149-01/06', commission: '1º-TARDE', semester: 1, days: ['Sábado'], startTime: '14:00', endTime: '17:30', professor: 'Rios Noelia', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-t-12', courseId: '159-01/06', commission: '1º-TARDE', semester: 2, days: ['Sábado'], startTime: '14:00', endTime: '17:30', professor: 'Buela Juan', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-t-13', courseId: '150-06-2', commission: '2º-TARDE', semester: 2, days: ['Jueves'], startTime: '14:00', endTime: '17:30', professor: 'Sempung, Diosmar', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-t-14', courseId: '167-01/06', commission: '3º-TARDE', semester: 2, days: ['Viernes'], startTime: '14:00', endTime: '17:30', professor: 'Baldino Claudio', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-t-15', courseId: 'pps-4', commission: '4º-TARDE', semester: 1, days: ['Miércoles'], startTime: '14:00', endTime: '21:30', professor: 'Machain Marin', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-t-16', courseId: 'pps-4', commission: '4º-TARDE', semester: 2, days: ['Miércoles'], startTime: '14:00', endTime: '21:30', professor: 'Machain Marin', enrolledStudents: 30, desiredResources: [] },
    
    // Night (Noche)
    { id: 'sec-n-1', courseId: '148-05/06', commission: '1º-NOCHE', semester: 1, days: ['Lunes'], startTime: '18:30', endTime: '21:30', professor: 'Quevedo Ariel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-n-2', courseId: '144-05/06', commission: '1º-NOCHE', semester: 2, days: ['Lunes'], startTime: '18:30', endTime: '21:30', professor: 'Quevedo Ariel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-n-3', courseId: '144-05/06', commission: '1º-NOCHE', semester: 1, days: ['Martes'], startTime: '18:30', endTime: '21:30', professor: 'Quevedo Ariel', enrolledStudents: 30, desiredResources: [] },
    { id: 'sec-n-4', courseId: '148-05/06', commission: '1º-NOCHE', semester: 2, days: ['Martes'], startTime: '18:30', endTime: '21:30', professor: 'Quevedo Ariel', enrolledStudents: 30, desiredResources: [] },
];
