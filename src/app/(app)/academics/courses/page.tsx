import { PlusCircle } from 'lucide-react'
import { courses, programs } from '@/lib/data'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
    Card,
    CardContent,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function ProgramsTable() {
    const courseCountMap = courses.reduce((acc, course) => {
        acc.set(course.programId, (acc.get(course.programId) || 0) + 1);
        return acc;
    }, new Map<string, number>());

    return (
        <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre de la Carrera</TableHead>
                <TableHead className="text-right">Materias</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.name}</TableCell>
                    <TableCell className="text-right">{courseCountMap.get(program.id) || 0}</TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
}

function CoursesTable() {
    const programMap = new Map(programs.map(p => [p.id, p.name]));
    return (
        <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre de la Materia</TableHead>
                <TableHead>Carrera</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{programMap.get(course.programId) || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
}


export default function AcademicsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Académico"
        breadcrumbs={[
            { href: '/dashboard', label: 'Home' },
            { href: '/academics/courses', label: 'Académico' }
        ]}
      />
      <Tabs defaultValue="programs">
        <div className="flex justify-between items-center mb-4">
            <TabsList>
                <TabsTrigger value="programs">Carreras</TabsTrigger>
                <TabsTrigger value="courses">Materias</TabsTrigger>
            </TabsList>
            <Button>
                <PlusCircle className="mr-2" />
                Añadir Nuevo
            </Button>
        </div>
        <TabsContent value="programs">
          <ProgramsTable />
        </TabsContent>
        <TabsContent value="courses">
          <CoursesTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
