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
import { Users, Projector, Bot, Loader2, Sparkles, User, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { runAutoAssignment, type AssignmentResult } from '@/lib/actions'
// import { UpsertComisionModal } from '@/components/modals/sedes/UpsertComisionModal'
// import type { IComision } from '@/models/Comision'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import './responsive-schedule.css'

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const timeSlots = ['18:30 a 21:30 hs.'];

function SectionCard({ section, onAssignClick, classroom }: { section: Section, onAssignClick: (section: Section) => void, classroom: any | null }) {
    const course = section.materia_ids?.[0];
    const capacity = classroom ? classroom.capacidad : null;

    return (
        <div className="bg-card border rounded-lg p-2 h-full flex flex-col text-left shadow-sm text-xs relative pb-7">
            <div className="flex justify-between items-start mb-1">
                <Badge variant="secondary" className="text-[10px] h-5 leading-tight px-1.5">{section.nombre_comision}</Badge>
                <div className="flex items-center text-muted-foreground">
                    <Users className="w-3 h-3 mr-1" />
                    <span>{section.inscriptos}{capacity ? `/${capacity}` : ''}</span>
                </div>
            </div>

            <p className="font-semibold leading-snug flex-grow my-1">{course?.nombre_materia}</p>
            
            <div className="absolute bottom-1 left-2 right-2">
                <div className="flex items-center text-muted-foreground mt-1">
                    <User className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate pr-6">{section.profesor}</span>
                </div>

                <div className="flex items-center text-muted-foreground text-xs mt-0.5">
                    <Projector className="w-3 h-3 mr-1" />
                    <span>{classroom ? classroom.nombre_o_numero : 'Sin asignar'}</span>
                </div>
            </div>


            <div className="absolute bottom-0 right-0">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="w-7 h-7"
                                onClick={(e) => { e.stopPropagation(); onAssignClick(section); }}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Asignar Aula</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}

export function ScheduleClient({ courses, programs, allSections, classrooms }: { courses: any[], programs: any[], allSections: any[], classrooms: any[] }) {
    const [selectedProgram, setSelectedProgram] = React.useState(programs[0]._id);
    const [selectedTurn, setSelectedTurn] = React.useState('NOCHE'); 
    const [sections, setSections] = React.useState(allSections);
    const [assigningSection, setAssigningSection] = React.useState<Section | null>(null);
    const [isAssigning, setIsAssigning] = React.useState(false)
    const [assignmentResult, setAssignmentResult] = React.useState<AssignmentResult | null>(null)
    // const [isUpsertComisionModalOpen, setIsUpsertComisionModalOpen] = React.useState(false);
    // const [selectedComision, setSelectedComision] = React.useState<IComision | null>(null);
    // const [modalContext, setModalContext] = React.useState<{ day: string; semester: number; year: number; turn: string; selectedProgram: string; } | null>(null);

    const { toast } = useToast();

    const selectedProgramData = programs.find(p => p._id === selectedProgram);
    const years = selectedProgramData ? Array.from({ length: selectedProgramData.anios }, (_, i) => i + 1) : [];
    const classroomMap = new Map(classrooms.map(c => [c._id, c.nombre_o_numero]));
    
    const getSections = (year: number, timeSlot: string, day: string, semester: number) => {
        return sections.filter(s => {
            if (s.horario.dia !== day || !s.horario.turno.includes(selectedTurn)) {
                return false;
            }

            const hasMatchingCourse = s.materia_ids?.some(materia => {
                if (!materia) return false;
                const programId = materia.carrera_id?.toString();
                return programId === selectedProgram && materia.anio_carrera === year && materia.cuatrimestre === semester;
            });

            return hasMatchingCourse;
        });
    }

    /* const handleOpenUpsertModal = (day: string, semester: number, year: number, comision: IComision | null) => {
        setModalContext({ day, semester, year, turn: selectedTurn, selectedProgram });
        setSelectedComision(comision);
        setIsUpsertComisionModalOpen(true);
    } */

    const getAvailableClassrooms = (sectionToAssign: Section | null): AvailableClassroom[] => {
        if (!sectionToAssign) return [];
      
        const available = classrooms
          .map(classroom => {
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

          return available.sort((a, b) => {
            if (a.hasCapacity !== b.hasCapacity) {
                return a.hasCapacity ? -1 : 1;
            }
            if (a.hasCapacity) {
              const aProximity = a.capacity - a.futureOccupancy;
              const bProximity = b.capacity - b.futureOccupancy;
              return aProximity - bProximity;
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

    const courseForModal = assigningSection ? assigningSection.materia_ids?.[0] : null;
    const availableClassroomsForModal = getAvailableClassrooms(assigningSection);

    const renderCell = (year: number, timeSlot: string, day: string, semester: number) => {
        const sectionsForCell = getSections(year, timeSlot, day, semester);
        if (sectionsForCell.length === 0) {
            return <TableCell 
                className="h-28 border-r" 
                // onClick={() => handleOpenUpsertModal(day, semester, year, null)}
            ></TableCell>;
        }
        
        return (
            <TableCell 
                className="p-1 align-top h-28 border-r" 
                // onClick={() => handleOpenUpsertModal(day, semester, year, sectionsForCell[0])}
            >
                {sectionsForCell.map(section => {
                    const classroom = classrooms.find(c => c._id === section.asignacion?.aula_id);
                    return (
                        <SectionCard 
                            key={section._id} 
                            section={section} 
                            onAssignClick={handleOpenAssignModal}
                            classroom={classroom}
                        />
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
      <div className="flex flex-wrap gap-4 mb-4">
        <Select value={selectedProgram} onValueChange={setSelectedProgram}>
            <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Seleccionar carrera..." />
            </SelectTrigger>
            <SelectContent>
                {programs.map(program => (
                    <SelectItem key={program._id} value={program._id}>{program.nombre_carrera}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        <Select value={selectedTurn} onValueChange={setSelectedTurn}>
            <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Seleccionar turno..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="MAÑANA">Mañana</SelectItem>
                <SelectItem value="TARDE">Tarde</SelectItem>
                <SelectItem value="NOCHE">Noche</SelectItem>
            </SelectContent>
        </Select>
        <Button onClick={handleAutoAssign} disabled={isAssigning} className="w-full md:w-auto md:ml-auto">
            {isAssigning ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              <Bot className="mr-2" />
            )}
            Auto-Asignar
          </Button>
      </div>
      
      <div className="responsive-schedule">
        <Table className="border-collapse border schedule-table">
          <TableHeader>
              <TableRow>
                  <TableHead className="min-w-[50px] border-r text-center font-bold">AÑO</TableHead>
                  <TableHead className="min-w-[80px] border-r text-center font-bold">COMISIÓN</TableHead>
                  {days.map(day => (
                      <TableHead key={day} colSpan={2} className="text-center border-r font-bold min-w-[240px]">{day.toUpperCase()}</TableHead>
                  ))}
              </TableRow>
              <TableRow>
                  <TableHead className="border-r"></TableHead>
                  <TableHead className="border-r"></TableHead>
                  {days.map(day => (
                      <React.Fragment key={day}>
                          <TableHead className="text-center border-r font-normal min-w-[120px]">Primer Cuatrimestre</TableHead>
                          <TableHead className="text-center border-r font-normal min-w-[120px]">Segundo Cuatrimestre</TableHead>
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
                              <TableCell 
                                  data-label="AÑO"
                                  rowSpan={timeSlots.length} 
                                  className="border-r align-middle text-center font-bold min-w-[50px]"
                              >
                                  {year}º
                              </TableCell>
                          )}
                            <TableCell 
                              data-label="COMISIÓN"
                              className="border-r text-center text-xs min-w-[80px]"
                            >
                              {timeSlot}
                            </TableCell>
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
      </div>
    </div>

    {/* {isUpsertComisionModalOpen && modalContext && (
      <UpsertComisionModal
        isOpen={isUpsertComisionModalOpen}
        onClose={() => setIsUpsertComisionModalOpen(false)}
        comision={selectedComision}
        context={modalContext}
        courses={courses}
      />
    )} */}

    <Dialog open={!!assigningSection} onOpenChange={() => setAssigningSection(null)}>
        <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
                <DialogTitle>Asignar Aula</DialogTitle>
                <DialogDescription>
                    Seleccione un aula disponible para la comisión de <span className="font-semibold text-foreground">{courseForModal?.nombre_materia}</span>.
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
