# HorariosQuedate - Sistema de Horarios Académicos

Sistema web de gestión y consulta de horarios de asesorías académicas para el Colegio Mayor de Antioquia, construido con Astro y desplegado en Cloudflare Pages.

## 🎯 Descripción

**HorariosQuedate** es una aplicación web que permite a estudiantes, asesores y psicoeducadores consultar los horarios de asesorías académicas en tiempo real. Los datos se gestionan mediante Google Sheets y se publican automáticamente como CSV, permitiendo actualizaciones sin necesidad de redespliegue.

### Características principales

- 📅 Visualización de horarios por día y área académica
- 🔍 Búsqueda y filtrado avanzado de asesorías
- 🌓 Tema claro/oscuro con persistencia
- 🔐 Sistema de autenticación simple basado en roles
- 📱 Diseño responsive (Desktop y Mobile)
- 🎨 UI moderna con Tailwind CSS v4
- ⚡ Generación estática (SSG) para máximo rendimiento

---

## 🏗️ Tech Stack

- **Framework:** [Astro](https://astro.build) (SSG + Islas de React)
- **Estilos:** Tailwind CSS v4 con variables CSS nativas
- **Despliegue:** Cloudflare Pages
- **Fuente de Datos:** Google Sheets (publicado como CSV)
- **Parsing:** PapaParse (procesamiento CSV en cliente)
- **Testing:** Playwright (E2E tests)

---

## 📁 Arquitectura del Proyecto

Para entender la arquitectura completa del proyecto, consulta la carpeta `/docs`:

- [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md) - Estructura técnica y tech stack
- [`BUSINESS_LOGIC.md`](./docs/BUSINESS_LOGIC.md) - Reglas de negocio y flujos de usuario
- [`DATABASE_SCHEMA.md`](./docs/DATABASE_SCHEMA.md) - Esquema de datos de Google Sheets
- [`UI_STYLE_GUIDE.md`](./docs/UI_STYLE_GUIDE.md) - Sistema de diseño y colores

---

## 🔐 Variables de Entorno

El proyecto requiere las siguientes variables de entorno públicas:

### `PUBLIC_CSV_URL_MATRIZ`
URL del CSV publicado desde Google Sheets (hoja `MATRIZ_FLEXIBLE`).  
Contiene los datos de todas las asesorías académicas.

**Ejemplo:**
```env
PUBLIC_CSV_URL_MATRIZ=https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?gid=0&single=true&output=csv
```

### `PUBLIC_CSV_URL_CONFIG`
URL del CSV publicado desde Google Sheets (hoja `CONFIG`).  
Contiene los datos de usuarios autorizados (correos, roles, nombres).

**Ejemplo:**
```env
PUBLIC_CSV_URL_CONFIG=https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?gid=1&single=true&output=csv
```

### Configuración local

1. Crea un archivo `.env` en la raíz del proyecto
2. Agrega las variables mencionadas arriba
3. Las variables `PUBLIC_*` estarán disponibles en `import.meta.env`

---

## 🚀 Desarrollo Local

### Requisitos previos

- Node.js 18+ 
- npm o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/MarlonMedellin/AppHorario.git
cd AppHorario

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crea un archivo .env con las variables PUBLIC_CSV_URL_*

# Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:4321`

### Comandos disponibles

| Comando | Acción |
|---------|--------|
| `npm install` | Instala dependencias |
| `npm run dev` | Inicia servidor de desarrollo en `localhost:4321` |
| `npm run build` | Genera build de producción en `./dist/` |
| `npm run preview` | Previsualiza el build localmente |
| `npm test` | Ejecuta tests E2E con Playwright |
| `npm run astro ...` | Ejecuta comandos CLI de Astro |

---

## 🌐 Despliegue en Cloudflare Pages

### Configuración inicial

1. **Conecta tu repositorio a Cloudflare Pages:**
   - Ve a [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Selecciona "Pages" → "Create a project"
   - Conecta tu repositorio de GitHub

2. **Configuración del build:**
   ```
   Build command: npm run build
   Build output directory: dist
   Node version: 18
   ```

3. **Variables de entorno:**
   - En Cloudflare Pages → Settings → Environment variables
   - Agrega `PUBLIC_CSV_URL_MATRIZ` y `PUBLIC_CSV_URL_CONFIG`
   - Aplica a "Production" y "Preview"

### Despliegue automático

Cada push a `main` dispara un despliegue automático en Cloudflare Pages.

---

## 🔑 Sistema de Autenticación

El proyecto usa un sistema de autenticación simple basado en:

1. **Validación de correo:** El usuario ingresa su correo electrónico
2. **Verificación contra CSV:** Se valida contra la hoja `CONFIG` de Google Sheets
3. **Sesión en localStorage:** Los datos del usuario se almacenan localmente
4. **Control de acceso por rol:** Algunas vistas requieren roles específicos (Asesor, Psicoeducador, Estudiante)

> **Nota:** Este es un sistema de autenticación básico adecuado para un MVP. No incluye contraseñas ni backend tradicional.

---

## 📂 Estructura del Proyecto

```
/
├── public/              # Archivos estáticos (favicon, imágenes)
├── src/
│   ├── components/      # Componentes Astro y React
│   │   ├── dashboard/   # Componentes del dashboard
│   │   ├── HorarioTable.astro
│   │   ├── AsesoriaCard.astro
│   │   └── LoginModal.astro
│   ├── layouts/         # Layouts principales
│   │   ├── Layout.astro
│   │   └── DashboardLayout.astro
│   ├── pages/           # Rutas de la aplicación
│   │   ├── index.astro  # Dashboard principal
│   │   ├── horario-personal.astro
│   │   └── personalizados.astro
│   ├── services/        # Lógica de negocio
│   │   ├── sheetService.js
│   │   └── authService.js
│   └── styles/          # Estilos globales
├── docs/                # Documentación técnica
├── tests/               # Tests E2E con Playwright
└── package.json
```

---

## 🧪 Testing

El proyecto incluye tests E2E con Playwright:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo UI
npx playwright test --ui

# Ejecutar un test específico
npx playwright test tests/e2e.spec.ts
```

---

## 📄 Licencia

© 2026 Marlon Arcila Vanegas. Todos los derechos reservados.

---

## 🤝 Contribuciones

Para contribuir al proyecto, consulta las guías de estilo en `/docs` y asegúrate de:

1. Seguir el estándar de Conventional Commits
2. Ejecutar tests antes de hacer push
3. Mantener la documentación actualizada

---

## 📞 Contacto

- **GitHub:** [@MarlonMedellin](https://github.com/MarlonMedellin)
- **YouTube:** [@MarlonDavidArcila](https://www.youtube.com/@MarlonDavidArcila)
- **LinkedIn:** [marlon-arcila](https://www.linkedin.com/in/marlon-arcila/)

---

**Construido con ❤️ usando Astro, Tailwind CSS y PowerShell**
