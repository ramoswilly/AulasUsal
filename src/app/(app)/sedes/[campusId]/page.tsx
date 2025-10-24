import Link from "next/link";
import {
  Building,
  Factory,
  School,
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
import { NuevoEdificioModal } from "@/components/modals/NuevoEdificioModal";
import { log } from "console";

function getBuildingIcon(tipo: string) {
  switch (tipo) {
    case "Tecnológico":
      return <Factory className="h-5 w-5 text-muted-foreground" />;
    case "Carrera":
      return <School className="h-5 w-5 text-muted-foreground" />;
    case "Laboratorio":
      return <FlaskConical className="h-5 w-5 text-muted-foreground" />;
    case "Veterinaria":
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

  const campus = await getSedeById(campusId);
  if (!campus) return <div className="p-8">Sede no encontrada.</div>;

  const campusBuildings = await getEdificiosBySede(campusId);
  const allAulas = await getAulas();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={campus.nombre}
        breadcrumbs={[
          { href: "/dashboard", label: "Home" },
          { href: "/sedes", label: "Sedes" },
          { href: `/sedes/${campus._id}`, label: campus.nombre },
        ]}
        action={<NuevoEdificioModal campusId={campus._id} />}
      />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Aulas</TableHead>
              <TableHead className="w-[50px]"></TableHead>
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
                    <Badge variant="secondary">{building.tipo}</Badge>
                  </TableCell>

                  <TableCell className="text-right">{classroomCount}</TableCell>

                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link
                        href={`/sedes/${campus._id}/buildings/${building._id}`}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Link>
                    </Button>
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
