/**
 * Configuración para usar datos mock en lugar de SharePoint
 * 
 * =====================================================
 * 🎮 MODO DEMO / DESARROLLO
 * =====================================================
 * 
 * Cambiar USE_MOCK_DATA a `true` para:
 *   - Usar datos falsos sin conexión a SharePoint
 *   - Desarrollar sin necesidad de listas reales
 *   - Hacer demos sin configurar el entorno
 * 
 * Cambiar USE_MOCK_DATA a `false` para:
 *   - Conectarse a SharePoint real
 *   - Usar datos de producción
 * 
 * =====================================================
 */
export const USE_MOCK_DATA = true;

/**
 * =====================================================
 * 🎭 ROL DEL USUARIO EN MODO DEMO
 * =====================================================
 * 
 * Cambia este valor para probar diferentes roles:
 * 
 *   - "COS"                -> Centro de Operaciones de Seguridad
 *   - "GERENTESREGIONALES" -> Gerentes regionales
 *   - "Visualizador"       -> Solo lectura
 *   - "Administrador"      -> Acceso total
 * 
 * =====================================================
 */
export const MOCK_USER_ROLE = 'COS';

/**
 * Simula un delay de red para hacer la demo más realista
 * Poner en 0 para respuestas instantáneas
 */
export const MOCK_DELAY_MS = 300;

/**
 * Mensaje que se muestra cuando se usan datos mock
 */
export const MOCK_WARNING_MESSAGE = '⚠️ MODO DEMO: Usando datos de prueba. Los cambios no se guardarán en SharePoint.';

/**
 * Helper para simular delay de red
 */
export const mockDelay = (): Promise<void> => {
  if (MOCK_DELAY_MS > 0) {
    return new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
  }
  return Promise.resolve();
};

/**
 * Helper para decidir qué datasource usar
 * @param realDatasource El datasource real de SharePoint
 * @param mockDatasource El datasource mock
 * @returns El datasource apropiado según la configuración
 */
export function getDatasource<T>(realDatasource: T, mockDatasource: T): T {
  if (USE_MOCK_DATA) {
    console.log('🎮 [MOCK MODE] Usando datos de demostración');
    return mockDatasource;
  }
  return realDatasource;
}
