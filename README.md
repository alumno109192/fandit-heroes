# FANDIT HÉROES

Una plataforma de películas para explorar el universo Marvel, desarrollada con Angular 14.

## 🚀 Características

- **Lista de Héroes**: Visualización organizada en orden alfabético con imagen y nombre
- **Búsqueda Dinámica**: Barra de búsqueda con autocompletado usando Angular Material
- **Slider de Series**: Carrusel horizontal de series populares
- **Detalles del Héroe**: Página dedicada con información completa y series relacionadas
- **Diseño Responsivo**: Adaptable a dispositivos móviles, tablets y desktop
- **Interfaz Moderna**: Implementada con Angular Material y Bootstrap 5

## 🛠️ Stack Tecnológico

- **Angular 14** - Framework principal
- **TypeScript** - Lenguaje de programación
- **SCSS** - Preprocesador CSS
- **Angular Material** - Componentes UI
- **Bootstrap 5** - Framework CSS
- **RxJS** - Programación reactiva
- **API Marvel** - Fuente de datos (integración completa implementada)

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── hero-list/          # Lista principal de héroes
│   │   ├── hero-detail/        # Detalles del héroe
│   │   ├── search-bar/         # Barra de búsqueda
│   │   └── series-slider/      # Slider de series
│   ├── models/
│   │   └── hero.model.ts       # Interfaces y tipos
│   ├── services/
│   │   └── marvel.service.ts   # Servicio de datos
│   ├── app-routing.module.ts   # Configuración de rutas
│   └── app.module.ts           # Módulo principal
├── environments/               # Variables de entorno
└── styles.scss                # Estilos globales
```

## 🎯 Rutas de la Aplicación

- `/` - Lista principal de héroes con búsqueda y slider de series
- `/hero/:id` - Página de detalles del héroe con series relacionadas

## 🎨 Características de Diseño

### Paleta de Colores
- **Primario**: Gradiente morado-azul (#667eea → #764ba2)
- **Acentos**: Blancos y grises suaves
- **Interacciones**: Efectos hover y transiciones suaves

### Responsive Design
- **Mobile**: Diseño de columna única optimizado para táctil
- **Tablet**: Grid de 2-3 columnas con navegación intuitiva
- **Desktop**: Grid completo con efectos visuales avanzados

### Componentes Clave

#### Barra de Búsqueda
- Autocompletado en tiempo real
- Debounce de 300ms para optimizar peticiones
- Resultados con imágenes y nombres
- Indicador de carga visual

#### Tarjetas de Héroes
- Imágenes de alta calidad
- Overlay con botón de acción
- Estadísticas (comics, series, historias)
- Efectos hover con elevación

#### Slider de Series
- Desplazamiento horizontal suave
- Información on-hover
- Responsive en todos los dispositivos

## 🔧 Instalación y Desarrollo

### Prerrequisitos
- Node.js 16+ 
- npm 8+
- Angular CLI 14

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd fandit-heroes
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Las claves de Marvel API ya están configuradas en environment.ts
   # Para producción, actualizar environment.prod.ts
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm start
   # La aplicación estará disponible en http://localhost:4200
   ```

5. **Compilar para producción**
   ```bash
   npm run build
   ```

## 🌐 API de Marvel

### Configuración
El proyecto incluye las credenciales proporcionadas:
- **Public Key**: `bcc8ce64fe9732579b0089c35707e4a8`
- **Private Key**: `cb00e4e3dffe1adbee1c2a70da84369ff8ea2dd9`

### Endpoints Utilizados
- `GET /characters` - Lista de héroes
- `GET /characters/{id}` - Detalles del héroe
- `GET /characters/{id}/series` - Series del héroe
- `GET /series` - Lista de series

### Integración de API
El servicio incluye:
- **Autenticación completa** con hash MD5 y timestamp
- **Manejo de errores** con fallback a datos mock
- **Optimización de peticiones** con debounce en búsquedas
- **Parámetros dinámicos** para filtros y paginación

