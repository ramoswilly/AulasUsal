'use client';

import { useState, useMemo } from 'react';
import { IComision } from '@/models/Comision';
import { IAula } from '@/models/Aula';
import { IMateria } from '@/models/Materia';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, User, MapPin, CalendarX, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Types
type Day = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';
type Shift = 'Mañana' | 'Tarde' | 'Noche';
type Semester = 'Primer Cuatrimestre' | 'Segundo Cuatrimestre' | 'Anual';

// Mappings
const days: Day[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const shifts: Shift[] = ['Mañana', 'Tarde', 'Noche'];
const semesters: Semester[] = ['Primer Cuatrimestre', 'Segundo Cuatrimestre', 'Anual'];

const dayMap: Record<number, Day> = { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado' };
const shiftMap: Record<number, Shift> = { 1: 'Mañana', 2: 'Tarde', 3: 'Noche' };
const semesterMap: Record<number, Semester> = { 1: 'Primer Cuatrimestre', 2: 'Segundo Cuatrimestre', 3: 'Anual' };

// Processed subject type for UI
interface ProcessedSubject {
  id: string;
  materia: string;
  docente: string;
  aula: string;
  day: Day;
  turno: Shift;
  cuatrimestre: Semester;
  year: number;
  horario: string; // Placeholder for now
}

interface ScheduleDisplayProps {
  scheduleData: IComision[];
  params: { careerId: string };
}

const shiftColors: Record<Shift, string> = {
    'Mañana': "bg-sky-100 text-sky-800 border-sky-200",
    'Tarde': "bg-amber-100 text-amber-800 border-amber-200",
    'Noche': "bg-indigo-100 text-indigo-800 border-indigo-200",
};

const yearColors: Record<string, string> = {
  '1': "bg-slate-100 text-slate-800 border-slate-200",
  '2': "bg-gray-100 text-gray-800 border-gray-200",
  '3': "bg-zinc-100 text-zinc-800 border-zinc-200",
  '4': "bg-neutral-100 text-neutral-800 border-neutral-200",
  '5': "bg-stone-100 text-stone-800 border-stone-200",
}

function SubjectCard({ item }: { item: ProcessedSubject }) {
    return (
        <div 
          className="rounded-lg p-3 text-sm shadow-sm relative overflow-hidden transition-all duration-300 bg-card hover:shadow-lg border-l-4 border-primary"
        >
          <div className="flex justify-between items-start mb-2 gap-2">
            <p className="font-bold text-foreground truncate pr-2 flex-1">{item.materia}</p>
            <div className='flex gap-1.5 shrink-0'>
              <Badge variant="secondary" className={cn("capitalize text-xs", yearColors[item.year])}>
                {item.year}° Año
              </Badge>
              <Badge variant="secondary" className={cn("capitalize text-xs", shiftColors[item.turno])}>{item.turno}</Badge>
            </div>
          </div>

          <div className="text-muted-foreground space-y-1.5">
            <div className="flex items-center gap-2"><MapPin size={14} /> <span>{(item.aula as any)?.nombre_o_numero || 'A confirmar'}</span></div>
            <div className="flex items-center gap-2"><User size={14} /> <span>{item.docente || 'A confirmar'}</span></div>
            {/* <div className="flex items-center gap-2"><Clock size={14} /> <span>{item.horario}</span></div> */}
          </div>
        </div>
    );
}

export function ScheduleDisplay({ scheduleData, params }: ScheduleDisplayProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<Semester | 'todos'>('todos');
  const [selectedShift, setSelectedShift] = useState<Shift | 'todos'>('todos');
  const [selectedYear, setSelectedYear] = useState<string>('todos');
  const [selectedDay, setSelectedDay] = useState<Day | 'todos'>('todos');
  
  const allSubjects = useMemo(() => {
    if (!scheduleData) return [];
    
    return scheduleData.map(comision => {
      const materia = (comision.materia_ids[0] as unknown as IMateria); // Assuming one materia per comision for now
      return {
        id: comision._id.toString(),
        materia: materia?.nombre_materia || 'Materia no encontrada',
        docente: comision.profesor,
        aula: (comision.asignacion?.aula_id as unknown as IAula)?.nombre_o_numero || 'A confirmar',
        day: dayMap[comision.horario.dia],
        turno: shiftMap[comision.horario.turno],
        cuatrimestre: semesterMap[comision.horario.cuatrimestre],
        year: materia?.anio_carrera || 0,
        horario: '', // TODO
      };
    });
  }, [scheduleData, params.careerId]);

  const availableYears = useMemo(() => {
    const years = new Set(allSubjects.map(s => s.year));
    return Array.from(years).sort((a, b) => a - b);
  }, [allSubjects]);

  const filteredSubjects = useMemo(() => {
    return allSubjects.filter(item => {
      if (selectedYear !== 'todos' && item.year.toString() !== selectedYear) return false;
      if (selectedShift !== 'todos' && item.turno !== selectedShift) return false;
      if (selectedDay !== 'todos' && item.day !== selectedDay) return false;
      if (selectedSemester !== 'todos' && item.cuatrimestre !== selectedSemester) return false;

      if (searchTerm) {
        const lowercasedFilter = searchTerm.toLowerCase();
        return (
          item.materia.toLowerCase().includes(lowercasedFilter) ||
          item.docente.toLowerCase().includes(lowercasedFilter) ||
          item.aula.toLowerCase().includes(lowercasedFilter)
        );
      }
      return true;
    });
  }, [allSubjects, searchTerm, selectedShift, selectedYear, selectedDay, selectedSemester]);

  const subjectsByDay = useMemo(() => {
    const byDay: Record<Day, ProcessedSubject[]> = {
        Lunes: [], Martes: [], Miércoles: [], Jueves: [], Viernes: [], Sábado: []
    };
    filteredSubjects.forEach(s => {
        if(s.day in byDay) {
            byDay[s.day].push(s);
        }
    });
    return byDay;
  }, [filteredSubjects]);

  if (!scheduleData || scheduleData.length === 0) {
    return (
        <div className="flex items-center justify-center py-20">
            <Alert className="max-w-md">
              <CalendarX className="h-4 w-4" />
              <AlertTitle>Sin Horarios</AlertTitle>
              <AlertDescription>
                Actualmente no hay horarios de cursada cargados para esta carrera.
              </AlertDescription>
            </Alert>
        </div>
    );
  }

  const shiftOrder: Record<Shift, number> = { 'Mañana': 1, 'Tarde': 2, 'Noche': 3 };
  const hasAnySubjects = filteredSubjects.length > 0;
  const tableDays = selectedDay === 'todos' ? days : [selectedDay];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Buscar por materia, profesor o aula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 text-base h-12 rounded-lg"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Select value={selectedSemester} onValueChange={(val) => setSelectedSemester(val as Semester | 'todos')}>
                <SelectTrigger className="w-full text-base h-12">
                    <SelectValue placeholder="Seleccionar cuatrimestre" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="todos" className="text-base">Todos</SelectItem>
                    {semesters.map(s => <SelectItem key={s} value={s} className="text-base">{s}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={selectedShift} onValueChange={(val) => setSelectedShift(val as Shift | 'todos')}>
                <SelectTrigger className="w-full text-base h-12">
                    <SelectValue placeholder="Seleccionar turno" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="todos" className="text-base">Todos</SelectItem>
                    {shifts.map(shift => <SelectItem key={shift} value={shift} className="text-base capitalize">{shift}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={(val) => setSelectedYear(val)}>
                <SelectTrigger className="w-full text-base h-12">
                    <SelectValue placeholder="Seleccionar año" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="todos" className="text-base">Todos</SelectItem>
                    {availableYears.map(year => <SelectItem key={year} value={year.toString()} className="text-base">{year}° Año</SelectItem>)}
                </SelectContent>
            </Select>
             <Select value={selectedDay} onValueChange={(val) => setSelectedDay(val as Day | 'todos')}>
                <SelectTrigger className="w-full text-base h-12">
                    <SelectValue placeholder="Seleccionar día" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="todos" className="text-base">Todos</SelectItem>
                    {days.map(day => <SelectItem key={day} value={day} className="text-base capitalize">{day}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
      </div>
      
      {hasAnySubjects ? (
        <div>
            <Card className="overflow-hidden hidden md:block">
                <CardContent className="p-0">
                <Table>
                    <TableHeader>
                    <TableRow className="bg-muted/30">
                        <TableHead className="w-[120px] font-bold text-primary text-sm">Día</TableHead>
                        <TableHead className="font-bold text-primary text-sm">Materias</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {tableDays.map(day => {
                      const subjectsForDay = (subjectsByDay[day] || []).sort((a,b) => shiftOrder[a.turno] - shiftOrder[b.turno]);
                      if (subjectsForDay.length === 0 && selectedDay !== 'todos') return null;

                      return (
                        <TableRow key={day} className="[&_td]:first:font-semibold">
                            <TableCell className="align-top w-[120px]">{day}</TableCell>
                            <TableCell className="align-top p-3">
                                {subjectsForDay.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                                        {subjectsForDay.map((item) => (
                                            <SubjectCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-xs text-muted-foreground italic h-10 flex items-center">-</div>
                                )}
                            </TableCell>
                        </TableRow>
                      )
                    })}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>

            <div className="space-y-4 md:hidden">
              {tableDays.map(day => {
                const subjectsForDay = (subjectsByDay[day] || []).sort((a,b) => shiftOrder[a.turno] - shiftOrder[b.turno]);
                if (subjectsForDay.length === 0) return null;

                return (
                  <Card key={day}>
                    <CardHeader className="p-4 bg-muted/30">
                      <CardTitle className="text-base text-primary font-bold">{day}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      {subjectsForDay.map((item) => (
                        <SubjectCard key={item.id} item={item} />
                      ))}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
        </div>
      ) : (
         <div className="text-center py-10">
           <p className="text-muted-foreground">No se encontraron resultados para los filtros aplicados.</p>
         </div>
       )}
    </div>
  );
}
