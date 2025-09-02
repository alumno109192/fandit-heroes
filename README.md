# 🦸‍♂️ FANDIT HÉROES

## 📖 Descripción

**FANDIT HÉROES** es una plataforma web desarrollada en **Angular 14** que permite explorar el universo de héroes de Marvel. La aplicación implementa una arquitectura **SOLID** y **Clean Code**, ofreciendo una experiencia de usuario fluida y un código mantenible y extensible.

> **⚠️ IMPORTANTE**: La API oficial de Marvel no está disponible actualmente ("Page Not Found"), por lo que la aplicación utiliza **datos simulados (mock)** para demostrar todas las funcionalidades. La arquitectura está preparada para conectar con la API real cuando esté disponible.

> **🏗️ ARQUITECTURA**: La aplicación ha sido completamente migrada a la **arquitectura SOLID**. La versión clásica ha sido eliminada completamente para mantener un código limpio y mantenible.

## 🌟 Características Principales

### ✨ **Funcionalidades de Usuario**
- 🔍 **Búsqueda avanzada** de héroes por nombre
- 🖼️ **Visualización optimizada** de imágenes de héroes
- 📱 **Diseño responsive** con Bootstrap 5 y Angular Material
- 🔄 **Toggle dinámico** entre datos mock y API real
- 🎨 **Interfaz moderna** con componentes Material Design
- 🚀 **Carga eficiente** de datos con paginación

### 🏗️ **Arquitectura Técnica**
- 📐 **Principios SOLID** aplicados consistentemente
- 🧹 **Clean Code** con funciones pequeñas y nombres descriptivos
- 🏭 **Factory Pattern** para gestión de data sources
- 🔄 **Strategy Pattern** para intercambio de fuentes de datos
- 📊 **Observer Pattern** con RxJS para programación reactiva
- 🧪 **Testing completo** con Jasmine y Karma

## 🚀 Inicio Rápido

### **Prerrequisitos**
```bash
# Verificar versiones mínimas
node --version  # >= 16.x
npm --version   # >= 8.x
ng version      # Angular CLI >= 14.x
```

### **Instalación y Ejecución**
```bash
# 1. Clonar el repositorio
git clone https://github.com/yesod-projects/fandit-heroes.git
cd fandit-heroes

# 2. Instalar dependencias
npm install

# 3. Ejecutar servidor de desarrollo
ng serve

# 4. Abrir en navegador
# La aplicación estará disponible en http://localhost:4200
```

### **Scripts Disponibles**
```bash
npm start                    # Servidor de desarrollo
npm run build               # Build de producción
npm test                    # Tests unitarios
npm run test:coverage      # Tests con coverage
npm run lint               # Análisis de código
npm run e2e                # Tests end-to-end
```

## 🏛️ Arquitectura SOLID

### **Estructura de Archivos**
```
src/app/
├── 🏭 interfaces/
│   └── data.interfaces.ts           # Abstracciones y contratos
├── 🔧 constants/
│   └── app.constants.ts             # Constantes centralizadas
├── 🛠️ utils/
│   └── common.utils.ts              # Utilidades reutilizables
├── 📊 services/
│   ├── configuration.service.ts     # Configuración de la app
│   ├── toggle.service.ts           # Gestión de modo mock/API
│   ├── image.service.ts            # Optimización de imágenes
│   ├── hero-data-source.factory.ts # Factory para data sources
│   ├── marvel-solid.service.ts     # Servicio principal SOLID
│   └── 📂 data-sources/
│       ├── mock-hero.data-source.ts # Datos simulados
│       └── api-hero.data-source.ts  # API de Marvel (preparada)
└── 🎨 components/
    ├── 📂 hero-list/               # Componente original
    └── 📂 hero-list-solid/         # Componente SOLID refactorizado
```

### **Principios SOLID Aplicados**

#### 1. **SRP - Single Responsibility Principle**
```typescript
ConfigurationService  // Solo configuración
ToggleService         // Solo gestión de toggle
ImageService         // Solo gestión de imágenes
MockHeroDataSource   // Solo datos mock
ApiHeroDataSource    // Solo comunicación API
```

#### 2. **OCP - Open/Closed Principle**
```typescript
// Extensible para nuevos data sources sin modificar código existente
interface IHeroDataSource {
  getHeroes(): Observable<Hero[]>;
  getHeroById(id: number): Observable<Hero>;
  searchHeroes(query: string): Observable<Hero[]>;
}
```

#### 3. **LSP - Liskov Substitution Principle**
```typescript
// MockHeroDataSource y ApiHeroDataSource son intercambiables
function processHeroes(dataSource: IHeroDataSource) {
  return dataSource.getHeroes(); // Funciona con cualquier implementación
}
```

