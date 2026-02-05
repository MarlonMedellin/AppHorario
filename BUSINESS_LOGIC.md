# Reglas de Negocio y UI

## Filtros Excluyentes (Barra Lateral)
- Al seleccionar un **Área**, la lista de **Asesores** y **Sedes** en el filtro debe actualizarse para mostrar solo aquellos que tienen registros activos en esa área.

## Visualización de Horarios
- **Detección de Tiempo:** Se usa la hora y el día del dispositivo del usuario.
- **Día Actual:** En las vistas personales, el sistema debe mostrar por defecto el día actual del dispositivo, permitiendo navegar entre los otros 5 días (Lunes-Sábado).
- **Estado de Registros:**
    - `Activo`: Se muestra normalmente.
    - `Interno`: Solo visible para usuarios logueados (Asesores/Psicoeducadores).
    - `Cancelado`: Se muestra con estilo de advertencia (rojo) y el botón de unión desactivado.

## Componente Card
- **Diseño:** Borde izquierdo de color dinámico según el **Área** (ej. Matemáticas: Azul, Química: Verde).
- **Acción Principal:** Botón "Unirme" grande y destacado para modalidades Virtuales (Meet, Teams, WhatsApp).
- **Comportamiento:** Cada Card abierta desde filtros externos (Google Sites) debe abrirse en una pestaña nueva apuntando al `index` con parámetros de búsqueda.

## Autenticación
- Persistencia en `localStorage`.
- Si el usuario no está en el CSV de `USUARIOS`, se deniega el acceso.
- Los perfiles definen la visibilidad de las rutas internas.