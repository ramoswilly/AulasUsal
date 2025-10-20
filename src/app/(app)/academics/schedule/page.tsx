

'use client'

import * as React from 'react'
import Link from 'next/link'
import { courses, programs, sections, classrooms } from '@/lib/data'
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
import { cn } from '@/lib/utils'

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const timeSlots = ['18:30 a 20:00 hs.', '20:15 a 21:30 hs.'];

export default function SchedulePage() {
    const [selectedProgram, setSelectedProgram] = React.useState(programs[0].id);
    // For now, hardcoding turn because the data is only for night turn
    const [selectedTurn, setSelectedTurn] = React.useState('NOCHE'); 

    const programCourses = courses.filter(c => c.programId === selectedProgram);
    const years = [...new Set(programCourses.map(c => c.year))].sort((a,b) => a - b);
    const classroomMap = new Map(classrooms.map(c => [c.id, c.name]));
    
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
                             <p className="text-muted-foreground text-[9px]">{assignedClassroomName}</p>
                           ) : (
                            <Button asChild variant="link" className="text-destructive h-auto p-0 text-[9px] font-bold">
                               <Link href="/academics/sections">Asignar Aula</Link>
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
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={`Horarios de ${programs.find(p => p.id === selectedProgram)?.name}`}
        breadcrumbs={[
            { href: '/dashboard', label: 'Home' },
            { href: '/academics/schedule', label: 'Horarios' }
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
  )
}
