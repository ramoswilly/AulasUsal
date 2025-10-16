import { DoorOpen, PlusCircle, Users } from 'lucide-react'

import { buildings, campuses, classrooms, resources } from '@/lib/data'
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
import { Badge } from '@/components/ui/badge'

export default function BuildingDetailPage({ params }: { params: { campusId: string; buildingId: string } }) {
  const campus = campuses.find((c) => c.id === params.campusId)
  const building = buildings.find((b) => b.id === params.buildingId)
  if (!campus || !building) return <div className="p-8">Edificio no encontrado.</div>

  const buildingClassrooms = classrooms.filter((c) => c.buildingId === building.id)
  const resourceMap = new Map(resources.map(r => [r.id, r.name]));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={building.name}
        breadcrumbs={[
          { href: '/dashboard', label: 'Home' },
          { href: '/campuses', label: 'Infraestructura' },
          { href: `/campuses/${campus.id}`, label: campus.name },
          { href: `/campuses/${campus.id}/buildings/${building.id}`, label: building.name },
        ]}
        action={
          <Button>
            <PlusCircle className="mr-2" />
            Nueva Aula
          </Button>
        }
      />
      <div className="border rounded-lg">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Aula</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead>Recursos</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {buildingClassrooms.map((classroom) => (
                    <TableRow key={classroom.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <DoorOpen className="size-5 text-muted-foreground" />
                                <span className="font-medium">{classroom.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Users className="size-4 text-muted-foreground" />
                                <span>{classroom.capacity}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-wrap gap-1">
                                {classroom.resources.map(resId => (
                                    <Badge key={resId} variant="outline">{resourceMap.get(resId) || 'N/A'}</Badge>
                                ))}
                                {classroom.resources.length === 0 && <span className="text-xs text-muted-foreground">Ninguno</span>}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </div>
    </div>
  )
}
