import { ScheduleDisplay } from '@/components/alumnos/schedule-display';
import { getCareerById, getSedeById, getComisionesPorCarrera } from '@/lib/data';

export default async function SchedulePage({ 
  params
}: { 
  params: { careerId: string };
}) {
  const { careerId } = params;
  
  const career = await getCareerById(careerId);
  
  if (!career) {
    return <div>Carrera no encontrada</div>;
  }
  
  const comisiones = await getComisionesPorCarrera(careerId);

  // TODO: Handle multiple sedes. For now, using the first one.
  const sedeId = career.sede_ids[0]; 
  const sede = sedeId ? await getSedeById(sedeId.toString()) : null;

  const universityName = "Universidad del Salvador";

  return (
    <div className="container mx-auto">
      <div className="mb-6 border-b pb-4 text-center md:text-left">
        <p className="text-lg font-semibold text-primary">{universityName} - Sede {sede?.nombre}</p>
        <h1 className="text-2xl font-bold tracking-tight md:text-4xl font-headline">{career.nombre_carrera}</h1>
      </div>

      <ScheduleDisplay scheduleData={comisiones} params={params} />
    </div>
  );
}
