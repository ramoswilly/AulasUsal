import { getComisiones, getCarreras, getAulas } from '@/lib/data'
import { PageHeader } from '@/components/page-header'
import { SectionsTable } from './sections-table'

export default async function SectionsPage() {
  // Fetch all necessary data directly from the database.
  // The 'populate' in the data functions handles the enrichment automatically.
  const comisiones = await getComisiones();
  const carreras = await getCarreras();
  const aulas = await getAulas();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Comisiones y Asignación"
        breadcrumbs={[
            { href: '/dashboard', label: 'Home' },
            { href: '/academics/sections', label: 'Comisiones' }
        ]}
      />
      <SectionsTable 
        sections={comisiones}
        programs={carreras}      // Renamed from programs to carreras
        classrooms={aulas}
      />
    </div>
  )
}