# FIFA World Cup 2026 - Configuracion de Contribución

## Antes de Contribuir

Por favor, lee este archivo completamente antes de hacer cambios al proyecto.

## Proceso de Desarrollo

1. **Fork el repositorio**
2. **Crea una rama**: `git checkout -b feature/TuCaracteristica`
3. **Haz tus cambios** siguiendo las guias de codigo
4. **Ejecuta pruebas**: `npm run test`
5. **Lintea el codigo**: `npm run lint:fix`
6. **Haz commit**: `git commit -m 'Descripcion clara del cambio'`
7. **Push a tu fork**: `git push origin feature/TuCaracteristica`
8. **Abre un Pull Request**

## Guias de Codigo

### Estilos

- Usar TypeScript para tipos
- Seguir camelCase para variables y funciones
- Usar PascalCase para componentes
- Comentarios claros en español

### Componentes React

- Usar funciones flecha
- Especificar tipos de props
- Componentes pequeños y reutilizables
- Usar hooks modernos

### Estructura de Carpetas

```
src/features/
  feature-name/
    components/
    hooks/
    types/
    services/
    utils/
    __tests__/
    index.ts
```

## Testing

- Minimo 80% de cobertura
- Tests unitarios para utilities
- Tests E2E para flujos principales
- Tests de accesibilidad

## Licencia

Al contribuir, aceptas que tu código sera publicado bajo la licencia MIT.

## Contacto

Para preguntas, abre un issue en GitHub.
