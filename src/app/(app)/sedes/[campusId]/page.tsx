import Link from "next/link";
import {
  Building,
  Factory,
  FlaskConical,
  Stethoscope,
  ChevronsRight,
} from "lucide-react";
import { getSedeById, getEdificiosBySede, getAulas } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AltaEdificioModal } from "@/components/modals/sedes/AltaEdificioModal";
import { EditarEdificioModal } from "@/components/modals/sedes/EditarEdificioModal";
import { EliminarEdificioModal } from "@/components/modals/sedes/EliminarEdificioModal";

export function getBuildingIcon(tipo: string) {
  switch (tipo) {
    case "Centro Tecnológico":
      return <Factory className="h-5 w-5 text-muted-foreground" />;
    case "Laboratorio":
      return <FlaskConical className="h-5 w-5 text-muted-foreground" />;
    case "Edificio veterinario":
      return <Stethoscope className="h-5 w-5 text-muted-foreground" />;
    default:
      return <Building className="h-5 w-5 text-muted-foreground" />;
  }
}

export default async function CampusDetailPage({
  params,
}: {
  params: { campusId: string };
}) {
  const { campusId } = await params;

  const sede = await getSedeById(campusId);
  if (!sede) return <div className="p-8">Sede no encontrada.</div>;

  const campusBuildings = await getEdificiosBySede(campusId);
  const allAulas = await getAulas();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={sede.nombre}
        breadcrumbs={[
          { href: "/dashboard", label: "Home" },
          { href: "/sedes", label: "Sedes" },
          { href: `/sedes/${sede._id}`, label: sede.nombre },
        ]}
        action={<AltaEdificioModal campusId={sede._id} />}
      />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Aulas</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {campusBuildings.map((building) => {
              const classroomCount = allAulas.filter(
                (c) =>
                  c.edificio_id?._id === building._id ||
                  c.edificio_id === building._id
              ).length;

              return (
                <TableRow key={building._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getBuildingIcon(building.tipo)}
                      <span className="font-medium">{building.nombre}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="default">{building.tipo}</Badge>
                  </TableCell>

                  <TableCell>{classroomCount}</TableCell>

                  <TableCell className="flex gap-2 justify-end">
                    <EditarEdificioModal
                      buildingId={building._id}
                      campusId={sede._id}
                      currentNombre={building.nombre}
                      currentTipo={building.tipo}
                    />

                    <Button asChild>
                      <Link
                        href={`/sedes/${sede._id}/buildings/${building._id}`}
                      >
                        Ver aulas
                        <ChevronsRight className="h-4 w-4" />
                      </Link>
                    </Button>

                    <EliminarEdificioModal
                      buildingId={building._id}
                      buildingNombre={building.nombre}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
