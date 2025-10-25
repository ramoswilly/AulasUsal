import { PlusCircle } from "lucide-react";
import { getCarreras, getMaterias } from "@/lib/data";
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
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CarrerasTable({ carreras, materias }) {
  const courseCountMap = materias.reduce((acc, materia) => {
    const carreraId = materia.carrera_id._id;
    acc.set(carreraId, (acc.get(carreraId) || 0) + 1);
    return acc;
  }, new Map<string, number>());

  return (
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
            {carreras.map((carrera) => (
              <TableRow key={carrera._id}>
                <TableCell className="font-medium">
                  {carrera.nombre_carrera}
                </TableCell>
                <TableCell className="text-right">
                  {courseCountMap.get(carrera._id) || 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function MateriasTable({ materias }) {
  return (
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
            {materias.map((materia) => (
              <TableRow key={materia._id}>
                <TableCell className="font-medium">
                  {materia.nombre_materia}
                </TableCell>
                <TableCell>
                  {materia.carrera_id?.nombre_carrera || "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default async function AcademicsPage() {
  const carreras = await getCarreras();
  const materias = await getMaterias();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Académico"
        breadcrumbs={[
          { href: "/dashboard", label: "Home" },
          { href: "/academics/courses", label: "Académico" },
        ]}
      />
      <Tabs defaultValue="programs">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="programs">Carreras</TabsTrigger>
            <TabsTrigger value="courses">Materias</TabsTrigger>
          </TabsList>
          <Button>
            <PlusCircle className="mr-2" />
            Añadir Nuevo
          </Button>
        </div>
        <TabsContent value="programs">
          <CarrerasTable carreras={carreras} materias={materias} />
        </TabsContent>
        <TabsContent value="courses">
          <MateriasTable materias={materias} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
