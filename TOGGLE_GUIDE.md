# 🔄 Toggle de Datos Mock vs API Real - Guía de Uso

## 🎯 **Funcionalidad Implementada**

Se ha agregado un **botón toggle interactivo** que permite cambiar entre dos modos de datos:

### **🌐 Modo API Real**
- Datos en vivo desde `developer.marvel.com`
- 1500+ personajes disponibles
- Búsqueda completa en tiempo real
- Requiere conexión a internet
- Datos actualizados de Marvel

### **📦 Modo Mock (Offline)**
- Datos locales predefinidos
- 3 personajes: Iron Man, Spider-Man, Captain America
- Funciona sin internet
- Respuesta instantánea
- Ideal para desarrollo y testing

## 🎮 **Cómo Usar el Toggle**

### **Ubicación**
El toggle aparece en la parte superior de la aplicación, con un diseño atractivo:
- **Gradiente morado-azul** para mantener el tema
- **Indicadores visuales** claros del modo actual
- **Switch animado** para cambiar entre modos

### **Métodos para Cambiar Modo**

#### **1. Switch Toggle**
- Usa el interruptor deslizante
- **Izquierda** = API Real 🌐
- **Derecha** = Mock 📦

#### **2. Botón Rápido**
- Click en el botón central
- Cambia automáticamente al modo opuesto
- Texto dinámico indicando la acción

### **Indicadores Visuales**

#### **Estado API Real** 🌐
- Badge verde: "API REAL"
- Descripción: "Conectado a developer.marvel.com"
- Icono: 🌐

#### **Estado Mock** 📦
- Badge naranja: "MOCK"
- Descripción: "Datos locales predefinidos"
- Icono: 📦

## 🔧 **Implementación Técnica**

### **Servicio MarvelService**
```typescript
// Métodos agregados:
toggleDataSource()     // Cambiar entre modos
setMockMode(boolean)   // Establecer modo específico
getCurrentMode()       // Obtener modo actual
useMockData$          // Observable para cambios
```

### **Componente DataToggleComponent**
- Toggle visual interactivo
- Sincronización automática con el servicio
- Responsive design
- Indicadores de estado en tiempo real

### **Recarga Automática**
Cuando cambias de modo:
- ✅ **Héroes se recargan** automáticamente
- ✅ **Series se recargan** automáticamente
- ✅ **Búsqueda se limpia** para evitar inconsistencias
- ✅ **Logs en consola** para debugging

## 🧪 **Casos de Uso del Toggle**

### **🔬 Para Desarrollo**
```bash
# Modo Mock - Testing rápido
📦 Usar para: Desarrollo de UI, testing offline, demos
🌐 Cambiar a API cuando necesites datos reales
```

### **🌐 Para Producción**
```bash
# Modo API Real - Experiencia completa
🌐 Usar para: Usuarios finales, demos con datos reales
📦 Fallback automático si API falla
```

### **📊 Para Comparación**
```bash
# Comparar resultados:
1. Buscar "Spider" en modo Mock → Solo Spider-Man
2. Cambiar a API Real → Múltiples Spider-verses
3. Ver diferencia en cantidad y variedad
```

## 🎨 **Características del Diseño**

### **Responsive**
- **Desktop**: Layout horizontal completo
- **Mobile**: Layout vertical optimizado
- **Tablet**: Diseño híbrido adaptativo

### **Animaciones**
- **Switch suave** con transiciones CSS
- **Hover effects** en botones
- **Transformaciones** en elementos activos
- **Cambios de color** fluidos

### **UX Optimizada**
- **Feedback visual** inmediato
- **Estados claros** (activo/inactivo)
- **Descripciones** explicativas
- **Colores intuitivos** (verde=online, naranja=offline)

## 🔍 **Debugging y Logs**

### **Logs en Consola**
```javascript
🔄 Modo MOCK activado - usando datos locales
🌐 Modo API REAL activado - consultando Marvel API
🔄 Cambiado a modo: MOCK
🔄 Modo cambiado, recargando datos...
```

### **Verificación de Estado**
```javascript
// En DevTools Console:
// Ver modo actual
marvelService.getCurrentModeString()

// Ver datos observables
marvelService.useMockData$.subscribe(console.log)
```

## ⚡ **Ventajas del Toggle**

### **🎯 Para Usuarios**
- **Flexibilidad** de elegir fuente de datos
- **Experiencia sin interrupciones** si API falla
- **Control total** sobre el comportamiento
- **Feedback visual** claro

### **🛠️ Para Desarrolladores**
- **Testing fácil** con datos controlados
- **Desarrollo offline** sin dependencias
- **Debugging simplificado** con logs claros
- **Comparación directa** entre fuentes de datos

### **🚀 Para Demos**
- **Datos rápidos** con modo Mock
- **Impresionar** con datos reales de Marvel
- **Sin fallos** por problemas de conectividad
- **Explicación clara** de funcionamiento

## 🎉 **Estado Actual**

### ✅ **Completamente Funcional**
- Toggle visual implementado y funcionando
- Servicio actualizado con control de modos
- Componentes reactivos a cambios
- Logs y debugging incluidos
- Diseño responsive y atractivo

### 🎮 **Listo para Usar**
**Abre http://localhost:4200 y prueba:**
1. **Cambia el toggle** entre Mock y API Real
2. **Busca "Thor"** en cada modo para ver diferencias
3. **Observa la consola** para ver los logs
4. **Navega por héroes** para experimentar ambos modos

**¡El toggle está completamente implementado y funcionando!** 🚀
