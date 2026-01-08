import { IAlerta } from '../../interfaces/IAlerta';
import { mockDelay } from './mockConfig';

const mockAlertas: IAlerta[] = [
  {
    Id: 1,
    Title: 'ALR-2025-001',
    Anio: '2025',
    FechaHoraIncidente: new Date('2025-01-08T10:30:00').toISOString(),
    HoraIncidente: '10:30',
    LlamadaCOS: true,
    ReportadoPor: 'Juan Pérez',
    Direccion: 'Ruta 22 Km 45, Neuquén',
    Latitud: '-38.9516',
    Longitud: '-68.0591',
    TipoAlerta: 'Alerta de Incidente',
    CategoriaPrincipal: { Id: 1, Title: 'Robo/Hurto' },
    CategoriaPrincipalId: 1,
    CategoriaSecundaria: { Id: 1, Title: 'Robo de materiales' },
    CategoriaSecundariaId: 1,
    NegocioAfectado: 'Upstream',
    Observaciones: 'Se detectó sustracción de materiales en locación',
    ObservacionModificada: '',
    Estado: 'Ingresada',
    EstadoGerente: '',
    GerenteRegAsignado: { Id: 1, Title: 'Roberto García', EMail: 'roberto.garcia@demo.com' },
    COSasignado: { Id: 2, Title: 'María López', EMail: 'maria.lopez@demo.com' },
    Yacimiento: 'Loma Campana',
    Instalacion: 'Planta Compresora',
    Turno: 'Mañana',
    Region: 'Neuquén',
    Vicepresidencia: 'Upstream',
    UnidadDeNegocio: { Id: 1, Title: 'Exploración y Producción' },
    Activo: { Id: 1, Title: 'Loma Campana Este' },
    Provincia: 'Neuquén',
    Departamento: 'Añelo',
    ReferenciaUbicacion: 'Cerca de pozo LC-1001',
    NroAlerta: 'ALR-2025-001',
    var_IDText: 'I-001',
    var_Seccion: 1,
    MensajesDescripcion: [
      { Id: '1', Comentario: 'Alerta ingresada al sistema', Created: new Date('2025-01-08T10:35:00').toISOString() }
    ],
    AlertaDatos: '',
    Novedad: 'Sin novedad',
    EsMOB: false,
    ObservacionGIS: '',
    ObjetivoFijo: 'Pozo',
    LatitudDispositivo: -38.9516,
    LongitudDispositivo: -68.0591,
    FechaObservacionGIS: '',
    HoraObservacionGIS: ''
  },
  {
    Id: 2,
    Title: 'ALR-2025-002',
    Anio: '2025',
    FechaHoraIncidente: new Date('2025-01-07T15:45:00').toISOString(),
    HoraIncidente: '15:45',
    LlamadaCOS: true,
    ReportadoPor: 'Carlos Fernández',
    Direccion: 'Ruta 7 Km 120, Mendoza',
    Latitud: '-32.8908',
    Longitud: '-68.8272',
    TipoAlerta: 'Alerta de Control',
    CategoriaPrincipal: { Id: 2, Title: 'Intrusión' },
    CategoriaPrincipalId: 2,
    CategoriaSecundaria: { Id: 3, Title: 'Ingreso no autorizado' },
    CategoriaSecundariaId: 3,
    NegocioAfectado: 'Downstream',
    Observaciones: 'Personas no identificadas detectadas en perímetro',
    ObservacionModificada: '',
    Estado: 'Asignada',
    EstadoGerente: '',
    GerenteRegAsignado: { Id: 3, Title: 'Ana Martínez', EMail: 'ana.martinez@demo.com' },
    COSasignado: { Id: 2, Title: 'María López', EMail: 'maria.lopez@demo.com' },
    Yacimiento: 'Chachahuén',
    Instalacion: 'Estación de bombeo',
    Turno: 'Tarde',
    Region: 'Mendoza',
    Vicepresidencia: 'Downstream',
    UnidadDeNegocio: { Id: 2, Title: 'Refinación' },
    Activo: { Id: 2, Title: 'Chachahuén Norte' },
    Provincia: 'Mendoza',
    Departamento: 'Malargüe',
    ReferenciaUbicacion: 'Sector norte de la planta',
    NroAlerta: 'ALR-2025-002',
    var_IDText: 'C-002',
    var_Seccion: 2,
    MensajesDescripcion: [
      { Id: '2', Comentario: 'Alerta asignada a gerente regional', Created: new Date('2025-01-07T16:00:00').toISOString() }
    ],
    AlertaDatos: '',
    Novedad: 'En seguimiento',
    EsMOB: false,
    ObservacionGIS: '',
    ObjetivoFijo: 'Planta',
    LatitudDispositivo: -32.8908,
    LongitudDispositivo: -68.8272,
    FechaObservacionGIS: '',
    HoraObservacionGIS: ''
  },
  {
    Id: 3,
    Title: 'ALR-2025-003',
    Anio: '2025',
    FechaHoraIncidente: new Date('2025-01-06T08:15:00').toISOString(),
    HoraIncidente: '08:15',
    LlamadaCOS: false,
    ReportadoPor: 'Pedro Sánchez',
    Direccion: 'Ruta 40 Km 200, Santa Cruz',
    Latitud: '-46.4313',
    Longitud: '-67.5293',
    TipoAlerta: 'Alerta de Prevención',
    CategoriaPrincipal: { Id: 3, Title: 'Bloqueo/Corte de acceso' },
    CategoriaPrincipalId: 3,
    CategoriaSecundaria: { Id: 5, Title: 'Manifestación' },
    CategoriaSecundariaId: 5,
    NegocioAfectado: 'Upstream',
    Observaciones: 'Grupo de manifestantes en acceso principal',
    ObservacionModificada: 'Se resolvió pacíficamente',
    Estado: 'Finalizado',
    EstadoGerente: 'Aprobado',
    GerenteRegAsignado: { Id: 4, Title: 'Laura Gómez', EMail: 'laura.gomez@demo.com' },
    COSasignado: { Id: 5, Title: 'Diego Rodríguez', EMail: 'diego.rodriguez@demo.com' },
    Yacimiento: 'Cerro Dragón',
    Instalacion: 'Acceso principal',
    Turno: 'Mañana',
    Region: 'Santa Cruz',
    Vicepresidencia: 'Upstream',
    UnidadDeNegocio: { Id: 1, Title: 'Exploración y Producción' },
    Activo: { Id: 3, Title: 'Cerro Dragón Sur' },
    Provincia: 'Santa Cruz',
    Departamento: 'Deseado',
    ReferenciaUbicacion: 'Portón principal del yacimiento',
    NroAlerta: 'ALR-2025-003',
    var_IDText: 'P-003',
    var_Seccion: 3,
    MensajesDescripcion: [
      { Id: '3', Comentario: 'Alerta finalizada', Created: new Date('2025-01-06T18:00:00').toISOString() }
    ],
    AlertaDatos: '',
    Novedad: 'Cerrado',
    EsMOB: true,
    ObservacionGIS: 'Verificado en campo',
    ObjetivoFijo: 'Acceso',
    LatitudDispositivo: -46.4313,
    LongitudDispositivo: -67.5293,
    FechaObservacionGIS: new Date('2025-01-06').toISOString(),
    HoraObservacionGIS: '18:00'
  },
  {
    Id: 4,
    Title: 'ALR-2025-004',
    Anio: '2025',
    FechaHoraIncidente: new Date('2025-01-08T14:20:00').toISOString(),
    HoraIncidente: '14:20',
    LlamadaCOS: true,
    ReportadoPor: 'Lucía Torres',
    Direccion: 'Ruta 151 Km 80, Neuquén',
    Latitud: '-38.0558',
    Longitud: '-68.0591',
    TipoAlerta: 'Alerta de Incidente',
    CategoriaPrincipal: { Id: 4, Title: 'Vandalismo' },
    CategoriaPrincipalId: 4,
    CategoriaSecundaria: { Id: 7, Title: 'Daño a instalaciones' },
    CategoriaSecundariaId: 7,
    NegocioAfectado: 'Upstream',
    Observaciones: 'Daño intencional a cerco perimetral',
    ObservacionModificada: '',
    Estado: 'En investigacion',
    EstadoGerente: '',
    GerenteRegAsignado: { Id: 1, Title: 'Roberto García', EMail: 'roberto.garcia@demo.com' },
    COSasignado: { Id: 2, Title: 'María López', EMail: 'maria.lopez@demo.com' },
    Yacimiento: 'El Orejano',
    Instalacion: 'Perímetro sur',
    Turno: 'Tarde',
    Region: 'Neuquén',
    Vicepresidencia: 'Upstream',
    UnidadDeNegocio: { Id: 1, Title: 'Exploración y Producción' },
    Activo: { Id: 4, Title: 'El Orejano' },
    Provincia: 'Neuquén',
    Departamento: 'Añelo',
    ReferenciaUbicacion: 'Sector sur del perímetro',
    NroAlerta: 'ALR-2025-004',
    var_IDText: 'I-004',
    var_Seccion: 1,
    MensajesDescripcion: [],
    AlertaDatos: '',
    Novedad: 'En investigación',
    EsMOB: false,
    ObservacionGIS: '',
    ObjetivoFijo: 'Perímetro',
    LatitudDispositivo: -38.0558,
    LongitudDispositivo: -68.0591,
    FechaObservacionGIS: '',
    HoraObservacionGIS: ''
  },
  {
    Id: 5,
    Title: 'ALR-2025-005',
    Anio: '2025',
    FechaHoraIncidente: new Date('2025-01-05T22:00:00').toISOString(),
    HoraIncidente: '22:00',
    LlamadaCOS: true,
    ReportadoPor: 'Martín Díaz',
    Direccion: 'Ruta 8 Km 300, Chubut',
    Latitud: '-45.8656',
    Longitud: '-67.4997',
    TipoAlerta: 'Alerta de Incidente',
    CategoriaPrincipal: { Id: 1, Title: 'Robo/Hurto' },
    CategoriaPrincipalId: 1,
    CategoriaSecundaria: { Id: 2, Title: 'Robo de combustible' },
    CategoriaSecundariaId: 2,
    NegocioAfectado: 'Upstream',
    Observaciones: 'Sustracción de combustible de tanque de almacenamiento',
    ObservacionModificada: '',
    Estado: 'Concretado',
    EstadoGerente: 'Aprobado',
    GerenteRegAsignado: { Id: 5, Title: 'Fernando Ruiz', EMail: 'fernando.ruiz@demo.com' },
    COSasignado: { Id: 5, Title: 'Diego Rodríguez', EMail: 'diego.rodriguez@demo.com' },
    Yacimiento: 'Manantiales Behr',
    Instalacion: 'Tanque de almacenamiento',
    Turno: 'Noche',
    Region: 'Chubut',
    Vicepresidencia: 'Upstream',
    UnidadDeNegocio: { Id: 1, Title: 'Exploración y Producción' },
    Activo: { Id: 5, Title: 'Manantiales Behr' },
    Provincia: 'Chubut',
    Departamento: 'Escalante',
    ReferenciaUbicacion: 'Área de tanques sector este',
    NroAlerta: 'ALR-2025-005',
    var_IDText: 'I-005',
    var_Seccion: 1,
    MensajesDescripcion: [
      { Id: '4', Comentario: 'Robo concretado - Denuncia policial realizada', Created: new Date('2025-01-06T08:00:00').toISOString() }
    ],
    AlertaDatos: '',
    Novedad: 'Denuncia realizada',
    EsMOB: false,
    ObservacionGIS: 'Confirmado en campo',
    ObjetivoFijo: 'Tanque',
    LatitudDispositivo: -45.8656,
    LongitudDispositivo: -67.4997,
    FechaObservacionGIS: new Date('2025-01-06').toISOString(),
    HoraObservacionGIS: '08:30'
  }
];

