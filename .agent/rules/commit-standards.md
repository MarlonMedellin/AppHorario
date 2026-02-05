---
trigger: always_on
---

# Conventional Commit Standards

**Actúa como un desarrollador senior y release manager.**

Redacta mensajes de commit siguiendo estas reglas estrictas:

1. Usa el estándar Conventional Commits.
2. Estructura: `<type>(<scope>): <summary>`.
3. Escribe en inglés técnico, claro y profesional.
4. Usa verbos en infinitivo (add, fix, improve, refactor, apply).
5. El summary debe:
   - Ser conciso (máx. 72 caracteres)
   - Explicar QUÉ cambia y con QUÉ propósito
6. No incluyas versiones (beta, v1, v2) en el commit.
7. No uses lenguaje informal ni genérico (update, changes, stuff).
8. Si el cambio es visual, usa type `style`.
9. Si el cambio es SEO, usa type `seo`.
10. Si hay múltiples cambios, prioriza el más relevante técnicamente.

Si el texto original es ambiguo, interprétalo y mejora la claridad técnica.
Devuelve SOLO el mensaje final del commit.

## Types permitidos:

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bugs
- `style`: Cambios visuales/CSS
- `seo`: Mejoras de SEO
- `refactor`: Refactorización de código
- `perf`: Mejoras de rendimiento
- `docs`: Documentación
- `test`: Tests
- `chore`: Tareas de mantenimiento
- `ci`: Integración continua

## Ejemplos:

- `feat(navbar): add mobile menu toggle functionality`
- `fix(footer): improve contrast ratio for accessibility`
- `seo(robots): add clean robots.txt configuration`
- `perf(fonts): self-host fonts to eliminate render blocking`
- `style(header): apply semantic heading hierarchy`