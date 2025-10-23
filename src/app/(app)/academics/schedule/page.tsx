import { getAulas, getMaterias, getCarreras, getComisiones } from '@/lib/data'
import { ScheduleClient } from './schedule-client'

export default async function SchedulePage() {
  const courses = await getMaterias();
  const programs = await getCarreras();
  const allSections = await getComisiones();
  const classrooms = await getAulas();

  return <ScheduleClient courses={courses} programs={programs} allSections={allSections} classrooms={classrooms} />
}