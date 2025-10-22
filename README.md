# <g-emoji>🏫</g-emoji> AulasUsal - Sistema de Gestión de Aulas

¡Bienvenido a AulasUsal! Una aplicación web moderna para la gestión y asignación inteligente de aulas universitarias, diseñada para optimizar el uso de los espacios académicos.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.x-black?logo=next.js&style=for-the-badge" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-18-blue?logo=react&style=for-the-badge" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&style=for-the-badge" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-blueviolet?logo=tailwind-css&style=for-the-badge" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Google_AI-Genkit-orange?logo=google-cloud&style=for-the-badge" alt="Genkit"/>
</p>

## ✨ Características Principales

- **<g-emoji>📊</g-emoji> Dashboard Intuitivo**: Visualiza métricas clave y el estado actual de la ocupación de aulas de un vistazo.
- **<g-emoji>🏢</g-emoji> Gestión Jerárquica**: Administra fácilmente Campus, Edificios y Aulas con sus capacidades y equipamiento.
- **<g-emoji>📚</g-emoji> Planificación Académica**: Organiza Asignaturas, Comisiones y Profesores para cada ciclo lectivo.
- **<g-emoji>🤖</g-emoji> Asignación Inteligente**: Utiliza flujos de IA con **Google Genkit** para asignar aulas automáticamente basándose en la capacidad y los requisitos.
- **<g-emoji>📅</g-emoji> Calendario y Horarios**: Consulta la disponibilidad y los horarios de cada aula en una interfaz clara.
- **<g-emoji>🎨</g-emoji> Diseño Moderno y Adaptable**: Interfaz creada con **Shadcn/UI** y **Tailwind CSS** para una experiencia de usuario excepcional en cualquier dispositivo.

## 🚀 Empezando

Sigue estos pasos para levantar el proyecto en tu entorno local.

### Prerrequisitos

- [Node.js](https://nodejs.org/en/) (versión 20.x o superior)
- [pnpm](https://pnpm.io/installation) (o puedes usar `npm` / `yarn`)
- Una base de datos MongoDB (puedes obtener una gratis en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register))

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/ramoswilly/AulasUsal.git
    cd AulasUsal
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto y añade la URI de conexión a tu base de datos.
    ```env
    # .env.local
    MONGODB_URI="mongodb+srv://<user>:<password>@<cluster-url>/<db-name>?retryWrites=true&w=majority"
    ```

4.  **Inicia el servidor de desarrollo:**
    La aplicación estará disponible en `http://localhost:9002`.
    ```bash
    npm run dev
    ```

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos**: [MongoDB](https://www.mongodb.com/) con [Mongoose](https://mongoosejs.com/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI**: [Shadcn/UI](https://ui.shadcn.com/)
- **IA**: [Google AI - Genkit](https://firebase.google.com/docs/genkit)
- **Validación**: [Zod](https://zod.dev/)
- **Formularios**: [React Hook Form](https://react-hook-form.com/)

## 📜 Scripts Disponibles

Dentro del `package.json` encontrarás varios scripts útiles:

- `npm run dev`: Inicia la aplicación en modo desarrollo con Turbopack.
- `npm run build`: Compila la aplicación para producción.
- `npm run start`: Inicia la aplicación en modo producción.
- `npm run lint`: Ejecuta el linter de Next.js para verificar el código.
- `npm run typecheck`: Comprueba los tipos de TypeScript en todo el proyecto.
- `npm run genkit:dev`: Inicia el servidor de desarrollo de Genkit para los flujos de IA.

## 📁 Estructura del Proyecto

```
AulasUsal/
├── src/
│   ├── app/         # Rutas, páginas y layouts (React Server Components)
│   ├── components/  # Componentes de UI reutilizables
│   ├── lib/         # Funciones de utilidad (conexión a BD, etc.)
│   ├── ai/          # Flujos de IA con Genkit
│   └── models/      # Esquemas y modelos de Mongoose (a crear)
├── .env.local       # Variables de entorno (privadas)
├── next.config.ts   # Configuración de Next.js
└── package.json     # Dependencias y scripts
```

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar la aplicación, no dudes en abrir un *issue* o enviar un *pull request*.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.