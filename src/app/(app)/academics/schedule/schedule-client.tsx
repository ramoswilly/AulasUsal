'use client'

import * as React from 'react'
import { PageHeader } from '@/components/page-header'
import type { Section, Course } from '@/lib/types'
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
import { UpsertComisionModal } from '@/components/modals/sedes/UpsertComisionModal'
import type { IComision } from '@/models/Comision'

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const timeSlots = ['18:30 a 21:30 hs.'];

export function ScheduleClient({ courses, programs, allSections, classrooms }: { courses: any[], programs: any[], allSections: any[], classrooms: any[] }) {
    const [selectedProgram, setSelectedProgram] = React.useState(programs[0]._id);
    const [selectedTurn, setSelectedTurn] = React.useState('NOCHE'); 
    const [sections, setSections] = React.useState(allSections);
    const [assigningSection, setAssigningSection] = React.useState<Section | null>(null);
    const [isAssigning, setIsAssigning] = React.useState(false)
    const [assignmentResult, setAssignmentResult] = React.useState<AssignmentResult | null>(null)
    const [isUpsertComisionModalOpen, setIsUpsertComisionModalOpen] = React.useState(false);
    const [selectedComision, setSelectedComision] = React.useState<IComision | null>(null);
    const [modalContext, setModalContext] = React.useState<{ day: string; semester: number; year: number; turn: string; selectedProgram: string; } | null>(null);

    const { toast } = useToast();

    const selectedProgramData = programs.find(p => p._id === selectedProgram);
    const years = selectedProgramData ? Array.from({ length: selectedProgramData.anios }, (_, i) => i + 1) : [];
    const classroomMap = new Map(classrooms.map(c => [c._id, c.nombre_o_numero]));
    
    const getCourseForSection = (section: Section): Course | undefined => {
        // This needs to be adapted based on the new data structure
        // In the new model, a comision has an array of materia_ids
        // Let's find the first materia for now.
        const materia = courses.find(c => c._id === section.materia_ids[0]);
        return materia ? { id: materia._id, name: materia.nombre_materia, programId: materia.carrera_id._id, year: materia.anio, semester: materia.cuatrimestre } : undefined;
    }

    const getSections = (year: number, timeSlot: string, day: string, semester: number) => {
        const sectionsForYear = sections.filter(s => {
            const course = getCourseForSection(s);
            return course?.year === year && course?.semester === semester && s.horario.turno.includes(selectedTurn);
        });

        if (timeSlot === '18:30 a 21:30 hs.') {
            return sectionsForYear.filter(s => s.horario.dia === day);
        } else {
            const startTime = timeSlot.split(' ')[0];
            return sectionsForYear.filter(s => 
                s.horario.dia === day &&
                s.horario.turno.startsWith(startTime) // This might need adjustment
            );
        }
    }

    const handleOpenUpsertModal = (day: string, semester: number, year: number, comision: IComision | null) => {
        setModalContext({ day, semester, year, turn: selectedTurn, selectedProgram });
        setSelectedComision(comision);
        setIsUpsertComisionModalOpen(true);
    }

    const getAvailableClassrooms = (sectionToAssign: Section | null): AvailableClassroom[] => {
        if (!sectionToAssign) return [];
      
        const available = classrooms
          .map(classroom => {
            // Rule 1 & 3: Schedule Availability and Shared Capacity
            const conflictingSections = sections.filter(s => 
              s.asignacion?.aula_id === classroom._id &&
              s._id !== sectionToAssign._id &&
              s.horario.dia === sectionToAssign.horario.dia &&
              s.horario.turno === sectionToAssign.horario.turno
            );
      
            const currentOccupancy = conflictingSections.reduce((sum, s) => sum + s.inscriptos, 0);
            const futureOccupancy = currentOccupancy + sectionToAssign.inscriptos;
            const hasCapacity = futureOccupancy <= classroom.capacidad;

            return { ...classroom, id: classroom._id, name: classroom.nombre_o_numero, futureOccupancy, hasCapacity };
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
                s._id === sectionId ? { ...s, asignacion: { ...s.asignacion, aula_id: classroomId } } : s
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
                        const sectionIndex = newSections.findIndex(s => s._id === assignment.sectionId);
                        if (sectionIndex > -1) {
                            newSections[sectionIndex] = {
                                ...newSections[sectionIndex],
                                asignacion: { ...newSections[sectionIndex].asignacion, aula_id: assignment.classroomId }
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
                unassignedCount: allSections.filter(s => !s.asignacion?.aula_id).length,
                failureSummary: 'La simulación local falló. Revise la consola para más detalles.'
            });
        } finally {
            setIsAssigning(false)
        }
    }

    const courseForModal = assigningSection ? getCourseForSection(assigningSection) : null;
    const availableClassroomsForModal = getAvailableClassrooms(assigningSection);

    const renderCell = (year: number, timeSlot: string, day: string, semester: number) => {
        const sectionsForCell = getSections(year, timeSlot, day, semester);
        if (sectionsForCell.length === 0) {
            return <TableCell className="h-20 border-r" onClick={() => handleOpenUpsertModal(day, semester, year, null)}></TableCell>;
        }
        
        return (
            <TableCell className="p-1 align-top h-20 border-r text-xs" onClick={() => handleOpenUpsertModal(day, semester, year, sectionsForCell[0])}>
                {sectionsForCell.map(section => {
                    const course = getCourseForSection(section);
                    const assignedClassroomName = section.asignacion?.aula_id ? classroomMap.get(section.asignacion.aula_id) : null;

                    return (
                        <div key={section._id} className="bg-muted p-1 rounded-sm h-full flex flex-col justify-center text-center">
                           <p className="font-bold text-[10px] leading-tight">{course?.name}</p>
                           <p className="text-muted-foreground text-[9px]">{section.nombre_comision}</p>
                           {assignedClassroomName ? (
                             <Button 
                                variant="link" 
                                className="text-muted-foreground underline-offset-2 hover:no-underline h-auto p-0 text-[9px]"
                                onClick={(e) => { e.stopPropagation(); handleOpenAssignModal(section); }}
                            >
                                {assignedClassroomName}
                            </Button>
                           ) : (
                            <Button 
                                variant="link" 
                                className="text-destructive h-auto p-0 text-[9px] font-bold"
                                onClick={(e) => { e.stopPropagation(); handleOpenAssignModal(section); }}
                            >
                               Asignar Aula
                            </Button>
                           )}
                           <p className="text-muted-foreground text-[9px] mt-1">{section.profesor}</p>
                           <p className="text-muted-foreground text-[9px]">{section.inscriptos} inscriptos</p>
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
                    <SelectItem key={program._id} value={program._id}>{program.nombre_carrera}</SelectItem>
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
                                     {renderCell(year, timeSlot, day, 1)}
                                     {renderCell(year, timeSlot, day, 2)}
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

    {isUpsertComisionModalOpen && modalContext && (
      <UpsertComisionModal
        isOpen={isUpsertComisionModalOpen}
        onClose={() => setIsUpsertComisionModalOpen(false)}
        comision={selectedComision}
        context={modalContext}
        courses={courses}
      />
    )}

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
                        <span>{assigningSection?.inscriptos} alumnos</span>
                    </div>
                </div>
                <div className="border rounded-md max-h-[300px] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Aula</TableHead>
                                <TableHead>Ocupación Futura</TableHead>
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
                                        <Button 
                                            size="sm" 
                                            onClick={() => handleAssignClassroom(assigningSection!._id, classroom.id)}
                                            disabled={!classroom.hasCapacity}
                                        >
                                            Asignar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {availableClassroomsForModal.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
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
