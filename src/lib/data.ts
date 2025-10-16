import type { Campus, Building, Classroom, Resource, Program, Course, Section } from './types';

export const resources: Resource[] = [
  { id: 'res-1', name: 'Cañón' },
  { id: 'res-2', name: 'PC' },
  { id: 'res-3', name: 'Laboratorio' },
  { id: 'res-4', name: 'Pizarra Digital' },
  { id: 'res-5', name: 'Micrófono' },
];

export const campuses: Campus[] = [
  { id: 'campus-1', name: 'Sede Central' },
  { id: 'campus-2', name: 'Campus Norte' },
];

export const buildings: Building[] = [
  { id: 'building-1', name: 'Centro Tecnológico', label: 'Centro Tecnológico', campusId: 'campus-1' },
  { id: 'building-2', name: 'Edificio de Humanidades', label: 'Edificio de Carrera', campusId: 'campus-1' },
  { id: 'building-3', name: 'Módulo A', label: 'Módulo', campusId: 'campus-2' },
  { id: 'building-4', name: 'Edificio Anexo', label: 'Genérico', campusId: 'campus-2' },
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
  { id: 'prog-1', name: 'Ingeniería en Sistemas' },
  { id: 'prog-2', name: 'Licenciatura en Psicología' },
  { id: 'prog-3', name: 'Arquitectura' },
];

export const courses: Course[] = [
  { id: 'course-1', name: 'Programación I', programId: 'prog-1' },
  { id: 'course-2', name: 'Bases de Datos', programId: 'prog-1' },
  { id: 'course-3', name: 'Psicología General', programId: 'prog-2' },
  { id: 'course-4', name: 'Dibujo Técnico', programId: 'prog-3' },
  { id: 'course-5', name: 'Algoritmos y Estructuras de Datos', programId: 'prog-1' },
];

export const sections: Section[] = [
  { id: 'sec-1', courseId: 'course-1', enrolledStudents: 45, days: ['Lunes', 'Miércoles'], startTime: '09:00', endTime: '11:00', desiredResources: ['res-1', 'res-2'], assignedClassroomId: 'room-101' },
  { id: 'sec-2', courseId: 'course-2', enrolledStudents: 28, days: ['Martes', 'Jueves'], startTime: '18:00', endTime: '20:00', desiredResources: ['res-1'], assignedClassroomId: undefined },
  { id: 'sec-3', courseId: 'course-3', enrolledStudents: 55, days: ['Viernes'], startTime: '14:00', endTime: '17:00', desiredResources: [], assignedClassroomId: 'room-201' },
  { id: 'sec-4', courseId: 'course-4', enrolledStudents: 35, days: ['Lunes'], startTime: '11:00', endTime: '13:00', desiredResources: [], assignedClassroomId: undefined },
  { id: 'sec-5', courseId: 'course-5', enrolledStudents: 20, days: ['Martes', 'Jueves'], startTime: '18:00', endTime: '20:00', desiredResources: ['res-1', 'res-2'], assignedClassroomId: undefined },
  { id: 'sec-6', courseId: 'course-1', enrolledStudents: 30, days: ['Sábados'], startTime: '09:00', endTime: '13:00', desiredResources: ['res-1'], assignedClassroomId: undefined },
];
