# Lógica de Negocio y Reglas de UI

## Navegación Global
- **Sidebar (Slim):** Navegación principal colapsada a la izquierda. Enlaces a Dashboard, Horario Personal y Personalizados.
- **TopBar:** Barra superior con:
    - Botón de Tema (Claro/Oscuro).
    - Botón de Perfil / Login.
    - Notificaciones (Mock).

## Interfaz Pública (Dashboard)
- **Anuncios:** Banner horizontal superior para comunicaciones importantes (ej. fechas de parciales, inicio de asesorías).
- **Widgets de Resumen (SummaryCards):** Muestra métricas clave como Promedio, Créditos, y Tareas Pendientes.
- **Próxima Clase:** Widget destacado que calcula la siguiente clase basada en la hora actual.
- **Horario de Hoy:** Tabla simplificada mostrando solo las actividades del día corriente.
- **Login:** Modal accesible desde el TopBar. Valida correo contra `CONFIG` y otorga acceso basado en rol.

## Vistas de Calendario (/horario-personal)
- **Login:** Modal sin contraseña, validando contra el CSV de la hoja `CONFIG`. Sesión persistente en `localStorage`. Después del login, redirige a `/horario-personal`.
- **Horario Personal:**
    - Muestra todos los registros de `MATRIZ_FLEXIBLE`.
    - El usuario puede ver todas las asesorías.
    - Se abre por defecto mostrando todos los días.
    - Layout: Pestañas de días + Tabla (Desktop) / Cards (Mobile).
- **Consulta Personalizados:**
    - Accesible para todos los usuarios autenticados.
    - Lista todos los registros donde `Tipo == "Asesoría Personalizada"`.
    - Layout: Pestañas de días + Tabla (Desktop) / Cards (Mobile).

## Integración
- Todo clic en elementos de filtrado desde Google Sites debe redirigir a la URL de Cloudflare Pages con el parámetro de consulta correspondiente, abriéndose siempre en pestaña nueva.