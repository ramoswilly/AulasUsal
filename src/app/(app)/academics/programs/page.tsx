import { PlusCircle } from 'lucide-react'
import { programs, courses } from '@/lib/data'
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

export default function ProgramsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Carreras"
        breadcrumbs={[
            { href: '/dashboard', label: 'Home' },
            { href: '/academics/programs', label: 'Carreras' }
        ]}
        action={
          <Button>
            <PlusCircle className="mr-2" />
            Nueva Carrera
          </Button>
        }
      />
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
              {programs.map((program) => {
                const courseCount = courses.filter(c => c.programId === program.id).length;
                return (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.name}</TableCell>
                    <TableCell className="text-right">{courseCount}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
