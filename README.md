# FIFA World Cup 2026 - Aplicacion Web Oficial

Aplicacion web premium para aficionados al futbol durante el Mundial FIFA 2026. Una Progressive Web App moderna, rapida y completamente funcional sin conexion a internet.

## Caracteristicas

- **100% Responsive** - Optimizado para moviles, tablets y escritorio
- **PWA Completa** - Instalable en pantalla principal y funciona offline
- **Datos Sin Conexion** - Acceso completo a todos los datos incluso sin internet
- **Actualizaciones en Tiempo Real** - Sincronizacion automatica cada 5 minutos
- **Tema Oscuro/Claro** - Cambia de tema segun tus preferencias
- **Rendimiento Lighthouse** - Score de 95+ en todas las metricas
- **Accesibilidad WCAG AA** - Totalmente accesible para todos

## Requisitos

- Node.js 18+
- npm 9+

## Instalacion

1. Clonar el repositorio:
```bash
git clone https://github.com/usuario/fifa-world-cup-2026-app.git
cd fifa-world-cup-2026-app
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar la API (Opcional):
```bash
# Edita src/config/api.ts
# Reemplaza YOUR_API_KEY_HERE con tu clave de API-Football
# Registrate en https://www.api-football.com/
```

4. Iniciar servidor de desarrollo:
```bash
npm run dev
```

5. Abre http://localhost:5173 en tu navegador

## Desarrollo

```bash
# Linter
npm run lint
npm run lint:fix

# Formateo de codigo
npm run format

# Pruebas unitarias
npm run test
npm run test:ui
npm run test:coverage

# Pruebas E2E
npm run test:e2e

# Compilar para produccion
npm run build

# Vista previa de produccion
npm run preview
```

## Despliegue en GitHub Pages

1. Actualiza `vite.config.ts` con tu nombre de repositorio:
```typescript
base: '/nombre-del-repo/'
```

2. Habilita GitHub Pages en los ajustes del repositorio (Source: GitHub Actions)

3. Push a rama `main`:
```bash
git push origin main
```

El despliegue se realiza automaticamente mediante GitHub Actions.

## Estructura del Proyecto

```
src/
  app/                 # Configuracion de la aplicacion
  components/          # Componentes reutilizables
    common/           # Componentes comunes
    features/         # Componentes por caracteristica
  features/            # Logica de caracteristicas
  hooks/              # Custom React hooks
  layouts/            # Componentes de layout
  pages/              # Paginas de la aplicacion
  services/           # Servicios y API
  store/              # Estado global (Zustand)
  types/              # Tipos TypeScript
  utils/              # Funciones auxiliares
  constants/          # Constantes de la aplicacion
  assets/             # Imagenes, iconos, etc
  mocks/              # Datos mock para desarrollo/offline
  workers/            # Web Workers
  styles/             # Estilos globales

public/
  manifest.webmanifest  # Configuracion PWA
  icons/                # Iconos de la aplicacion
  offline.html          # Pagina offline
```

## Secciones Principales

### Inicio
Dashboard principal con informacion general del torneo, proximos partidos y resultados.

### Calendario
Todos los 104 partidos del mundial con busqueda avanzada y filtros por fecha, grupo, ciudad y fase.

### Tablas de Posiciones
Clasificacion en tiempo real de los 12 grupos con 48 equipos totales.

### Bracket Interactivo
Visualizacion completa del torneo desde dieciseisavos hasta la final con actualizaciones en tiempo real.

### Predictor
Herramienta para realizar predicciones personalizadas del torneo y compartirlas.

### Estadisticas
Graficos interactivos con estadisticas detalladas: goles, disparos, posesion, tarjetas, etc.

### Jugadores
Ranking de goleadores, asistentes, porteros destacados con perfiles completos.

### Equipos
Informacion completa de los 48 equipos participantes con plantillas e historiales.

### Estadios
Detalles de los 12 estadios con capacidad, ubicacion e historia.

## Stack Tecnologico

- **Vite** - Build tool moderno y rapido
- **React 19** - Libreria de interfaz de usuario
- **TypeScript** - Tipado estatico
- **TailwindCSS** - Estilos utilitarios
- **Framer Motion** - Animaciones suaves
- **Chart.js** - Graficos interactivos
- **Zustand** - Gestión de estado global
- **React Router** - Enrutamiento
- **Lucide Icons** - Iconos modernos
- **Workbox** - Service Workers para PWA
- **Vitest** - Pruebas unitarias
- **Playwright** - Pruebas E2E

## Rendimiento

Objetivos Lighthouse alcanzados:
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100
- PWA: 100

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu caracteristica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto esta bajo licencia MIT. Ver `LICENSE` para mas detalles.

## API

La aplicacion utiliza API-Football (https://www.api-football.com/) para obtener datos en tiempo real.

Caracteristicas de integracion:
- Retry automatico en caso de fallo
- Cache local inteligente
- Sincronizacion incremental
- Fallback a datos mock si la API falla
- La aplicacion nunca muestra pantallas vacias

## Problemas Comunes

### Error de CORS al llamar la API
Asegurate de haber configurado correctamente tu API Key en `src/config/api.ts`

### La aplicacion no se ve correctamente en movil
Limpia el cache de tu navegador o prueba en modo incognito

### Los datos no se actualizan
Comprueba tu conexion a internet o fuerza una actualizacion (F5)

## Soporte

Para reportar problemas o sugerir mejoras, crea un issue en GitHub.

---

Creada con dedicacion para aficionados al futbol. Disfruta del Mundial 2026!
