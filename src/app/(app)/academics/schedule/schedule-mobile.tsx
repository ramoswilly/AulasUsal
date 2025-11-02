
'use client'

import * as React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge'
import { Users, User, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { IComision } from '@/models/Comision'

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const timeSlots = ['18:30 a 21:30 hs.'];

function SectionCard({ section, onAssignClick }: { section: any, onAssignClick: (section: any) => void }) {
    const course = section.materia_ids?.[0];

    return (
        <div className="bg-card border rounded-lg p-3 text-left shadow-sm w-full">
            <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="text-sm h-6 leading-tight px-2">{section.nombre_comision}</Badge>
                <div className="flex items-center text-muted-foreground text-sm">
                    <Users className="w-4 h-4 mr-1.5" />
                    <span>{section.inscriptos}</span>
                </div>
            </div>

            <p className="font-semibold leading-snug flex-grow my-2 text-base">{course?.nombre_materia}</p>
            
            <div className="flex items-center text-muted-foreground mt-auto text-sm">
                <User className="w-4 h-4 mr-1.5" />
                <span className="truncate">{section.profesor}</span>
            </div>

            <div className="mt-3 flex justify-end">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); onAssignClick(section); }}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Asignar Aula
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Asignar un aula a esta comisión</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}

export function ScheduleMobile({ 
    years, 
    getSections, 
    handleOpenUpsertModal, 
    handleOpenAssignModal 
}: { 
    years: number[], 
    getSections: (year: number, timeSlot: string, day: string, semester: number) => any[],
    handleOpenUpsertModal: (day: string, semester: number, year: number, comision: IComision | null) => void,
    handleOpenAssignModal: (section: any) => void
}) {
    const [activeYear, setActiveYear] = React.useState(`year-${years[0]}`);

    return (
        <div className="space-y-4">
            <Accordion type="single" collapsible value={activeYear} onValueChange={setActiveYear} className="w-full">
                {years.map(year => (
                    <AccordionItem key={`year-${year}`} value={`year-${year}`}>
                        <AccordionTrigger className="text-lg font-bold">
                            {year}º AÑO
                        </AccordionTrigger>
                        <AccordionContent>
                            <Accordion type="single" collapsible className="w-full">
                                {days.map(day => (
                                    <AccordionItem key={day} value={day}>
                                        <AccordionTrigger className="font-semibold">{day}</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-3">
                                                <h4 className="font-medium text-center text-muted-foreground">Primer Cuatrimestre</h4>
                                                <div className="space-y-3">
                                                    {timeSlots.map(timeSlot => {
                                                        const sections = getSections(year, timeSlot, day, 1);
                                                        if (sections.length === 0) {
                                                            return (
                                                                <div 
                                                                    key={`${timeSlot}-1`} 
                                                                    className="text-center text-sm text-muted-foreground py-4 border rounded-md border-dashed cursor-pointer hover:bg-muted"
                                                                    onClick={() => handleOpenUpsertModal(day, 1, year, null)}
                                                                >
                                                                    No hay comisiones. Toca para agregar.
                                                                </div>
                                                            );
                                                        }
                                                        return sections.map(section => (
                                                            <SectionCard 
                                                                key={section._id} 
                                                                section={section} 
                                                                onAssignClick={handleOpenAssignModal} 
                                                            />
                                                        ));
                                                    })}
                                                </div>
                                                <h4 className="font-medium text-center text-muted-foreground pt-4">Segundo Cuatrimestre</h4>
                                                <div className="space-y-3">
                                                    {timeSlots.map(timeSlot => {
                                                        const sections = getSections(year, timeSlot, day, 2);
                                                        if (sections.length === 0) {
                                                            return (
                                                                <div 
                                                                    key={`${timeSlot}-2`} 
                                                                    className="text-center text-sm text-muted-foreground py-4 border rounded-md border-dashed cursor-pointer hover:bg-muted"
                                                                    onClick={() => handleOpenUpsertModal(day, 2, year, null)}
                                                                >
                                                                    No hay comisiones. Toca para agregar.
                                                                </div>
                                                            );
                                                        }
                                                        return sections.map(section => (
                                                            <SectionCard 
                                                                key={section._id} 
                                                                section={section} 
                                                                onAssignClick={handleOpenAssignModal} 
                                                            />
                                                        ));
                                                    })}
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
