import { IDropdownOption, IChoiceGroupOption } from '@fluentui/react';
import { mockDelay } from './mockConfig';

export interface IDatoComplementario {
  Id: number;
  IDAlerta: number;
  HuellasEncontradas: string;
  OtrasHuellas: string;
  MedidasAdoptadas: string;
  ElementosEncontrados: string;
  ObservacionesAdicionales: string;
}

export interface IInvolucrado {
  Id: number;
  IDAlerta: number;
  Nombre: string;
  Apellido: string;
  RelacionConIncidente: string;
  RelacionConEmpresa: string;
  ModeloVehiculo: string;
  MarcaVehiculo: string;
  PatenteVehiculo: string;
  NombreContratista: string;
  Observaciones: string;
}

export interface IImpacto {
  Id: number;
  IDAlerta: number;
  MaterialAfectadoTotal: string;
  Descripcion: string;
  ValorEstimado: number;
}

const mockDatosComplementarios: IDatoComplementario[] = [
  {
    Id: 1,
    IDAlerta: 1,
    HuellasEncontradas: 'Huellas de vehículo',
    OtrasHuellas: 'Marcas de herramientas',
    MedidasAdoptadas: 'Se reforzó la vigilancia en el área',
    ElementosEncontrados: 'Herramientas abandonadas',
    ObservacionesAdicionales: 'Se detectaron 3 personas huyendo del lugar'
  },
  {
    Id: 2,
    IDAlerta: 2,
    HuellasEncontradas: 'Ninguna',
    OtrasHuellas: '',
    MedidasAdoptadas: 'Revisión de cámaras de seguridad',
    ElementosEncontrados: 'Ninguno',
    ObservacionesAdicionales: 'Personas identificadas en grabaciones'
  },
  {
    Id: 3,
    IDAlerta: 5,
    HuellasEncontradas: 'Huellas de calzado',
    OtrasHuellas: 'Residuos de combustible',
    MedidasAdoptadas: 'Instalación de sensores adicionales',
    ElementosEncontrados: 'Bidones vacíos',
    ObservacionesAdicionales: 'Robo perpetrado durante la noche'
  }
];

const mockInvolucrados: IInvolucrado[] = [
  {
    Id: 1,
    IDAlerta: 1,
    Nombre: 'Desconocido',
    Apellido: '1',
    RelacionConIncidente: 'Sospechoso',
    RelacionConEmpresa: 'Tercero',
    ModeloVehiculo: 'Hilux',
    MarcaVehiculo: 'Toyota',
    PatenteVehiculo: 'AB123CD',
    NombreContratista: '',
    Observaciones: 'Vehículo visto saliendo del lugar'
  },
  {
    Id: 2,
    IDAlerta: 2,
    Nombre: 'Juan',
    Apellido: 'González',
    RelacionConIncidente: 'Testigo',
    RelacionConEmpresa: 'Contratado',
    ModeloVehiculo: '',
    MarcaVehiculo: '',
    PatenteVehiculo: '',
    NombreContratista: 'Seguridad del Norte SRL',
    Observaciones: 'Guardia de seguridad que detectó la intrusión'
  },
  {
    Id: 3,
    IDAlerta: 3,
    Nombre: 'Grupo',
    Apellido: 'Manifestantes',
    RelacionConIncidente: 'Involucrado',
    RelacionConEmpresa: 'Tercero',
    ModeloVehiculo: '',
    MarcaVehiculo: '',
    PatenteVehiculo: '',
    NombreContratista: '',
    Observaciones: 'Aproximadamente 20 personas'
  }
];

const mockImpactos: IImpacto[] = [
  {
    Id: 1,
    IDAlerta: 1,
    MaterialAfectadoTotal: 'Cables de cobre - 500 metros',
    Descripcion: 'Sustracción de cableado eléctrico',
    ValorEstimado: 150000
  },
  {
    Id: 2,
    IDAlerta: 4,
    MaterialAfectadoTotal: 'Cerco perimetral - 50 metros',
    Descripcion: 'Daño intencional al cerco',
    ValorEstimado: 80000
  },
  {
    Id: 3,
    IDAlerta: 5,
    MaterialAfectadoTotal: 'Combustible - 2000 litros',
    Descripcion: 'Sustracción de gasoil',
    ValorEstimado: 300000
  }
];

const mockHuellasChoices: IDropdownOption[] = [
  { key: 'Huellas de vehículo', text: 'Huellas de vehículo' },
  { key: 'Huellas de calzado', text: 'Huellas de calzado' },
  { key: 'Huellas dactilares', text: 'Huellas dactilares' },
  { key: 'Ninguna', text: 'Ninguna' },
  { key: 'Otras', text: 'Otras' },
];

const mockRelacionIncidenteChoices: IChoiceGroupOption[] = [
  { key: 'Sospechoso', text: 'Sospechoso' },
  { key: 'Testigo', text: 'Testigo' },
  { key: 'Víctima', text: 'Víctima' },
  { key: 'Involucrado', text: 'Involucrado' },
];

const mockRelacionEmpresaChoices: IChoiceGroupOption[] = [
  { key: 'Personal Empresa', text: 'Personal Empresa' },
  { key: 'Contratado', text: 'Contratado' },
  { key: 'Tercero', text: 'Tercero' },
];

export async function fetchDatosComplementariosByAlertaMock(alertaId: number): Promise<IDatoComplementario[]> {
  console.log('📝 [MOCK] Obteniendo datos complementarios...', alertaId);
  await mockDelay();
  return mockDatosComplementarios.filter(d => d.IDAlerta === alertaId);
}

export async function fetchInvolucradosByAlertaMock(alertaId: number): Promise<IInvolucrado[]> {
  console.log('👥 [MOCK] Obteniendo involucrados...', alertaId);
  await mockDelay();
  return mockInvolucrados.filter(i => i.IDAlerta === alertaId);
}

export async function fetchImpactosByAlertaMock(alertaId: number): Promise<IImpacto[]> {
  console.log('💰 [MOCK] Obteniendo impactos...', alertaId);
  await mockDelay();
  return mockImpactos.filter(i => i.IDAlerta === alertaId);
}

export async function fetchHuellasChoicesMock(): Promise<IDropdownOption[]> {
  console.log('🔍 [MOCK] Obteniendo opciones de huellas...');
  await mockDelay();
  return [...mockHuellasChoices];
}

export async function fetchRelacionIncidenteChoicesMock(): Promise<IChoiceGroupOption[]> {
  console.log('🔗 [MOCK] Obteniendo opciones de relación con incidente...');
  await mockDelay();
  return [...mockRelacionIncidenteChoices];
}

export async function fetchRelacionEmpresaChoicesMock(): Promise<IChoiceGroupOption[]> {
  console.log('🔗 [MOCK] Obteniendo opciones de relación con Empresa...');
  await mockDelay();
  return [...mockRelacionEmpresaChoices];
}

export { 
  mockDatosComplementarios, 
  mockInvolucrados, 
  mockImpactos,
  mockHuellasChoices,
  mockRelacionIncidenteChoices,
  mockRelacionEmpresaChoices
};
