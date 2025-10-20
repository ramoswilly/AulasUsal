

'use client'

import * as React from 'react'
import Link from 'next/link'
import { courses, programs, sections, classrooms } from '@/lib/data'
import { PageHeader } from '@/components/page-header'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

type ScheduleCellData = {
    course: Course;
    section: Section;
} | null;

const timeSlots = [
    '09:00 a 10:45 hs.',
    '11:00 a 13:00 hs.',
    '09:00 a 12:30 hs.', // 2nd/3rd year morning
    '14:00 a 16:00 hs.',
    '16:15 a 17:30 hs.',
    '14:00 a 17:30 hs.', // 2nd/3rd year afternoon
    '18:30 a 20:00 hs.',
    '20:15 a 21:30 hs.',
];

function YearSchedule({ year, coursesForYear, sectionsForYear }: { year: number, coursesForYear: Course[], sectionsForYear: Section[] }) {
    const commissions = [...new Set(sectionsForYear.filter(s => {
        const course = courses.find(c => c.id === s.courseId);
        return course?.year === year;
    }).map(s => s.commission))];

    const getCourseForSection = (section: Section): Course | undefined => {
        return courses.find(c => c.id === section.courseId);
    }
    
    const getSectionsForCommission = (commission: string, semester: number, day: string) => {
        return sectionsForYear.filter(s => 
            s.commission === commission &&
            s.semester === semester &&
            s.days.includes(day)
        );
    }

    const getStartTime = (commission: string) => {
        const section = sectionsForYear.find(s => s.commission === commission);
        if (!section) return '';
        if (section.startTime.startsWith('09:00')) return '9 a 10:45 hs.';
        if (section.startTime.startsWith('11:00')) return '11 a 13:00 hs.';
        if (commission.includes('TARDE')) {
            if (section.startTime.startsWith('14:00')) return '14:00 -16:00 HS.';
            if (section.startTime.startsWith('16:15')) return '16:15 a 17.30 HS';
        }
        if (commission.includes('NOCHE')) {
            if (section.startTime.startsWith('18:30')) return '18:30-20.00 HS';
            if (section.startTime.startsWith('20:15')) return '20.15-21.30 HS';
        }
        return `${section.startTime} - ${section.endTime}`;
    }

    const getTimeLabelForCommission = (commission: string) => {
        const section = sectionsForYear.find(s => s.commission === commission);
        if (!section) return '';

        if(year === 1){
            if(section.startTime === '09:00') return '9 a 10:45 hs.'
            if(section.startTime === '11:00') return '11 a 13:00 hs.'
        }
        if(year > 1 && year < 4) {
             if(section.startTime === '09:00') return '9 a 10:45 hs.'
             if(section.startTime === '11:00') return '11 a 12:30 hs.'
        }

        if(commission.includes('TARDE')){
            if(section.startTime === '14:00') return '14:00 -16:00 HS.'
            if(section.startTime === '16:15') return '16:15 a 17.30 HS'
        }
        if(commission.includes('NOCHE')){
            if(section.startTime === '18:30') return '18:30-20.00 HS'
            if(section.startTime === '20:15') return '20.15-21.30 HS'
        }

        return `${section.startTime} a ${section.endTime} hs.`
    }


    const renderCell = (sections: Section[]) => {
        if (sections.length === 0) return <TableCell className="h-24"></TableCell>;
        
        return (
            <TableCell className="p-1 align-top h-24 text-xs">
                {sections.map(section => {
                    const course = getCourseForSection(section);
                    return (
                        <div key={section.id} className="bg-muted p-1 rounded-sm h-full flex flex-col justify-between">
                           <div>
                             <p className="font-bold">{course?.name}</p>
                             <p className="text-muted-foreground">{course?.id}</p>
                             <p className="text-muted-foreground">{section.professor}</p>
                           </div>
                        </div>
                    )
                })}
            </TableCell>
        )
    }

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>{year}º AÑO</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <Table className="border">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] border-r">AÑO</TableHead>
                            <TableHead className="w-[100px] border-r">COMISIÓN</TableHead>
                            <TableHead className="w-[150px] border-r"></TableHead>
                            {days.map(day => (
                                <TableHead key={day} colSpan={2} className="text-center border-r">{day}</TableHead>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableHead className="border-r"></TableHead>
                            <TableHead className="border-r"></TableHead>
                            <TableHead className="border-r"></TableHead>
                            {days.map(day => (
                                <React.Fragment key={day}>
                                    <TableHead className="text-center border-r font-normal">Primer Cuatrimestre</TableHead>
                                    <TableHead className="text-center border-r font-normal">Segundo Cuatrimestre</TableHead>
                                </React.Fragment>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {commissions.map((commission, idx) => (
                           <React.Fragment key={commission}>
                             { year < 4 && Array.from({length: year === 1 ? 2 : 1}).map((_, timeSlotIndex) => {
                                const isFirstRowOfCommission = timeSlotIndex === 0;
                                
                                let timeLabel = '';
                                if(year === 1) timeLabel = timeSlotIndex === 0 ? '9 a 10:45 hs.' : '11 a 13:00 hs.';
                                else if (year > 1) timeLabel = '9 a 12:30 hs.';

                                if(commission.includes('TARDE')){
                                     timeLabel = timeSlotIndex === 0 ? '14:00 - 16:00 HS.' : '16:15 a 17.30 HS.';
                                }
                                if(commission.includes('NOCHE')){
                                     timeLabel = timeSlotIndex === 0 ? '18:30 - 20.00 HS.' : '20:15 a 21.30 HS.';
                                }

                                const filterByTime = (s:Section) => {
                                    if(year === 1){
                                        if (timeSlotIndex === 0) return s.startTime.startsWith('09');
                                        if (timeSlotIndex === 1) return s.startTime.startsWith('11');
                                    }
                                     if(year > 1 && year < 4){
                                        return s.startTime.startsWith('09') || s.startTime.startsWith('11')
                                    }
                                     if(commission.includes('TARDE')){
                                         if (timeSlotIndex === 0) return s.startTime.startsWith('14');
                                         if (timeSlotIndex === 1) return s.startTime.startsWith('16');
                                     }
                                     if(commission.includes('NOCHE')){
                                         if (timeSlotIndex === 0) return s.startTime.startsWith('18');
                                         if (timeSlotIndex === 1) return s.startTime.startsWith('20');
                                     }
                                    return true;
                                }

                                return (
                                <TableRow key={`${commission}-${timeSlotIndex}`}>
                                    {isFirstRowOfCommission && (
                                        <TableCell className="border-r align-middle text-center" rowSpan={year === 1 ? 2 : 1}>{commission}</TableCell>
                                    )}
                                    <TableCell className="border-r">{timeLabel}</TableCell>
                                    {days.map(day => (
                                        <React.Fragment key={day}>
                                            {renderCell(getSectionsForCommission(commission, 1, day).filter(filterByTime))}
                                            {renderCell(getSectionsForCommission(commission, 2, day).filter(filterByTime))}
                                        </React.Fragment>
                                    ))}
                                </TableRow>
                                )
                             })}
                             { year === 4 && (
                                <TableRow>
                                    <TableCell className="border-r">{commission}</TableCell>
                                    <TableCell className="border-r">14:00 a 21:30 hs.</TableCell>
                                    {days.map(day => (
                                        <React.Fragment key={day}>
                                            {renderCell(getSectionsForCommission(commission, 1, day))}
                                            {renderCell(getSectionsForCommission(commission, 2, day))}
                                        </React.Fragment>
                                    ))}
                                </TableRow>
                             )}
                           </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}


export default function SchedulePage() {
    // For now, we are hardcoding to the first program. This could be a filter later.
    const selectedProgram = programs[0];

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
        {years.map(year => {
            const coursesForYear = programCourses.filter(c => c.year === year);
            const courseIdsForYear = coursesForYear.map(c => c.id);
            const sectionsForYear = sections.filter(s => courseIdsForYear.includes(s.courseId));
            return (
                <YearSchedule 
                    key={year}
                    year={year}
                    coursesForYear={coursesForYear}
                    sectionsForYear={sectionsForYear}
                />
            )
        })}
      </div>
    </div>
  )
}
