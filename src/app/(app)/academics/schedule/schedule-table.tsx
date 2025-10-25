'use client'

import * as React from 'react'
import { Loader2, Users, Bot, Sparkles } from 'lucide-react'

import { useToast } from '@/hooks/use-toast'
import { PageHeader } from '@/components/page-header'
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
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'

// Illustrative types matching the MongoDB data structure
type Section = any; // Using 'any' for simplicity due to complexity
type Program = { _id: string; nombre_carrera: string; };
type Classroom = { _id: string; nombre_o_numero: string; capacidad: number; };

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const timeSlots = ['MAÑANA', 'TARDE', 'NOCHE']; // Simplified to match 'turno'

export function ScheduleTable({ initialSections, initialPrograms, initialClassrooms }) {
    const [selectedProgram, setSelectedProgram] = React.useState(initialPrograms[0]?._id || 'all');
    const [selectedTurn, setSelectedTurn] = React.useState('NOCHE'); 
    const [sections, setSections] = React.useState(initialSections);
    const [assigningSection, setAssigningSection] = React.useState<Section | null>(null);
    const { toast } = useToast();

    const getSectionsForCell = (year: number, turno: string, day: string) => {
        return sections.filter(s => {
            const materia = s.materia_ids[0]; // Assuming one materia for simplicity
            if (!materia) return false;

            const matchesProgram = selectedProgram === 'all' || materia.carrera_id._id === selectedProgram;
            
            return (
                materia.anio_carrera === year &&
                s.horario.turno === turno &&
                s.horario.dia === day &&
                matchesProgram
            );
        });
    }

    const handleAssignClassroom = (sectionId: string, classroomId: string) => {
        setSections(prevSections => 
            prevSections.map(s => 
                s._id === sectionId ? { ...s, asignacion: { ...s.asignacion, aula_id: { _id: classroomId } } } : s
            )
        );
        setAssigningSection(null);
        const classroom = initialClassrooms.find(c => c._id === classroomId);
        toast({
            title: "Aula Asignada",
            description: `El aula ${classroom?.nombre_o_numero} ha sido asignada a la comisión.`,
        })
    }

    const renderCell = (sectionsInCell: Section[]) => {
        if (sectionsInCell.length === 0) return <TableCell className="h-20 border-r"></TableCell>;
        
        return (
            <TableCell className="p-1 align-top h-20 border-r text-xs">
                {sectionsInCell.map(section => {
                    const materia = section.materia_ids[0];
                    const assignedClassroomName = section.asignacion?.aula_id?.nombre_o_numero;

                    return (
                        <div key={section._id} className="bg-muted p-1 rounded-sm h-full flex flex-col justify-center text-center">
                           <p className="font-bold text-[10px] leading-tight">{materia?.nombre_materia}</p>
                           {assignedClassroomName ? (
                             <Button 
                                variant="link" 
                                className="text-muted-foreground underline-offset-2 hover:no-underline h-auto p-0 text-[9px]"
                                onClick={() => setAssigningSection(section)}
                            >
                                {assignedClassroomName}
                            </Button>
                           ) : (
                            <Button 
                                variant="link" 
                                className="text-destructive h-auto p-0 text-[9px] font-bold"
                                onClick={() => setAssigningSection(section)}
                            >
                               Asignar Aula
                            </Button>
                           )}
                           <p className="text-muted-foreground text-[9px] mt-1">{section.profesor}</p>
                        </div>
                    )
                })}
            </TableCell>
        )
    }

    const years = [...new Set(initialSections.flatMap(s => s.materia_ids.map(m => m.anio_carrera)))].sort((a,b) => a - b);

  return (
    <>
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Horarios y Comisiones"
        breadcrumbs={[
            { href: '/dashboard', label: 'Home' },
            { href: '/academics/schedule', label: 'Horarios y Comisiones' }
        ]}
      />
      <div className="flex gap-4 mb-4">
        <Select value={selectedProgram} onValueChange={setSelectedProgram}>
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Seleccionar carrera..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todas las Carreras</SelectItem>
                {initialPrograms.map(program => (
                    <SelectItem key={program._id} value={program._id}>{program.nombre_carrera}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        {/* Turno filter can be added here if needed */}
      </div>
      
      <Card>
          <CardContent className="p-0 overflow-x-auto">
          <Table className="border-collapse border min-w-[1200px]">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px] border-r text-center font-bold">AÑO</TableHead>
                    <TableHead className="w-[80px] border-r text-center font-bold">TURNO</TableHead>
                    {days.map(day => (
                        <TableHead key={day} className="text-center border-r font-bold w-[180px]">{day.toUpperCase()}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {years.map(year => (
                   <React.Fragment key={year}>
                     {timeSlots.map((turno, timeIndex) => (
                         <TableRow key={`${year}-${timeIndex}`}>
                            {timeIndex === 0 && (
                                <TableCell rowSpan={timeSlots.length} className="border-r align-middle text-center font-bold w-[50px]">
                                    {year}º
                                </TableCell>
                            )}
                             <TableCell className="border-r text-center text-xs w-[80px]">{turno}</TableCell>
                             {days.map(day => (
                                 <React.Fragment key={day}>
                                     {renderCell(getSectionsForCell(year, turno, day))}
                                 </React.Fragment>
                             ))}
                         </TableRow>
                     ))}
                   </React.Fragment>
                ))}
            </TableBody>
            </Table>
          </CardContent>
      </Card>
    </div>

    <Dialog open={!!assigningSection} onOpenChange={() => setAssigningSection(null)}>
        <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
                <DialogTitle>Asignar Aula</DialogTitle>
                <DialogDescription>
                    Seleccione un aula disponible para la comisión de <span className="font-semibold text-foreground">{assigningSection?.materia_ids[0]?.nombre_materia}</span>.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Users className="size-4 text-muted-foreground" />
                        <span>{assigningSection?.inscriptos} alumnos</span>
                    </div>
                </div>
                <div className="border rounded-md max-h-[300px] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Aula</TableHead>
                                <TableHead>Capacidad</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialClassrooms.filter(c => c.capacidad >= assigningSection?.inscriptos).map(classroom => (
                                <TableRow key={classroom._id}>
                                    <TableCell className="font-medium">{classroom.nombre_o_numero}</TableCell>
                                    <TableCell>{classroom.capacidad}</TableCell>
                                    <TableCell>
                                        <Button 
                                            size="sm" 
                                            onClick={() => handleAssignClassroom(assigningSection!._id, classroom._id)}
                                        >
                                            Asignar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setAssigningSection(null)}>Cancelar</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  )
}
