/**
 * Exportaciones de todos los mocks disponibles
 * 
 * Usar estos mocks cuando USE_MOCK_DATA = true en mockConfig.ts
 */

// Configuración
export { 
  USE_MOCK_DATA, 
  MOCK_WARNING_MESSAGE, 
  MOCK_USER_ROLE,
  MOCK_DELAY_MS,
  mockDelay,
  getDatasource 
} from './mockConfig';

// Mock de Alertas
export { default as AlertaMock, mockAlertas } from './AlertaMock';

// Mock de Categorías
export { 
  fetchCategoriasPrincipalesMock,
  fetchCategoriasSecundariasMock,
  fetchCategoriasSecundariasByPrincipalMock,
  mockCategoriasPrincipales,
  mockCategoriasSecundarias
} from './CategoriasMock';

// Mock de Regiones, Activos, VPs, UNs
export {
  fetchRegionesMock,
  fetchVicepresidenciasMock,
  fetchUnidadesDeNegocioMock,
  fetchActivosMock,
  fetchActivosByRegionMock,
  mockRegiones,
  mockVicepresidencias,
  mockUnidadesDeNegocio,
  mockActivos
} from './RegionesMock';

// Mock de Usuarios
export {
  getCurrentUserMock,
  getUserByIdMock,
  getUsersByRoleMock,
  checkUserPermissionMock,
  getGerentesRegionalesMock,
  getCOSMock,
  mockUsuarios,
  currentMockUser
} from './UserMock';

// Mock de Datos Complementarios, Involucrados e Impactos
export {
  fetchDatosComplementariosByAlertaMock,
  fetchInvolucradosByAlertaMock,
  fetchImpactosByAlertaMock,
  fetchHuellasChoicesMock,
  fetchRelacionIncidenteChoicesMock,
  fetchRelacionEmpresaChoicesMock,
  mockDatosComplementarios,
  mockInvolucrados,
  mockImpactos,
  mockHuellasChoices,
  mockRelacionIncidenteChoices,
  mockRelacionEmpresaChoices
} from './DatosComplementariosMock';

// Tipos
export type { ICategoriaPrincipal, ICategoriaSecundaria } from './CategoriasMock';
export type { IRegion, IActivo, IVicepresidencia, IUnidadDeNegocio } from './RegionesMock';
export type { IMockUser } from './UserMock';
export type { IDatoComplementario, IInvolucrado, IImpacto } from './DatosComplementariosMock';