#### 4. **ISP - Interface Segregation Principle**
```typescript
// Interfaces específicas en lugar de una interfaz monolítica
interface IHeroDataSource { }      // Solo para héroes
interface IImageService { }        // Solo para imágenes
interface IToggleService { }       // Solo para toggle
```

#### 5. **DIP - Dependency Inversion Principle**
```typescript
// Dependencias de abstracciones, no de concreciones
constructor(
  private marvelService: MarvelService,      // Coordina abstracciones
  private imageService: IImageService,       // Abstracción
  private toggleService: IToggleService      // Abstracción
) {}
```

## 🛠️ Tecnologías Utilizadas

### **Frontend Framework**
- 🅰️ **Angular 14** - Framework principal
- 📱 **Angular Material** - Componentes UI
- 🎨 **Bootstrap 5** - Sistema de grid y utilidades CSS
- 🎭 **SCSS** - Preprocessor CSS

### **Gestión de Estado y Datos**
- 🔄 **RxJS** - Programación reactiva
- 🌐 **HttpClient** - Comunicación HTTP
- 🔐 **crypto-js** - Autenticación MD5 para Marvel API

### **Desarrollo y Testing**
- 📝 **TypeScript** - Tipado estático
- 🧪 **Jasmine + Karma** - Testing unitario
- 🔍 **ESLint** - Análisis de código
- 📋 **Prettier** - Formateo de código

### **Control de Versiones**
- 🌿 **Git** - Control de versiones
- 🐙 **GitHub** - Repositorio remoto y colaboración

## 📊 Estado del Proyecto

### **✅ Completado**
- [x] Proyecto Angular 14 configurado
- [x] Integración con Bootstrap 5 y Angular Material
- [x] Implementación de principios SOLID y Clean Code
- [x] Sistema de toggle entre datos mock y API real
- [x] Datos mock expandidos (10 héroes con información completa)
- [x] Búsqueda y filtrado de héroes
- [x] Optimización de imágenes
- [x] Testing unitario completo
- [x] Documentación técnica detallada
- [x] Repositorio GitHub configurado y público

### **🔄 En Progreso**
- [ ] Integración del componente SOLID en la aplicación principal
- [ ] Migración completa de componentes originales a arquitectura SOLID
- [ ] Optimizaciones adicionales de performance

### **📋 Pendiente**
- [ ] Conexión con API real de Marvel (cuando esté disponible)
- [ ] Implementación de PWA (Progressive Web App)
- [ ] Despliegue en plataforma cloud
- [ ] Tests end-to-end con Cypress

## 🔧 Configuración API Marvel

### **⚠️ Estado Actual**
```typescript
// La API de Marvel no está disponible actualmente
// Error reportado: "Page Not Found"
// URL afectada: https://gateway.marvel.com:443/v1/public/characters

// La aplicación usa datos mock como fallback
export const API_STATUS = {
  MARVEL_API: 'UNAVAILABLE',    // API no disponible
  FALLBACK_MODE: 'MOCK_DATA',   // Usando datos simulados
  LAST_CHECK: '2024-01-XX'      // Última verificación
};
```

### **🔑 Configuración para API Real (Preparada)**
```typescript
// Cuando la API esté disponible, configurar:
export const MARVEL_CONFIG = {
  BASE_URL: 'https://gateway.marvel.com/v1/public',
  PUBLIC_KEY: 'tu_public_key_aqui',
  PRIVATE_KEY: 'tu_private_key_aqui',  // Solo para generar hash
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};
```

