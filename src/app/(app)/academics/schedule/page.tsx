
'use client'

import * as React from 'react'
import Link from 'next/link'
import { courses, programs, sections, classrooms } from '@/lib/data'
import { PageHeader } from '@/components/page-header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Section } from '@/lib/types'

const shifts = [
    { id: 'morning', name: 'Mañana (8:00 - 13:00)', start: 8, end: 13 },
    { id: 'afternoon', name: 'Tarde (13:00 - 18:00)', start: 13, end: 18 },
    { id: 'evening', name: 'Noche (18:00 - 23:00)', start: 18, end: 23 },
]

const semesters = [
    { id: 1, name: '1er Cuatrimestre' },
    { id: 2, name: '2do Cuatrimestre' },
]

const years = [1, 2, 3, 4, 5];

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

type EnrichedSection = Section & {
    courseName: string;
    programId: string;
    courseYear: number;
    classroomName?: string;
    startHour: number;
    endHour: number;
}

function ScheduleGrid({ sections, timeSlots }: { sections: EnrichedSection[], timeSlots: string[] }) {
    
    const getSectionsForSlot = (day: string, time: string) => {
        const hour = parseInt(time.split(':')[0]);
        return sections.filter(s => 
            s.days.includes(day) && 
            hour >= s.startHour && 
            hour < s.endHour
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <div className="grid grid-cols-[auto_1fr] overflow-x-auto">
                    {/* Header */}
                    <div className="sticky left-0 z-10 bg-card border-b border-r">
                        <div className="h-12 flex items-center justify-center px-2 border-b">
                            <span className="text-sm font-medium text-muted-foreground">Hora</span>
                        </div>
                        {timeSlots.map(time => (
                            <div key={time} className="h-32 flex items-center justify-center p-2 border-b border-r text-xs text-muted-foreground font-semibold">
                                {time}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-6 min-w-max">
                        {days.map(day => (
                            <div key={day} className="flex flex-col border-b">
                                <div className="h-12 flex items-center justify-center p-2 border-b sticky top-0 bg-card">
                                    <h3 className="font-semibold">{day}</h3>
                                </div>
                                {timeSlots.map(time => {
                                    const sectionsInSlot = getSectionsForSlot(day, time);
                                    const isFirstHourOfSection = sectionsInSlot.some(s => s.startHour === parseInt(time.split(':')[0]));

                                    if (sectionsInSlot.length > 0 && !isFirstHourOfSection) {
                                        return null; // Don't render a cell if it's not the start of a section
                                    }

                                    return (
                                        <div key={`${day}-${time}`} className={cn(
                                            "relative border-l flex flex-col p-1 text-xs",
                                            "border-b",
                                            sectionsInSlot.length === 0 ? "h-32" : ""
                                        )}>
                                            {sectionsInSlot.map(section => {
                                                const duration = section.endHour - section.startHour;
                                                return (
                                                    <div 
                                                        key={section.id} 
                                                        className="bg-secondary text-secondary-foreground rounded-md p-2 mb-1"
                                                        style={{ height: `calc(${duration * 8}rem - 4px)` }}
                                                    >
                                                        <p className="font-bold">{section.courseName}</p>
                                                        <p className="text-muted-foreground text-xs">{section.professor || 'Profesor no asignado'}</p>
                                                        <p className="font-semibold mt-1">{section.classroomName || 'Sin aula'}</p>
                                                        
                                                        {!section.assignedClassroomId && (
                                                            <Button size="sm" asChild className="mt-2 text-xs h-6">
                                                                <Link href="/academics/sections">Asignar aula</Link>
                                                            </Button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


export default function SchedulePage() {
    const [selectedProgram, setSelectedProgram] = React.useState(programs[0].id)
    const [selectedYear, setSelectedYear] = React.useState('1');
    const [selectedShift, setSelectedShift] = React.useState(shifts[0].id)
    const [selectedSemester, setSelectedSemester] = React.useState(String(semesters[0].id))


    const courseMap = new Map(courses.map(c => [c.id, { name: c.name, programId: c.programId, year: c.year }]));
    const classroomMap = new Map(classrooms.map(c => [c.id, c.name]));

    const enrichedSections: EnrichedSection[] = sections.map(section => {
        const course = courseMap.get(section.courseId);
        const startHour = parseInt(section.startTime.split(':')[0]);
        const endHour = parseInt(section.endTime.split(':')[0]);
        return {
            ...section,
            courseName: course?.name || 'N/A',
            programId: course?.programId || 'N/A',
            courseYear: course?.year || 0,
            classroomName: classroomMap.get(section.assignedClassroomId || ''),
            startHour,
            endHour
        }
    });

    const activeShift = shifts.find(s => s.id === selectedShift) || shifts[0];
    const activeSemester = parseInt(selectedSemester);
    const activeYear = parseInt(selectedYear);

    const timeSlots = Array.from(
        { length: activeShift.end - activeShift.start },
        (_, i) => `${(activeShift.start + i).toString().padStart(2, '0')}:00`
    );

    const filteredSections = enrichedSections.filter(s => 
        s.programId === selectedProgram &&
        s.courseYear === activeYear &&
        s.semester === activeSemester &&
        s.startHour >= activeShift.start && 
        s.endHour <= activeShift.end
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Horarios de Comisiones"
        breadcrumbs={[
            { href: '/dashboard', label: 'Home' },
            { href: '/academics/schedule', label: 'Horarios' }
        ]}
      />
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={selectedProgram} onValueChange={setSelectedProgram}>
          <SelectTrigger className="w-full sm:w-[240px]">
            <SelectValue placeholder="Seleccionar carrera..." />
          </SelectTrigger>
          <SelectContent>
            {programs.map((program) => (
              <SelectItem key={program.id} value={program.id}>
                {program.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
         <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full sm:w-[120px]">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}º Año
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedShift} onValueChange={setSelectedShift}>
          <SelectTrigger className="w-full sm:w-[240px]">
            <SelectValue placeholder="Seleccionar turno..." />
          </SelectTrigger>
          <SelectContent>
            {shifts.map((shift) => (
              <SelectItem key={shift.id} value={shift.id}>
                {shift.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-full sm:w-[240px]">
            <SelectValue placeholder="Seleccionar cuatrimestre..." />
          </SelectTrigger>
          <SelectContent>
            {semesters.map((semester) => (
              <SelectItem key={semester.id} value={String(semester.id)}>
                {semester.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScheduleGrid sections={filteredSections} timeSlots={timeSlots} />
    </div>
  )
}
