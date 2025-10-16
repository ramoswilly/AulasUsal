# **App Name**: AulaSync

## Core Features:

- Infrastructure Management: Enable CRUD operations for managing the entire physical infrastructure: Campuses, Buildings (with labels), and Classrooms (with capacity and resource list).
- Academic Data Management: Enable CRUD operations for managing academic entities: Programs, Courses, and Sections. Key feature: When creating or editing a section, specify a list of 'desired resources'.
- Section Management: Provide a dedicated section for managing sections, filterable by Program for easy navigation. Include a visible 'Auto-Assign' button.
- Automated Assignment Tool: Implement an algorithm, to auto assign classrooms. It adheres to these rules: schedule availability, resource availability, and shared room capacity management. After assignment process is complete, show admin assignment sucess, or failure with possible cause. 
- Manual Assignment Management: Allow the admin to manually override any auto assignment. Warn the admin if rules are being violated.

## Style Guidelines:

- Primary color: Soft blue (#A0CFEC), to promote trust, productivity and organization
- Background color: Light gray (#F0F4F7), offering a neutral backdrop
- Accent color: Muted teal (#70A1A1) to provide clear affordances while retaining a professional style
- Headline font: 'Space Grotesk' sans-serif. Body font: 'Inter' sans-serif
- Use distinct icons for campuses, buildings, and classrooms.
- Implement a hierarchical navigation: Campuses -> Buildings -> Classrooms.