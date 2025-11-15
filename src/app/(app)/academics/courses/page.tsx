import {
  getAulas,
  getCarreras,
  getComisiones,
  getMaterias,
  getSedes,
} from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, BookCopy, GraduationCap } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { log } from "console";
import { AltaCarreraModal } from "@/components/modals/academico/AltaCarrerra";
import { AltaMateriaModal } from "@/components/modals/academico/AltaMateriaModal";
import { AltaComisionModal } from "@/components/modals/academico/AltaComisiones";

export default async function AcademicsPage() {
  const carreras = await getCarreras();
  const materias = await getMaterias();
  const comisiones = await getComisiones();
  const sedes = await getSedes();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Gestión Académica"
        breadcrumbs={[
          { href: "/dashboard", label: "Home" },
          { href: "/academics/courses", label: "Académico" },
        ]}
      />

      <Tabs defaultValue="carreras">
        <div className="flex flex-col justify-between">
          <div className="flex justify-between">
            <TabsList>
              <TabsTrigger value="carreras">
                <GraduationCap className="mr-2" />
                Carreras
              </TabsTrigger>
              <TabsTrigger value="materias">
                <BookCopy className="mr-2" />
                Materias
              </TabsTrigger>
              <TabsTrigger value="comisiones">
                <BookCopy className="mr-2" />
                Comisiones
              </TabsTrigger>
            </TabsList>

            <AltaCarreraModal sedes={sedes} />
            <AltaMateriaModal carreras={carreras} />
            <AltaComisionModal sedes={sedes} />
          </div>
          <TabsContent value="carreras">
            <TablaCarreras carreras={carreras} />
          </TabsContent>
          <TabsContent value="materias">
            <TablaMaterias materias={materias} />
          </TabsContent>
          <TabsContent value="comisiones">
            <TablaComisiones comisiones={comisiones} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function TablaCarreras({ carreras }: { carreras: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Carrera</TableHead>
          <TableHead>Código</TableHead>
          <TableHead>Años</TableHead>
          <TableHead>C. Materias</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {carreras.map((c) => (
          <TableRow key={c._id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Book className="size-4 text-muted-foreground" />
                <span className="font-medium">{c.nombre_carrera}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <span>{c.codigo_carrera}</span>
              </div>
            </TableCell>
            <TableCell>
              <span>{c.anios}</span>
            </TableCell>
            <TableCell>
              <span>{"TBD"}</span>
            </TableCell>
            <TableCell className="flex gap-2 justify-end">
              <p>Acciones</p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function TablaMaterias({ materias }: { materias: any[] }) {
  console.log(materias);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Materia</TableHead>
          <TableHead>Código</TableHead>
          <TableHead>C. Carrera</TableHead>
          <TableHead>Año</TableHead>
          <TableHead>Cuatrimestre</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {materias.map((c) => (
          <TableRow key={c._id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Book className="size-4 text-muted-foreground" />
                <span className="font-medium">{c.nombre_materia}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <span>{c.codigo_materia}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <span>{c.carrera_id.codigo_carrera}</span>
              </div>
            </TableCell>
            <TableCell>
              <span>{c.anio_carrera}</span>
            </TableCell>
            <TableCell>
              <span>{c.cuatrimestre}</span>
            </TableCell>
            <TableCell className="flex gap-2 justify-end">
              <p>Acciones</p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function TablaComisiones({ comisiones }: { comisiones: any[] }) {
  console.log(comisiones);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Carrera</TableHead>
          <TableHead>Código</TableHead>
          <TableHead>Años</TableHead>
          <TableHead>C. Materias</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {comisiones.map((c) => (
          <TableRow key={c._id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Book className="size-4 text-muted-foreground" />
                <span className="font-medium">{c.nombre_carrera}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <span>{c.codigo_carrera}</span>
              </div>
            </TableCell>
            <TableCell>
              <span>{c.anios}</span>
            </TableCell>
            <TableCell>
              <span>{"TBD"}</span>
            </TableCell>
            <TableCell className="flex gap-2 justify-end">
              <p>Acciones</p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