**Para obtener las claves de API:**
1. Registrarse en [Marvel Developer Portal](https://developer.marvel.com/)
2. Crear una nueva aplicación
3. Obtener las claves pública y privada
4. Configurar en `src/app/constants/app.constants.ts`

## 📱 Datos Mock Disponibles

### **Héroes Incluidos** (10 héroes con datos completos)
```json
[
  {
    "id": 1,
    "name": "Spider-Man",
    "description": "Bitten by a radioactive spider...",
    "thumbnail": {
      "path": "assets/images/spiderman",
      "extension": "jpg"
    },
    "comics": { "available": 4043 },
    "series": { "available": 498 },
    "stories": { "available": 4786 }
  }
  // ... 9 héroes más con información completa
]
```

### **Funcionalidades Mock**
- ✅ Listado completo de héroes
- ✅ Búsqueda por nombre
- ✅ Detalles individuales
- ✅ Imágenes optimizadas locales
- ✅ Datos estadísticos (comics, series, stories)

## 🧪 Testing

### **Cobertura de Tests**
```bash
# Ejecutar tests con coverage
npm run test:coverage

# Resultados esperados:
# - Statements: > 90%
# - Branches: > 85%
# - Functions: > 90%
# - Lines: > 90%
```

### **Tests Implementados**
- ✅ **Servicios**: Todos los servicios SOLID
- ✅ **Componentes**: HeroListSolidComponent completo
- ✅ **Data Sources**: Mock y API data sources
- ✅ **Utilidades**: Funciones de validación y formato
- ✅ **Integración**: Tests de integración entre servicios

## 🚀 Performance

### **Optimizaciones Implementadas**
- 🖼️ **Lazy loading** de imágenes
- 📦 **OnPush** change detection strategy
- 🔄 **Debounce** en búsquedas (300ms)
- 📊 **Paginación** eficiente
- 💾 **Caching** de resultados de búsqueda

### **Métricas Target**
- ⚡ **First Contentful Paint**: < 2s
- 🎯 **Largest Contentful Paint**: < 3s
- 🏃 **First Input Delay**: < 100ms
- 📊 **Cumulative Layout Shift**: < 0.1

## 🔄 Toggle Mock/API

### **Funcionalidad de Toggle**
```typescript
// El usuario puede cambiar entre modos dinámicamente
@Component({...})
export class AppComponent {
  constructor(private toggleService: ToggleService) {}
  
  toggleDataMode(): void {
    this.toggleService.toggleMode();
    // Automáticamente cambia entre mock y API
  }
}
```

### **Estados Disponibles**
- 🧪 **MOCK**: Datos simulados locales (actual)
- 🌐 **API**: Conexión a Marvel API (preparado)
- 🔄 **AUTO**: Detección automática de disponibilidad

## 📚 Documentación Adicional

### **Archivos de Documentación**
- 📋 `README.md` - Documentación principal (este archivo)
- 🏗️ `SOLID_IMPLEMENTATION.md` - Detalles de arquitectura SOLID
- 🧑‍💻 `DEVELOPMENT.md` - Guía para desarrolladores
- 🚀 `DEPLOYMENT.md` - Instrucciones de despliegue

### **Recursos de Aprendizaje**
- [Principios SOLID en Angular](https://angular.io/guide/architecture)
- [Clean Code en TypeScript](https://github.com/labs42io/clean-code-typescript)
- [Marvel API Documentation](https://developer.marvel.com/docs)
- [Angular Material Components](https://material.angular.io/components)

## 🤝 Contribución

### **Guía para Contribuir**
1. 🍴 Fork el repositorio
2. 🌿 Crear una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. 💾 Commit los cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. 📤 Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. 🔄 Crear un Pull Request

### **Estándares de Código**
- ✅ Seguir principios SOLID
- ✅ Aplicar Clean Code
- ✅ Escribir tests unitarios
- ✅ Documentar funciones públicas
- ✅ Usar TypeScript estricto

## 📄 Licencia

Este proyecto está licenciado bajo la **MIT License** - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Yesod Projects**
- 🌐 GitHub: [@yesod-projects](https://github.com/yesod-projects)
- 📧 Email: contact@yesodprojects.com
- 🔗 LinkedIn: [Yesod Projects](https://linkedin.com/in/yesodprojects)

## 🙏 Agradecimientos

- 🦸‍♂️ **Marvel Comics** - Por el increíble universo de superhéroes
- 🅰️ **Angular Team** - Por el excelente framework
- 🎨 **Material Design Team** - Por los componentes UI
- 🌟 **Comunidad Open Source** - Por las librerías y herramientas

---

## 🎯 Próximos Hitos

### **Versión 2.0 (Planificada)**
- 🔗 **Conexión API Real** cuando Marvel API esté disponible
- 🎨 **Modo Dark/Light** theme switcher
- ❤️ **Sistema de Favoritos** persistente
- 📊 **Dashboard Analytics** para administradores
- 🔔 **Notificaciones Push** para nuevos contenidos

### **Versión 2.1 (Planificada)**
- 📱 **PWA Completa** con offline support
- 🌍 **Internacionalización** (i18n) multi-idioma
- 🔐 **Autenticación** de usuarios
- 💬 **Sistema de Comentarios** y reviews
- 🎮 **Gamificación** con badges y logros

---

**¡Disfruta explorando el universo Marvel con FANDIT HÉROES!** 🦸‍♂️✨

> **Nota**: Este proyecto es una demostración técnica y no tiene afiliación oficial con Marvel Comics. Todas las imágenes y datos de personajes son propiedad de sus respectivos dueños.
