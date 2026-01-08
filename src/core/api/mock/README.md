# Modo Demo / Mock Data

Este proyecto incluye un sistema de datos falsos (mock) que permite ejecutar la aplicación sin necesidad de conectarse a SharePoint real.

## ¿Para qué sirve?

- **Desarrollo local**: Desarrollar sin depender de listas de SharePoint
- **Demos**: Mostrar la aplicación funcionando sin configurar el entorno
- **Testing**: Probar funcionalidades con datos controlados
- **Offline**: Trabajar sin conexión a internet

## Cómo activar/desactivar

Edita el archivo `src/core/api/mock/mockConfig.ts`:

```typescript
// Cambiar a true para usar datos mock (demo)
// Cambiar a false para conectarse a SharePoint real
export const USE_MOCK_DATA = true;
```

## Mocks disponibles

| Mock | Descripción | Datos de ejemplo |
|------|-------------|------------------|
| `AlertaMock` | Alertas de seguridad física | 5 alertas con diferentes estados y tipos |
| `CategoriasMock` | Categorías principales y secundarias | Robo, Intrusión, Bloqueo, Vandalismo, etc. |
| `RegionesMock` | Regiones, VPs, UNs y Activos | Neuquén, Mendoza, Santa Cruz, etc. |
| `UserMock` | Usuarios del sistema | COS, Gerentes Regionales, Administradores |
| `DatosComplementariosMock` | Datos adicionales de alertas | Huellas, Involucrados, Impactos |

## Configuración adicional

### Delay de red simulado

Para hacer la demo más realista, puedes configurar un delay:

```typescript
// En mockConfig.ts
export const MOCK_DELAY_MS = 300; // milisegundos (0 = instantáneo)
```

### Rol del usuario en modo demo

Puedes cambiar el rol del usuario para probar diferentes permisos:

```typescript
// En mockConfig.ts
export const MOCK_USER_ROLE = 'COS'; // o 'GERENTESREGIONALES', 'Administrador', etc.
```

### Mensaje de advertencia

Cuando el modo demo está activo, se muestra este mensaje:
> ⚠️ MODO DEMO: Usando datos de prueba. Los cambios no se guardarán en SharePoint.

## Cómo usar los mocks en tu código

### Opción 1: Usar getDatasource helper

```typescript
import { AlertaMock, getDatasource } from '../core/api/mock';
import AlertaDataSource from '../core/api/AlertaDataSource';

// Automáticamente elige mock o real según USE_MOCK_DATA
const datasource = getDatasource(
  new AlertaDataSource("Alertas"),
  new AlertaMock()
);
```

### Opción 2: Importar directamente

```typescript
import { USE_MOCK_DATA, AlertaMock } from '../core/api/mock';
import AlertaDataSource from '../core/api/AlertaDataSource';

const datasource = USE_MOCK_DATA 
  ? new AlertaMock() 
  : new AlertaDataSource("Alertas");
```

### Opción 3: Usar funciones mock específicas

```typescript
import { 
  fetchCategoriasPrincipalesMock,
  fetchRegionesMock,
  getCurrentUserMock 
} from '../core/api/mock';

// En tu componente
const categorias = await fetchCategoriasPrincipalesMock();
const regiones = await fetchRegionesMock();
const usuario = await getCurrentUserMock();
```

## Logs en consola

Cuando usas datos mock, verás logs en la consola del navegador:

```
🎮 [MOCK MODE] Usando datos de demostración
📋 [MOCK] Obteniendo alertas...
👤 [MOCK] Obteniendo usuario actual...
📂 [MOCK] Obteniendo categorías principales...
🌍 [MOCK] Obteniendo regiones...
```

## Notas importantes

1. **Los cambios no persisten**: En modo mock, los datos vuelven a su estado inicial al recargar la página
2. **Usuarios simulados**: El usuario actual depende del rol configurado en `MOCK_USER_ROLE`
3. **Archivos**: Los uploads de archivos no se guardan en modo mock
4. **Emails**: Los correos no se envían en modo mock

## Agregar más datos mock

Para agregar más datos de prueba, edita el archivo correspondiente en `src/core/api/mock/`:

```typescript
// Ejemplo: agregar una nueva alerta en AlertaMock.ts
const mockAlertas: IAlerta[] = [
  // ... alertas existentes ...
  {
    Id: 6,
    Title: "ALR-2025-006",
    Estado: "Ingresada",
    // ... más campos
  },
];
```
