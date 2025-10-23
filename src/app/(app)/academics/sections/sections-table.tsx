'use client'

import * as React from 'react'
import { Loader2, Users } from 'lucide-react'

import { useToast } from '@/hooks/use-toast'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

// NOTE: These types are illustrative of the data structure after serialization
type Section = {
  _id: string;
  nombre_comision: string;
  inscriptos: number;
  horario: { dia: string; turno: string; };
  asignacion?: { aula_id?: { _id: string; nombre_o_numero: string; } };
  materia_ids: { _id: string; nombre_materia: string; carrera_id: { _id: string; nombre_carrera: string; } }[];
}
type Program = { _id: string; nombre_carrera: string; }
type Classroom = { _id: string; nombre_o_numero: string; capacidad: number; }


type SectionsTableProps = {
  sections: Section[]
  programs: Program[]
  classrooms: Classroom[]
}

export function SectionsTable({ sections, programs, classrooms }: SectionsTableProps) {
  const [filter, setFilter] = React.useState('all')
  const [isClient, setIsClient] = React.useState(false)

  const { toast } = useToast()

  React.useEffect(() => {
    setIsClient(true)
  }, [])
  
  const handleManualAssignment = (sectionId: string, classroomId: string) => {
    console.log(`Manually assigning section ${sectionId} to classroom ${classroomId}`);
    toast({
        title: "Asignación Manual",
        description: `La comisión ${sectionId} fue asignada al aula. En una app real, esto se guardaría.`,
    });
  }

  const filteredSections = sections.filter((s) => {
    if (filter === 'all') return true;
    // Check if any of the materias in the comision belongs to the filtered carrera
    return s.materia_ids.some(m => m.carrera_id._id === filter);
  });

  if (!isClient) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin size-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[280px]">
              <SelectValue placeholder="Filtrar por carrera..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Carreras</SelectItem>
              {programs.map((program) => (
                <SelectItem key={program._id} value={program._id}>
                  {program.nombre_carrera}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comisión</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead>Aula Asignada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSections.map((section) => (
                <TableRow key={section._id}>
                  <TableCell>
                    <div className="font-medium">{section.materia_ids.map(m => m.nombre_materia).join(', ')}</div>
                    <div className="text-sm text-muted-foreground">{section.nombre_comision}</div>
                    <div className="flex items-center gap-2 mt-1">
                        <Users className="size-4 text-muted-foreground"/>
                        <span className="text-sm">{section.inscriptos}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{section.horario.dia}</div>
                    <div className="text-sm text-muted-foreground">{section.horario.turno}</div>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={section.asignacion?.aula_id?._id}
                      onValueChange={(value) => handleManualAssignment(section._id, value)}
                    >
                      <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Asignar aula..." />
                      </SelectTrigger>
                      <SelectContent>
                        {classrooms.map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.nombre_o_numero} ({c.capacidad})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}