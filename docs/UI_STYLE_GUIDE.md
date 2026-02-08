# Guía de Estilo y UI: HorariosQuedate

## Tipografía
- **Fuente Principal:** 'Inter' o 'Geist Sans' (vía @fontsource/inter).
- **Características:** Sans-serif, limpia, optimizada para legibilidad en pantallas con datos densos.

## Sistema de Colores (Variables CSS)
El sistema utiliza variables CSS nativas para soportar temas Claro/Oscuro dinámicamente.

### Paleta Principal
| Variable | Descripción | Valor (Claro) | Valor (Oscuro) |
| :--- | :--- | :--- | :--- |
| `--color-brand` | Color principal (Sidebar, Botones) | #2563EB (Blue-600) | #1E40AF (Blue-800) |
| `--color-brand-accent` | Acentos y hovers | #60A5FA (Blue-400) | #93C5FD (Blue-300) |
| `--color-bg-app` | Fondo general | #F8FAFC (Slate-50) | #0F172A (Slate-900) |
| `--color-bg-card` | Fondo de tarjetas/paneles | #FFFFFF | #1E293B (Slate-800) |
| `--color-text-main` | Texto principal | #1E293B | #F1F5F9 |
| `--color-border` | Bordes sutiles | #E2E8F0 | #334155 |

### Componentes UI
- **Glassmorphism:** Uso de `bg-white/10` y `backdrop-blur` en elementos sobre fondos brand.
- **Sombras:** `shadow-sm` para tarjetas, `shadow-xl` para sidebar.
- **Radios:** `rounded-2xl` para contenedores principales, `rounded-xl` para elementos internos.

### Colores de Texto
| Elemento | Modo Claro | Modo Oscuro |
| :--- | :--- | :--- |
| Título Asignatura | #0F172A (Slate-900) | #F8F9FA (Slate-50) |
| Detalles (Asesor/Hora) | #475569 (Slate-600) | #94A3B8 (Slate-400) |

### Identidad por Área (Border-Left 4px)
- **Matemáticas:** Claro #1A73E8 | Oscuro #60A5FA
- **Cálculos:** Claro #188038 | Oscuro #4ADE80
- **Físicas:** Claro #A142F4 | Oscuro #C084FC
- **Estadísticas:** Claro #F9AB00 | Oscuro #FBBF24
- **Químicas:** Claro #E37400 | Oscuro #FB923C
- **Internas/Otros:** Claro #64748B | Oscuro #94A3B8

### Estados de Card
- **Cancelado:** Fondo suave rojo (bg-red-50/dark:bg-red-900/20), texto rojo (text-red-600), badge "Cancelado".
- **Interno:** Estilo atenuado (opacity-60), etiqueta "Solo Interno".