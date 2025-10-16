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

export default function CoursesPage() {
  const programMap = new Map(programs.map(p => [p.id, p.name]));
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Materias"
        breadcrumbs={[
            { href: '/dashboard', label: 'Home' },
            { href: '/academics/courses', label: 'Materias' }
        ]}
        action={
          <Button>
            <PlusCircle className="mr-2" />
            Nueva Materia
          </Button>
        }
      />
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
    </div>
  )
}