let mockData = [...mockAlertas];
let nextId = 6;

export default class AlertaMock {
  public listTitle: string = 'Alertas (MOCK)';

  public async getItems(): Promise<IAlerta[]> {
    console.log('📋 [MOCK] Obteniendo alertas...');
    await mockDelay();
    return [...mockData];
  }

  public async add(item: Partial<IAlerta>): Promise<IAlerta> {
    console.log('➕ [MOCK] Agregando alerta...', item);
    await mockDelay();
    const newItem: IAlerta = {
      ...item,
      Id: nextId++,
      Title: `ALR-2025-${String(nextId).padStart(3, '0')}`,
      NroAlerta: `ALR-2025-${String(nextId).padStart(3, '0')}`,
      Anio: new Date().getFullYear().toString(),
      MensajesDescripcion: [],
    } as IAlerta;
    mockData.push(newItem);
    return newItem;
  }

  public async edit(item: IAlerta): Promise<IAlerta> {
    console.log('✏️ [MOCK] Editando alerta...', item);
    await mockDelay();
    const index = mockData.findIndex((a) => a.Id === item.Id);
    if (index !== -1) {
      mockData[index] = item;
    }
    return item;
  }

  public async delete(itemId: number): Promise<void> {
    console.log('🗑️ [MOCK] Eliminando alerta...', itemId);
    await mockDelay();
    mockData = mockData.filter((a) => a.Id !== itemId);
  }

  public async getById(itemId: number): Promise<IAlerta | undefined> {
    console.log('🔍 [MOCK] Obteniendo alerta por ID...', itemId);
    await mockDelay();
    return mockData.find((a) => a.Id === itemId);
  }

  public async getByEstado(estado: string): Promise<IAlerta[]> {
    console.log('🔎 [MOCK] Filtrando alertas por estado...', estado);
    await mockDelay();
    return mockData.filter((a) => a.Estado === estado);
  }

  public async getByRegion(region: string): Promise<IAlerta[]> {
    console.log('🔎 [MOCK] Filtrando alertas por región...', region);
    await mockDelay();
    return mockData.filter((a) => a.Region === region);
  }
}

export { mockAlertas };
