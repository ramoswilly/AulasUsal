import Link from 'next/link'
import {
  ArrowRight,
  BookMarked,
  Building,
  Building2,
  DoorOpen,
  Users,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import { getSedes, getEdificios, getAulas, getCarreras, getComisiones } from '@/lib/data'

export default async function DashboardPage() {

  const [sedes, edificios, aulas, carreras, comisiones] = await Promise.all([
    getSedes(),
    getEdificios(),
    getAulas(),
    getCarreras(),
    getComisiones(),
  ]);

  const stats = [
    {
      title: 'Sedes',
      value: sedes.length,
      icon: <Building2 className="size-5 text-muted-foreground" />,
      href: '/campuses'
    },
    {
      title: 'Edificios',
      value: edificios.length,
      icon: <Building className="size-5 text-muted-foreground" />,
      href: '/campuses'
    },
    {
      title: 'Aulas',
      value: aulas.length,
      icon: <DoorOpen className="size-5 text-muted-foreground" />,
      href: '/campuses'
    },
    {
      title: 'Carreras',
      value: carreras.length,
      icon: <BookMarked className="size-5 text-muted-foreground" />,
      href: '/academics/courses'
    },
    {
      title: 'Comisiones',
      value: comisiones.length,
      icon: <Users className="size-5 text-muted-foreground" />,
      href: '/academics/sections'
    },
  ]
  
  const unassignedSections = comisiones.filter(c => !c.asignacion?.aula_id).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader title="Bienvenido a Aulas USAL" breadcrumbs={[{ href: '/dashboard', label: 'Home' }]} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Asignación Automática</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Actualmente hay <span className="font-bold text-foreground">{unassignedSections}</span> comisiones sin aula asignada. Utilice la herramienta de auto-asignación para optimizar el uso de los recursos.
            </p>
            <Button asChild>
              <Link href="/academics/schedule">
                Ir a Asignación <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Infraestructura</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Añada, edite o elimine sedes, edificios y aulas para mantener su información actualizada.
            </p>
            <Button asChild variant="secondary">
              <Link href="/sedes">
                Gestionar Infraestructura <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}