import { getComisiones, getCarreras, getAulas } from '@/lib/data';
import { ScheduleTable } from './schedule-table'; // Asumiendo que el componente se llama así

export default async function SchedulePage() {
  const comisiones = await getComisiones();
  const carreras = await getCarreras();
  const aulas = await getAulas();

  return (
    <ScheduleTable 
      initialSections={comisiones}
      initialPrograms={carreras}
      initialClassrooms={aulas}
    />
  );
}