# 🦸‍♂️ FANDIT HÉROES

<div align="center">

![Angular](https://img.shields.io/badge/Angular-14-red?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-4.7-blue?style=for-the-badge&logo=typescript)
![Marvel API](https://img.shields.io/badge/Marvel-API-red?style=for-the-badge&logo=marvel)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple?style=for-the-badge&logo=bootstrap)
![Angular Material](https://img.shields.io/badge/Angular-Material-blue?style=for-the-badge&logo=angular)

**Una plataforma moderna para explorar el universo Marvel**

[🚀 Demo Live](#) | [📚 Documentación](./README.md) | [🛠️ API Guide](./MARVEL_API_INTEGRATION.md) | [🔄 Toggle Guide](./TOGGLE_GUIDE.md)

</div>

---

## 🌟 **Características Principales**

- **🌐 Marvel API Real**: Integración completa con `developer.marvel.com`
- **🔄 Toggle Mock/Real**: Cambio dinámico entre datos locales y API
- **🔍 Búsqueda Inteligente**: Autocompletado en tiempo real
- **📱 Totalmente Responsive**: Mobile-first design
- **⚡ Rendimiento Optimizado**: Lazy loading y debouncing
- **🎨 UI Moderna**: Angular Material + Bootstrap 5
- **🛡️ Manejo de Errores**: Fallback automático

## 🎮 **Demo y Capturas**

### 🔄 Toggle de Fuentes de Datos
![Toggle Demo](https://via.placeholder.com/800x400/667eea/ffffff?text=Toggle+Mock+vs+API+Real)

### 🔍 Búsqueda en Tiempo Real
![Search Demo](https://via.placeholder.com/800x400/764ba2/ffffff?text=Búsqueda+Inteligente)

### 📱 Diseño Responsive
![Responsive Demo](https://via.placeholder.com/800x400/42a5f5/ffffff?text=Mobile+%2B+Desktop)

## 🚀 **Inicio Rápido**

```bash
# 1. Clonar repositorio
git clone https://github.com/[usuario]/fandit-heroes.git
cd fandit-heroes

# 2. Instalar dependencias
npm install

# 3. Ejecutar en desarrollo
npm start

# 4. Abrir en navegador
open http://localhost:4200
```

## 🛠️ **Stack Tecnológico**

### **Frontend**
- **Angular 14** - Framework principal
- **TypeScript 4.7** - Lenguaje tipado
- **Angular Material** - Componentes UI
- **Bootstrap 5** - Framework CSS
- **SCSS** - Preprocesador CSS

### **Backend/API**
- **Marvel API** - Fuente de datos oficial
- **crypto-js** - Autenticación MD5
- **RxJS** - Programación reactiva
- **HttpClient** - Cliente HTTP

### **DevOps/Tools**
- **Angular CLI** - Herramientas de desarrollo
- **Git** - Control de versiones
- **npm** - Gestión de paquetes

## 📊 **Arquitectura del Proyecto**

```
src/
├── app/
│   ├── components/
│   │   ├── hero-list/           # 📋 Lista principal
│   │   ├── hero-detail/         # 📖 Detalles del héroe
│   │   ├── search-bar/          # 🔍 Búsqueda
│   │   ├── series-slider/       # 🎬 Slider de series
│   │   └── data-toggle/         # 🔄 Toggle Mock/Real
│   ├── services/
│   │   └── marvel.service.ts    # 🌐 Servicio API
│   ├── models/
│   │   └── hero.model.ts        # 📝 Tipos TypeScript
│   └── ...
├── environments/                # ⚙️ Configuración
└── assets/                      # 🖼️ Recursos estáticos
```

## 🔧 **Configuración**

### **Variables de Entorno**

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  marvelPublicKey: 'tu-public-key',
  marvelPrivateKey: 'tu-private-key'
};
```

### **Marvel API Setup**

1. Registrarse en [developer.marvel.com](https://developer.marvel.com)
2. Obtener Public Key y Private Key
3. Configurar en `environment.ts` y `environment.prod.ts`

## 🎯 **Funcionalidades**

### ✅ **Implementadas**
- [x] Lista de héroes con paginación
- [x] Búsqueda en tiempo real
- [x] Detalles completos de personajes
- [x] Slider de series interactivo
- [x] Toggle Mock/API Real
- [x] Diseño responsive
- [x] Manejo de errores
- [x] Documentación completa

### 🔮 **Próximas Funcionalidades**
- [ ] Sistema de favoritos
- [ ] Filtros avanzados
- [ ] Modo oscuro/claro
- [ ] PWA (Progressive Web App)
- [ ] Compartir en redes sociales

## 📚 **Documentación**

- **[📖 README Completo](./README.md)** - Documentación principal
- **[🛠️ Marvel API Integration](./MARVEL_API_INTEGRATION.md)** - Guía técnica de API
- **[🔄 Toggle Guide](./TOGGLE_GUIDE.md)** - Manual del toggle Mock/Real
- **[🧪 Testing Guide](./TESTING_GUIDE.md)** - Guía de testing
- **[⚖️ Mock vs Real](./MOCK_VS_REAL_COMPARISON.md)** - Comparación de datos

## 🤝 **Contribuir**

1. **Fork** el proyecto
2. **Crear** rama feature (`git checkout -b feature/nueva-caracteristica`)
3. **Commit** cambios (`git commit -m 'feat: agregar nueva característica'`)
4. **Push** a la rama (`git push origin feature/nueva-caracteristica`)
5. **Abrir** Pull Request

## 📝 **Scripts Disponibles**

```bash
npm start          # Servidor de desarrollo
npm run build      # Build de producción
npm run build:prod # Build optimizado
npm run test       # Ejecutar tests
npm run lint       # Linter
npm run e2e        # Tests end-to-end
```

## 🐛 **Reporte de Issues**

¿Encontraste un bug? ¿Tienes una sugerencia?

1. Verifica que no exista un issue similar
2. Abre un [nuevo issue](../../issues/new)
3. Describe el problema con detalle
4. Incluye pasos para reproducir
5. Adjunta capturas si es necesario

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 👥 **Autor**

**FANDIT HÉROES** - Plataforma de exploración del universo Marvel

---

<div align="center">

**⭐ Si te gusta el proyecto, ¡dale una estrella! ⭐**

Desarrollado con ❤️ usando Angular 14 y Marvel API

</div>
