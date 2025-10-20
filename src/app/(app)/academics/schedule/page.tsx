
'use client'

import * as React from 'react'
import Link from 'next/link'
import { courses, programs, sections, classrooms } from '@/lib/data'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Section, Course } from '@/lib/types'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table'

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

type EnrichedSection = Section & {
    courseName: string;
    courseYear: number;
}

type ScheduleRow = {
    course: Course;
    section: EnrichedSection;
    schedule: Record<string, { startTime: string, endTime: string, classroomName?: string } | null>;
}

function YearSchedule({ year, sections, courses, classroomMap }: { year: number, sections: EnrichedSection[], courses: Course[], classroomMap: Map<string, string>}) {
    const processSemester = (semester: number) => {
        const yearCourses = courses.filter(c => c.year === year);
        const semesterSections = sections.filter(s => s.courseYear === year && s.semester === semester);
        
        const scheduleRows: ScheduleRow[] = [];

        for (const course of yearCourses) {
            const courseSections = semesterSections.filter(s => s.courseId === course.id);
            for (const section of courseSections) {
                const schedule: ScheduleRow['schedule'] = {};
                for (const day of days) {
                    if (section.days.includes(day)) {
                        schedule[day] = {
                            startTime: section.startTime,
                            endTime: section.endTime,
                            classroomName: classroomMap.get(section.assignedClassroomId || ''),
                        }
                    } else {
                        schedule[day] = null;
                    }
                }
                scheduleRows.push({ course, section, schedule });
            }
        }
        return scheduleRows.sort((a,b) => a.course.name.localeCompare(b.course.name));
    }

    const firstSemesterRows = processSemester(1);
    const secondSemesterRows = processSemester(2);

    const renderTable = (semesterRows: ScheduleRow[], semesterTitle: string) => (
        <>
            <h3 className="text-xl font-semibold mt-6 mb-3">{semesterTitle}</h3>
            {semesterRows.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px]">Materia</TableHead>
                            <TableHead>Comisión</TableHead>
                            <TableHead>Profesor</TableHead>
                            {days.map(day => <TableHead key={day}>{day}</TableHead>)}
                            <TableHead>Aula</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {semesterRows.map(({ course, section, schedule }) => (
                            <TableRow key={section.id}>
                                <TableCell className="font-medium">{course.name}</TableCell>
                                <TableCell>{section.commission}</TableCell>
                                <TableCell>{section.professor || 'N/A'}</TableCell>
                                {days.map(day => (
                                    <TableCell key={day}>
                                        {schedule[day] ? `${schedule[day]?.startTime} - ${schedule[day]?.endTime}` : ''}
                                    </TableCell>
                                ))}
                                 <TableCell>
                                    {section.assignedClassroomId ? classroomMap.get(section.assignedClassroomId) : (
                                        <Button size="sm" variant="outline" asChild className="text-xs h-7">
                                            <Link href="/academics/sections">Asignar</Link>
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-sm text-muted-foreground">No hay comisiones para este cuatrimestre.</p>
            )}
        </>
    )


    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>{year}º Año</CardTitle>
            </CardHeader>
            <CardContent>
                {renderTable(firstSemesterRows, '1er Cuatrimestre')}
                {renderTable(secondSemesterRows, '2do Cuatrimestre')}
            </CardContent>
        </Card>
    )
}


export default function SchedulePage() {
    // For now, we are hardcoding to the first program. This could be a filter later.
    const selectedProgram = programs[0];

    const courseMap = new Map(courses.map(c => [c.id, { name: c.name, programId: c.programId, year: c.year }]));
    const classroomMap = new Map(classrooms.map(c => [c.id, c.name]));

    const enrichedSections: EnrichedSection[] = sections.map(section => {
        const course = courseMap.get(section.courseId);
        return {
            ...section,
            courseName: course?.name || 'N/A',
            courseYear: course?.year || 0,
        }
    }).filter(section => {
        const course = courses.find(c => c.id === section.courseId);
        return course?.programId === selectedProgram.id;
    });

    const programCourses = courses.filter(c => c.programId === selectedProgram.id);
    const years = [...new Set(programCourses.map(c => c.year))].sort((a,b) => a - b);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={`Horarios de ${selectedProgram.name}`}
        breadcrumbs={[
            { href: '/dashboard', label: 'Home' },
            { href: '/academics/schedule', label: 'Horarios' }
        ]}
      />
      
      <div>
        {years.map(year => (
            <YearSchedule 
                key={year}
                year={year}
                sections={enrichedSections}
                courses={programCourses}
                classroomMap={classroomMap}
            />
        ))}
      </div>
    </div>
  )
}
