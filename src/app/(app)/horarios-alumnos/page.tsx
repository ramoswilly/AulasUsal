import { SelectionForm } from "@/components/alumnos/selection-form";
import { getSedes, getCarreras } from "@/lib/data";

export default async function SelectSchedulePage() {
  const sedes = await getSedes();
  const allCareers = await getCarreras();

  return (
    <main className="container mx-auto flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
            Consulta de Horarios
          </h1>
          <p className="mt-2 text-muted-foreground">
            Selecciona tu sede y carrera para ver los horarios de cursada.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <SelectionForm sedes={sedes} allCareers={allCareers} />
        </div>
      </div>
    </main>
  );
}
