'use client'

import * as React from 'react'
import { Bot, Loader2, Sparkles, Users } from 'lucide-react'

import { runAutoAssignment, type AssignmentResult } from '@/lib/actions'
import type { Program, Classroom } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type EnrichedSection = {
    id: string;
    courseId: string;
    enrolledStudents: number;
    days: string[];
    startTime: string;
    endTime: string;
    desiredResources: string[];
    assignedClassroomId?: string | undefined;
    courseName: string;
    programId: string;
    programName: string;
    assignedClassroomName?: string;
    desiredResourcesNames: string[];
}

type SectionsTableProps = {
  sections: EnrichedSection[]
  programs: Program[]
  classrooms: Classroom[]
}

export function SectionsTable({ sections, programs, classrooms }: SectionsTableProps) {
  const [filter, setFilter] = React.useState('all')
  const [isAssigning, setIsAssigning] = React.useState(false)
  const [assignmentResult, setAssignmentResult] = React.useState<AssignmentResult | null>(null)
  const [isClient, setIsClient] = React.useState(false)

  const { toast } = useToast()

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const handleAutoAssign = async () => {
    setIsAssigning(true)
    setAssignmentResult(null)
    const result = await runAutoAssignment()
    setAssignmentResult(result)
    setIsAssigning(false)
    toast({
        title: result.success ? "Proceso Completado" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
    })
  }
  
  const handleManualAssignment = (sectionId: string, classroomId: string) => {
    console.log(`Manually assigning section ${sectionId} to classroom ${classroomId}`);
    // Here you would call a server action to update the assignment in the DB
    // and show a warning if rules are violated.
    toast({
        title: "Asignación Manual",
        description: `La comisión ${sectionId} fue asignada al aula. En una app real, esto se guardaría.`,
    });
  }

  const filteredSections = sections.filter(
    (s) => filter === 'all' || s.programId === filter
  )

  if (!isClient) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin size-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[280px]">
              <SelectValue placeholder="Filtrar por carrera..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Carreras</SelectItem>
              {programs.map((program) => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAutoAssign} disabled={isAssigning} className="w-full sm:w-auto">
            {isAssigning ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              <Bot className="mr-2" />
            )}
            Auto-Asignar
          </Button>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comisión</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead>Recursos</TableHead>
                <TableHead>Aula Asignada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell>
                    <div className="font-medium">{section.courseName}</div>
                    <div className="text-sm text-muted-foreground">{section.programName}</div>
                    <div className="flex items-center gap-2 mt-1">
                        <Users className="size-4 text-muted-foreground"/>
                        <span className="text-sm">{section.enrolledStudents}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{section.days.join(', ')}</div>
                    <div className="text-sm text-muted-foreground">{section.startTime} - {section.endTime}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                        {section.desiredResourcesNames.map((name, i) => (
                            <Badge key={i} variant="secondary">{name}</Badge>
                        ))}
                         {section.desiredResources.length === 0 && <span className="text-xs text-muted-foreground">Ninguno</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={section.assignedClassroomId}
                      onValueChange={(value) => handleManualAssignment(section.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Asignar aula..." />
                      </SelectTrigger>
                      <SelectContent>
                        {classrooms.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name} ({c.capacity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
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