## 📱 Características Responsive

### Mobile (< 768px)
- Navigation stack vertical
- Tarjetas de ancho completo
- Búsqueda optimizada para táctil
- Slider con scroll táctil

### Tablet (768px - 1024px)
- Grid de 2-3 columnas
- Navegación híbrida
- Componentes medianos

### Desktop (> 1024px)
- Grid completo (4+ columnas)
- Efectos hover avanzados
- Navegación completa

## 🔮 Funcionalidades Futuras

- [x] **Integración completa con Marvel API en producción** ✅
- [ ] Sistema de favoritos
- [ ] Filtros avanzados (por serie, año, etc.)
- [ ] Modo oscuro/claro
- [ ] Compartir en redes sociales
- [ ] Página de comics
- [ ] Sistema de rating
- [ ] Notificaciones push

## 🚀 Deploy

### Netlify/Vercel
```bash
npm run build
# Subir carpeta dist/ al servicio de hosting
```

### GitHub Pages
```bash
ng build --base-href="https://usuario.github.io/fandit-heroes/"
```

## 📝 Scripts Disponibles

- `npm start` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run test` - Ejecutar tests
- `npm run lint` - Linter
- `npm run e2e` - Tests end-to-end

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Autor

Desarrollado para **FANDIT HÉROES** - Plataforma de exploración del universo Marvel.

---

## 🎉 Estado del Proyecto: ✅ COMPLETADO CON API REAL

### ✅ Funcionalidades Implementadas

- [x] **Instalación Base**: Angular 14 + SCSS + Routing
- [x] **Dependencias**: Angular Material + Bootstrap 5 configurados
- [x] **Estructura**: Componentes modulares creados
- [x] **Servicios**: MarvelService con integración completa a Marvel API
- [x] **API Marvel**: Integración completa con autenticación MD5 ✨
- [x] **Componentes**:
  - [x] HeroListComponent - Lista principal con datos reales
  - [x] HeroDetailComponent - Detalles del héroe con datos reales
  - [x] SearchBarComponent - Búsqueda con autocomplete en tiempo real
  - [x] SeriesSliderComponent - Slider de series con datos reales
- [x] **Routing**: Navegación entre páginas configurada
- [x] **Estilos**: Diseño responsive y moderno
- [x] **Compilación**: Proyecto compila exitosamente
- [x] **Servidor**: Ejecutándose en http://localhost:4200
- [x] **Documentación**: Completa con guía técnica de API

### 🌟 Características Destacadas de la API

- **🔐 Autenticación Segura**: Hash MD5 + timestamp
- **⚡ Optimizado**: Debounce, cache, fallback automático
- **🛡️ Robusto**: Manejo de errores con datos mock de respaldo
- **📡 Tiempo Real**: Búsqueda dinámica con Marvel API
- **📊 Completo**: Heroes, series, detalles, estadísticas

### 🎯 Experiencia de Usuario

- **Búsqueda Intuitiva**: Autocompletado dinámico con imágenes
- **Navegación Fluida**: Transiciones suaves entre páginas
- **Diseño Atractivo**: Interfaz moderna con gradientes y efectos
- **Responsive**: Funciona perfectamente en todos los dispositivos
- **Rendimiento**: Optimizado para carga rápida

### 🔧 Aspectos Técnicos

- **Arquitectura**: Componentes modulares y reutilizables
- **Estado**: Manejo reactivo con RxJS
- **Tipado**: TypeScript estricto para robustez
- **Estilos**: SCSS modular con variables CSS
- **Accesibilidad**: Implementada con Angular Material

**La aplicación está lista para usar con datos reales de Marvel API y cumple con todos los requerimientos especificados.** 🚀

### 📚 Documentación Adicional
- `MARVEL_API_INTEGRATION.md` - Guía técnica completa de la integración API
