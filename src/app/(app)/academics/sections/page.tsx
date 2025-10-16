import { sections, courses, programs, classrooms, resources } from '@/lib/data'
import { PageHeader } from '@/components/page-header'
import { SectionsTable } from './sections-table'

export default function SectionsPage() {

  const courseMap = new Map(courses.map(c => [c.id, c.name]));
  const programMap = new Map(programs.map(p => [p.id, p.name]));
  const classroomMap = new Map(classrooms.map(c => [c.id, c.name]));
  const resourceMap = new Map(resources.map(r => [r.id, r.name]));

  const enrichedSections = sections.map(section => {
    const course = courses.find(c => c.id === section.courseId);
    return {
      ...section,
      courseName: course?.name || 'N/A',
      programId: course?.programId || 'N/A',
      programName: programMap.get(course?.programId || '') || 'N/A',
      assignedClassroomName: classroomMap.get(section.assignedClassroomId || ''),
      desiredResourcesNames: section.desiredResources.map(id => resourceMap.get(id) || 'N/A'),
    }
  });

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
        sections={enrichedSections} 
        programs={programs}
        classrooms={classrooms}
      />
    </div>
  )
}
