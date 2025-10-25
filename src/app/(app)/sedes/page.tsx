import Link from "next/link";
import { Building2, Pencil, PlusCircle } from "lucide-react";
import { getSedes, getEdificios } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AltaSedeModal } from "@/components/modals/sedes/AltaSedeModal";
import { EditarSedeModal } from "@/components/modals/sedes/EditarSedeModal";
import { EliminarSedeModal } from "@/components/modals/sedes/EliminarSedeModal";

export default async function CampusesPage() {
  const sedes = await getSedes();
  const edificios = await getEdificios();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Sedes"
        breadcrumbs={[
          { href: "/dashboard", label: "Home" },
          { href: "/sedes", label: "Sedes" },
        ]}
        action={<AltaSedeModal />}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sedes.map((sede) => {
          const buildingCount = edificios.filter(
            (b) => b.sede_id === sede._id || b.sede_id?._id === sede._id
          ).length;

          console.log(buildingCount);

          return (
            <Card key={sede._id}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Building2 className="size-8 text-accent" />
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <CardTitle className="font-headline">
                        {sede.nombre}
                      </CardTitle>
                      <CardDescription>
                        Dirección: {sede.direccion}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <EliminarSedeModal
                        sedeId={sede._id}
                        sedeNombre={sede.nombre}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Gestione los edificios asociados a esta sede. Actualmente hay{" "}
                  <strong>{buildingCount}</strong> edificio
                  {buildingCount != 1 ? "s" : ""} registrado
                  {buildingCount != 1 ? "s" : ""}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/sedes/${sede._id}`}>Gestionar Edificios</Link>
                </Button>
                <EditarSedeModal
                  sedeId={sede._id}
                  nombreActual={sede.nombre}
                  direccionActual={sede.direccion || ""}
                />
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
