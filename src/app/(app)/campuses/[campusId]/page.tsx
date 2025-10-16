import Link from 'next/link'
import { Building, Factory, PlusCircle, School, ChevronsRight, FlaskConical, Stethoscope } from 'lucide-react'
import { buildings, campuses, classrooms } from '@/lib/data'
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

function getBuildingIcon(label: string) {
    switch (label) {
        case 'Centro Tecnológico': return <Factory className="size-5 text-muted-foreground" />;
        case 'Edificio de Carrera': return <School className="size-5 text-muted-foreground" />;
        case 'Laboratorio': return <FlaskConical className="size-5 text-muted-foreground" />;
        case 'Edificio veterinario': return <Stethoscope className="size-5 text-muted-foreground" />;
        default: return <Building className="size-5 text-muted-foreground" />;
    }
}

export default function CampusDetailPage({ params }: { params: { campusId: string } }) {
  const campus = campuses.find((c) => c.id === params.campusId)
  if (!campus) return <div className="p-8">Sede no encontrada.</div>

  const campusBuildings = buildings.filter((b) => b.campusId === campus.id)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={campus.name}
        breadcrumbs={[
          { href: '/dashboard', label: 'Home' },
          { href: '/campuses', label: 'Infraestructura' },
          { href: `/campuses/${campus.id}`, label: campus.name },
        ]}
        action={
          <Button>
            <PlusCircle className="mr-2" />
            Nuevo Edificio
          </Button>
        }
      />
      <div className="border rounded-lg">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Etiqueta</TableHead>
                    <TableHead className="text-right">Aulas</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {campusBuildings.map((building) => {
                    const classroomCount = classrooms.filter(c => c.buildingId === building.id).length;
                    return (
                        <TableRow key={building.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    {getBuildingIcon(building.label)}
                                    <span className="font-medium">{building.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary">{building.label}</Badge>
                            </TableCell>
                            <TableCell className="text-right">{classroomCount}</TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/campuses/${campus.id}/buildings/${building.id}`}>
                                        <ChevronsRight className="size-4" />
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
      </div>
    </div>
  )
}
