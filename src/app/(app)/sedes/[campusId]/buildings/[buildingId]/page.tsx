import { DoorOpen, PlusCircle, Users } from "lucide-react";

import { getSedeById, getEdificioById, getAulasByEdificio } from "@/lib/data";
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
import { AltaAulaModal } from "@/components/modals/sedes/AltaAulaModal";
import { EliminarAulaModal } from "@/components/modals/sedes/EliminarAulaModal";
import { EditarAulaModal } from "@/components/modals/sedes/EditarAulaModal";

export default async function BuildingDetailPage({
  params,
}: {
  params: { campusId: string; buildingId: string };
}) {
  const campus = await getSedeById(params.campusId);
  const building = await getEdificioById(params.buildingId);
  if (!campus || !building)
    return <div className="p-8">Edificio no encontrado.</div>;

  const buildingClassrooms = await getAulasByEdificio(params.buildingId);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={building.nombre}
        breadcrumbs={[
          { href: "/dashboard", label: "Home" },
          { href: "/sedes", label: "Sedes" },
          { href: `/sedes/${campus._id}`, label: campus.nombre },
          {
            href: `/sedes/${campus._id}/buildings/${building._id}`,
            label: building.nombre,
          },
        ]}
        action={<AltaAulaModal edificioId={building._id} />}
      />
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aula</TableHead>
              <TableHead>Capacidad</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buildingClassrooms.map((classroom) => (
              <TableRow key={classroom._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <DoorOpen className="size-5 text-muted-foreground" />
                    <span className="font-medium">
                      {classroom.nombre_o_numero}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    <span>{classroom.capacidad}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {classroom.tipo_aula}
                  </span>
                </TableCell>

                <TableCell className="flex gap-2 justify-end">
                  <EditarAulaModal
                    aulaId={classroom._id}
                    currentNombre={classroom.nombre_o_numero}
                    currentTipo={classroom.tipo_aula}
                    currentCapacidad={classroom.capacidad}
                    currentRecursos={classroom.recursos}
                  />
                  <EliminarAulaModal
                    aulaId={classroom._id}
                    aulaNombre={classroom.nombre_o_numero}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
