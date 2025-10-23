import Link from 'next/link'
import { Building2, PlusCircle } from 'lucide-react'

import { getSedes, getEdificios } from '@/lib/data'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default async function CampusesPage() {
  const sedes = await getSedes();
  const edificios = await getEdificios();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Infraestructura"
        breadcrumbs={[{ href: '/dashboard', label: 'Home' }, { href: '/campuses', label: 'Infraestructura' }]}
        action={
          <Button>
            <PlusCircle className="mr-2" />
            Nueva Sede
          </Button>
        }
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sedes.map((campus) => {
          const buildingCount = edificios.filter(b => b.sede_id._id === campus._id).length;
          return (
            <Card key={campus._id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Building2 className="size-8 text-accent" />
                    <div>
                      <CardTitle className="font-headline">{campus.nombre}</CardTitle>
                      <CardDescription>{buildingCount} {buildingCount === 1 ? 'edificio' : 'edificios'}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Gestione los edificios y aulas de la {campus.nombre}.
                  </p>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full" variant="outline">
                        <Link href={`/campuses/${campus._id}`}>
                            Ver Edificios
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}