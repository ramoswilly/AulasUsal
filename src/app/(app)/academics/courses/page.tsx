
import { getCarreras, getMaterias } from '@/lib/data';
import AcademicsClient from './courses-client';

export default async function AcademicsPage() {
  const carreras = await getCarreras();
  const materias = await getMaterias();

  return <AcademicsClient carreras={carreras} materias={materias} />;
}
