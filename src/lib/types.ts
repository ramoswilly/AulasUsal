export type Resource = {
  id: string;
  name: string;
};

export type Classroom = {
  id: string;
  name: string;
  buildingId: string;
  capacity: number;
  resources: string[]; // Array of resource IDs
};

export type Building = {
  id: string;
  name: string;
  label: 'Centro Tecnológico' | 'Edificio de Carrera' | 'Módulo' | 'Genérico' | 'Laboratorio' | 'Edificio veterinario';
  campusId: string;
};

export type Campus = {
  id: string;
  name: string;
};

export type Program = {
  id: string;
  name: string;
};

export type Course = {
  id: string;
  name: string;
  programId: string;
  year: number;
};

export type Section = {
  id: string;
  courseId: string;
  enrolledStudents: number;
  days: string[];
  startTime: string;
  endTime: string;
  desiredResources: string[]; // Array of resource IDs
  assignedClassroomId?: string;
  professor?: string;
  semester: number;
  commission: string;
};
