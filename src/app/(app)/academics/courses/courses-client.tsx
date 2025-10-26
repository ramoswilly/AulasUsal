
'use client'

import * as React from 'react'
import { PageHeader } from '@/components/page-header'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookCopy, GraduationCap, ChevronRight, FileText, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Carrera, Materia } from '@/lib/Tipos/tipos'

function ProgramsCards({ programs, courses, onSelectProgram }: { programs: Carrera[], courses: Materia[], onSelectProgram: (programId: string) => void }) {
    const courseCountMap = courses.reduce((acc, course) => {
        const programId = course.carrera_id.toString();
        acc.set(programId, (acc.get(programId) || 0) + 1);
        return acc;
    }, new Map<string, number>());

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <Card key={program._id}>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <GraduationCap className="size-8 text-accent" />
                            <div>
                                <CardTitle className="font-headline">{program.nombre_carrera}</CardTitle>
                                <CardDescription>{courseCountMap.get(program._id.toString()) || 0} materias</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full" onClick={() => onSelectProgram(program._id)}>
                            Ver Plan de Estudio <ChevronRight className="ml-2 size-4" />
                        </Button>
                    </CardContent>
                </Card>
              ))}
        </div>
    )
}

function CoursesByProgram({ programs, courses, selectedProgramId, onClear }: { programs: Carrera[], courses: Materia[], selectedProgramId: string | null; onClear: () => void; }) {
    const programMap = new Map(programs.map(p => [p._id, p.nombre_carrera]));
    const filteredCourses = selectedProgramId ? courses.filter(c => c.carrera_id.toString() === selectedProgramId) : courses;
    
    const coursesByProgram = filteredCourses.reduce((acc, course) => {
        const programId = course.carrera_id.toString();
        const programCourses = acc.get(programId) || [];
        programCourses.push(course);
        acc.set(programId, programCourses);
        return acc;
    }, new Map<string, Materia[]>());

    return (
        <div className="space-y-6">
            {selectedProgramId && (
                <Button variant="ghost" onClick={onClear} className="mb-4">
                    <ArrowLeft className="mr-2 size-4" />
                    Volver a todas las carreras
                </Button>
            )}
            {Array.from(coursesByProgram.entries()).map(([programId, programCourses]) => {
                const coursesByYear = programCourses.reduce((acc, course) => {
                    const yearCourses = acc.get(course.anio_carrera) || [];
                    yearCourses.push(course);
                    acc.set(course.anio_carrera, yearCourses);
                    return acc;
                }, new Map<number, Materia[]>());

                return (
                    <Card key={programId}>
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">{programMap.get(programId)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full" defaultValue="year-1">
                                {Array.from(coursesByYear.entries()).sort(([a], [b]) => a - b).map(([year, yearCourses]) => (
                                    <AccordionItem value={`year-${year}`} key={year}>
                                        <AccordionTrigger className="text-base font-semibold">{year}º Año</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-2">
                                                {yearCourses.map(course => (
                                                    <div key={course._id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                                                        <FileText className="size-4 text-muted-foreground" />
                                                        <span className="text-sm">{course.nombre_materia}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

export default function AcademicsClient({ carreras, materias }: { carreras: Carrera[], materias: Materia[] }) {
    const [activeTab, setActiveTab] = React.useState('programs');
    const [selectedProgramId, setSelectedProgramId] = React.useState<string | null>(null);

    const handleSelectProgram = (programId: string) => {
        setSelectedProgramId(programId);
        setActiveTab('courses');
    };

    const handleClearProgram = () => {
        setSelectedProgramId(null);
    }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Gestión Académica"
        breadcrumbs={[
            { href: '/dashboard', label: 'Home' },
            { href: '/academics/courses', label: 'Académico' }
        ]}
      />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
            <TabsList>
                <TabsTrigger value="programs">
                    <GraduationCap className="mr-2" />
                    Carreras
                </TabsTrigger>
                <TabsTrigger value="courses">
                    <BookCopy className="mr-2" />
                    Plan de Estudios
                </TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="programs">
          <ProgramsCards programs={carreras} courses={materias} onSelectProgram={handleSelectProgram} />
        </TabsContent>
        <TabsContent value="courses">
          <CoursesByProgram programs={carreras} courses={materias} selectedProgramId={selectedProgramId} onClear={handleClearProgram} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
