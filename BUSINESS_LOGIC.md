# Lógica de Negocio y Reglas de UI

## Navegación Global
- **Header/Navbar:** Común en todas las páginas con logo "Quedate en Colmayor" y navegación entre páginas.
- **Subtítulo fijo:** "h2-Ingreso permanente y graduación".
- **Tema:** Botón para cambiar entre tema claro/oscuro.
- **Responsive:** En móvil, la barra lateral se convierte en menú hamburguesa.


## Interfaz Pública (Index)
- **Barra Lateral:** Filtros excluyentes. Si el usuario filtra por "Sede: Robledo", las listas de "Áreas" y "Asesores" solo mostrarán opciones disponibles para esa sede.
- **Caja de Búsqueda:** Búsqueda por texto libre en todos los campos (Asesor, Asignatura, Sede).
- **Pestañas de Días:** Filtran automáticamente por el día seleccionado. Por defecto muestra el día actual del dispositivo.
- **Visualización de Datos:**
    - **Desktop:** Tabla con columnas (Día, Hora, Asignatura, Asesor, Ubicación, Sede, Modalidad).
    - **Mobile:** Cards apiladas con la mejor práctica de diseño responsivo.
    - Borde lateral izquierdo coloreado según el campo **Area**.
    - Enlace "Unirme" visible solo si la modalidad es Virtual o WhatsApp.
    - Si el `Estado` es "Cancelado", la fila se muestra tachada con texto "Cancelado".
    - Si el `Estado` es "Interno", muestra indicador visual y texto: "Este horario es para contratistas/docentes y no debe ser compartido con estudiantes".

## Vistas Privadas (Auth simple)
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