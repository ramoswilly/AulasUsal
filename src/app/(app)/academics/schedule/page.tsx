

'use client'

import * as React from 'react'
import { courses, programs, sections as allSections, classrooms, resources } from '@/lib/data'
import { PageHeader } from '@/components/page-header'
import type { Section, Course, Classroom } from '@/lib/types'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast'
import { Users, Projector, Bot, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { runAutoAssignment, type AssignmentResult } from '@/lib/actions'

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const timeSlots = ['18:30 a 20:00 hs.', '20:15 a 21:30 hs.'];

type AvailableClassroom = Classroom & {
    futureOccupancy: number;
    hasCapacity: boolean;
};

export default function SchedulePage() {
    const [selectedProgram, setSelectedProgram] = React.useState(programs[0].id);
    const [selectedTurn, setSelectedTurn] = React.useState('NOCHE'); 
    const [sections, setSections] = React.useState(allSections);
    const [assigningSection, setAssigningSection] = React.useState<Section | null>(null);
    const [isAssigning, setIsAssigning] = React.useState(false)
    const [assignmentResult, setAssignmentResult] = React.useState<AssignmentResult | null>(null)

    const { toast } = useToast();

    const programCourses = courses.filter(c => c.programId === selectedProgram);
    const years = [...new Set(programCourses.map(c => c.year))].sort((a,b) => a - b);
    const classroomMap = new Map(classrooms.map(c => [c.id, c.name]));
    const resourceMap = new Map(resources.map(r => [r.id, r.name]));
    
    const getCourseForSection = (section: Section): Course | undefined => {
        return courses.find(c => c.id === section.courseId);
    }

    const getSections = (year: number, timeSlot: string, day: string, semester: number) => {
        const sectionsForYear = sections.filter(s => {
            const course = getCourseForSection(s);
            return course?.year === year && s.commission.includes(selectedTurn);
        });

        const startTime = timeSlot.split(' ')[0];

        return sectionsForYear.filter(s => 
            s.days.includes(day) &&
            s.semester === semester &&
            s.startTime.startsWith(startTime)
        );
    }

    const getAvailableClassrooms = (sectionToAssign: Section | null): AvailableClassroom[] => {
        if (!sectionToAssign) return [];
      
        const available = classrooms
          .map(classroom => {
            // Rule 2: Resources
            const hasAllResources = sectionToAssign.desiredResources.every(resourceId =>
              classroom.resources.includes(resourceId)
            );
            if (!hasAllResources) return null;
      
            // Rule 1 & 3: Schedule Availability and Shared Capacity
            const conflictingSections = sections.filter(s => 
              s.assignedClassroomId === classroom.id &&
              s.id !== sectionToAssign.id &&
              s.days.some(day => sectionToAssign.days.includes(day)) &&
              s.startTime === sectionToAssign.startTime
            );
      
            const currentOccupancy = conflictingSections.reduce((sum, s) => sum + s.enrolledStudents, 0);
            const futureOccupancy = currentOccupancy + sectionToAssign.enrolledStudents;
            const hasCapacity = futureOccupancy <= classroom.capacity;

            return { ...classroom, futureOccupancy, hasCapacity };
          })
          .filter((c): c is AvailableClassroom => c !== null);

          // Sort by hasCapacity (true first) and then by remaining capacity
          return available.sort((a, b) => {
            if (a.hasCapacity !== b.hasCapacity) {
                return a.hasCapacity ? -1 : 1;
            }
            if (a.hasCapacity) { // Only sort by proximity if they both have capacity
              const aProximity = a.capacity - a.futureOccupancy;
              const bProximity = b.capacity - b.futureOccupancy;
              return aProximity - bProximity; // Ascending order of remaining space
            }
            return 0;
          })
      }

    const handleOpenAssignModal = (section: Section) => {
        setAssigningSection(section);
    }
    
    const handleAssignClassroom = (sectionId: string, classroomId: string) => {
        setSections(prevSections => 
            prevSections.map(s => 
                s.id === sectionId ? { ...s, assignedClassroomId: classroomId } : s
            )
        );
        setAssigningSection(null);
        toast({
            title: "Aula Asignada",
            description: `El aula ${classroomMap.get(classroomId)} ha sido asignada a la comisión.`,
        })
    }

    const handleAutoAssign = async () => {
        setIsAssigning(true)
        setAssignmentResult(null)
        try {
            const result = await runAutoAssignment()
            setAssignmentResult(result)
            
            if (result.success) {
                setSections(prevSections => {
                    const newSections = [...prevSections];
                    result.assignedSections?.forEach(assignment => {
                        const sectionIndex = newSections.findIndex(s => s.id === assignment.sectionId);
                        if (sectionIndex > -1) {
                            newSections[sectionIndex] = {
                                ...newSections[sectionIndex],
                                assignedClassroomId: assignment.classroomId
                            };
                        }
                    });
                    return newSections;
                });
            }
            toast({
                title: result.success ? "Proceso Completado" : "Proceso con Errores",
                description: result.message,
                variant: result.success && result.unassignedCount === 0 ? "default" : "destructive",
            })
        } catch (error) {
            console.error("Error running auto-assignment:", error);
            const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
            setAssignmentResult({
                success: false,
                message: errorMessage,
                assignedCount: 0,
                unassignedCount: allSections.filter(s => !s.assignedClassroomId).length,
                failureSummary: 'La simulación local falló. Revise la consola para más detalles.'
            });
        } finally {
            setIsAssigning(false)
        }
    }

    const courseForModal = assigningSection ? getCourseForSection(assigningSection) : null;
    const availableClassroomsForModal = getAvailableClassrooms(assigningSection);

    const renderCell = (sections: Section[]) => {
        if (sections.length === 0) return <TableCell className="h-20 border-r"></TableCell>;
        
        return (
            <TableCell className="p-1 align-top h-20 border-r text-xs">
                {sections.map(section => {
                    const course = getCourseForSection(section);
                    const assignedClassroomName = section.assignedClassroomId ? classroomMap.get(section.assignedClassroomId) : null;

                    return (
                        <div key={section.id} className="bg-muted p-1 rounded-sm h-full flex flex-col justify-center text-center">
                           <p className="font-bold text-[10px] leading-tight">{course?.name}</p>
                           {assignedClassroomName ? (
                             <Button 
                                variant="link" 
                                className="text-muted-foreground underline-offset-2 hover:no-underline h-auto p-0 text-[9px]"
                                onClick={() => handleOpenAssignModal(section)}
                            >
                                {assignedClassroomName}
                            </Button>
                           ) : (
                            <Button 
                                variant="link" 
                                className="text-destructive h-auto p-0 text-[9px] font-bold"
                                onClick={() => handleOpenAssignModal(section)}
                            >
                               Asignar Aula
                            </Button>
                           )}
                           <p className="text-muted-foreground text-[9px] mt-1">{section.professor}</p>
                        </div>
                    )
                })}
            </TableCell>
        )
    }

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
                {programs.map(program => (
                    <SelectItem key={program.id} value={program.id}>{program.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        <Select value={selectedTurn} onValueChange={setSelectedTurn}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar turno..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="MAÑANA">Mañana</SelectItem>
                <SelectItem value="TARDE">Tarde</SelectItem>
                <SelectItem value="NOCHE">Noche</SelectItem>
            </SelectContent>
        </Select>
        <Button onClick={handleAutoAssign} disabled={isAssigning} className="w-auto ml-auto">
            {isAssigning ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              <Bot className="mr-2" />
            )}
            Auto-Asignar
          </Button>
      </div>
      
      <Card>
          <CardContent className="p-0 overflow-x-auto">
          <Table className="border-collapse border">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px] border-r text-center font-bold">AÑO</TableHead>
                    <TableHead className="w-[80px] border-r text-center font-bold">COMISIÓN</TableHead>
                    {days.map(day => (
                        <TableHead key={day} colSpan={2} className="text-center border-r font-bold w-[240px]">{day.toUpperCase()}</TableHead>
                    ))}
                </TableRow>
                <TableRow>
                    <TableHead className="border-r"></TableHead>
                    <TableHead className="border-r"></TableHead>
                    {days.map(day => (
                        <React.Fragment key={day}>
                            <TableHead className="text-center border-r font-normal w-[120px]">Primer Cuatrimestre</TableHead>
                            <TableHead className="text-center border-r font-normal w-[120px]">Segundo Cuatrimestre</TableHead>
                        </React.Fragment>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {years.map(year => (
                   <React.Fragment key={year}>
                     {timeSlots.map((timeSlot, timeIndex) => (
                         <TableRow key={`${year}-${timeIndex}`}>
                            {timeIndex === 0 && (
                                <TableCell rowSpan={timeSlots.length} className="border-r align-middle text-center font-bold w-[50px]">
                                    {year}º
                                </TableCell>
                            )}
                             <TableCell className="border-r text-center text-xs w-[80px]">{timeSlot}</TableCell>
                             {days.map(day => (
                                 <React.Fragment key={day}>
                                     {renderCell(getSections(year, timeSlot, day, 1))}
                                     {renderCell(getSections(year, timeSlot, day, 2))}
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
                    Seleccione un aula disponible para la comisión de <span className="font-semibold text-foreground">{courseForModal?.name}</span>.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Users className="size-4 text-muted-foreground" />
                        <span>{assigningSection?.enrolledStudents} alumnos</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Projector className="size-4 text-muted-foreground" />
                        <span>Recursos: {assigningSection?.desiredResources.map(id => resourceMap.get(id)).join(', ') || 'Ninguno'}</span>
                    </div>
                </div>
                <div className="border rounded-md max-h-[300px] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Aula</TableHead>
                                <TableHead>Ocupación Futura</TableHead>
                                <TableHead>Recursos</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {availableClassroomsForModal.map(classroom => (
                                <TableRow key={classroom.id}>
                                    <TableCell className="font-medium">{classroom.name}</TableCell>
                                    <TableCell className={cn(
                                        "font-medium",
                                        classroom.hasCapacity ? "text-green-600" : "text-red-600"
                                    )}>
                                        {classroom.futureOccupancy}/{classroom.capacity}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {classroom.resources.map(id => (
                                                <Badge key={id} variant="secondary">{resourceMap.get(id)}</Badge>
                                            ))}
                                            {classroom.resources.length === 0 && <span className="text-xs text-muted-foreground">Ninguno</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button 
                                            size="sm" 
                                            onClick={() => handleAssignClassroom(assigningSection!.id, classroom.id)}
                                            disabled={!classroom.hasCapacity}
                                        >
                                            Asignar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {availableClassroomsForModal.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                        No hay aulas disponibles que cumplan los requisitos.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setAssigningSection(null)}>Cancelar</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    <AlertDialog open={!!assignmentResult && !isAssigning} onOpenChange={() => setAssignmentResult(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="text-accent" />
              Resultado de la Asignación
            </AlertDialogTitle>
            <AlertDialogDescription>
              {assignmentResult?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {assignmentResult?.unassignedCount && assignmentResult.unassignedCount > 0 && (
             <div className="text-sm bg-secondary p-3 rounded-md">
                <h4 className="font-semibold mb-2">Resumen de fallos:</h4>
                <p className="text-secondary-foreground">{assignmentResult.failureSummary || 'No se pudo generar un resumen.'}</p>
             </div>
          )}
          <AlertDialogFooter>
            <AlertDialogAction>Entendido</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
