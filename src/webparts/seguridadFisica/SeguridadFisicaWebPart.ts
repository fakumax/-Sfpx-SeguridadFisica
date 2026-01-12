import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'SeguridadFisicaWebPartStrings';
import { ISeguridadFisicaProps } from './components/ListaAlerta/ISeguridadFisicaProps';
import { IListId } from '../../core/interfaces/IListId';
import { IAlerta } from '../../core/interfaces/IAlerta';
import SPODataProvider from '../../core/pnp/sp/SharePointDataProvider';
import { getSP } from '../../core/pnp/sp/pnpjs-presets';
import AppRouter from './components/AppRouter';
import '@pnp/graph/groups';
import '@pnp/graph/members';
import '@pnp/graph/users';
import { Estados, LIST_NAMES, Permisos, permisosSitio } from '../../core/utils/Constants';
import { IFiltro } from '../../core/interfaces/IFiltro';
import BaseEntity from '../../core/entities/BaseEntity';
import { ISeguridadFisicaWebPartProps } from '../../core/interfaces/ISeguridadFisicaWebPartProps';

let _listId: IListId;
let _visible: boolean;
let _permiso: string;
let _region: string;
let _listItemAlerta: IAlerta[];
let _filtrosPermisos: IFiltro;

export default class SeguridadFisicaWebPart extends BaseClientSideWebPart<ISeguridadFisicaWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _VPN: boolean = true;
  private _isOwner: boolean = false;

  protected async onInit(): Promise<void> {
    // Modo DEMO: siempre usar datos mock (cambiar a false para conectar a SharePoint real)
    const useMockMode = true;
    
    if (useMockMode) {
      // Modo mock para desarrollo local
      SPODataProvider.setMockMode(true);
      this._VPN = true;
      _listId = { Alertas: 'mock-list-id' };
      _listItemAlerta = [
        // ANTECEDENTES FINALIZADOS (para mostrar en sección de antecedentes de alertas 3 y 4)
        {
          Id: 1,
          Title: 'ALR-2025-0098',
          Anio: '2025',
          FechaHoraIncidente: '2025-12-15T10:30:00',
          HoraIncidente: '10:30',
          TipoAlerta: 'Alerta de Prevención',
          CategoriaPrincipal: { Id: 3, Title: 'Intrusión' },
          CategoriaPrincipalId: 3,
          CategoriaSecundaria: { Id: 3, Title: 'Acceso no autorizado' },
          CategoriaSecundariaId: 3,
          Estado: Estados.Finalizado,
          Region: 'NORTE',
          Vicepresidencia: 'VP Logística',
          UnidadDeNegocio: { Id: 3, Title: 'Unidad Central' },
          Activo: { Id: 3, Title: 'Depósito Principal' },
          Instalacion: 'Depósito Central',
          Turno: 'Mañana',
          Provincia: 'Neuquén',
          Departamento: 'Zapala',
          ReportadoPor: 'Pedro Gómez',
          Direccion: 'Av. Industrial 1234',
          Latitud: '-38.8996',
          Longitud: '-70.0698',
          Observaciones: 'Intento de intrusión detectado y neutralizado. Se reforzaron las medidas de seguridad perimetral.',
          NroAlerta: 'ALR-2025-0098',
          var_IDText: '1',
          var_Seccion: 7,
          MensajesDescripcion: [],
          AlertaDatos: '',
          Novedad: 'Caso cerrado satisfactoriamente',
          EsMOB: false,
          ObservacionGIS: 'Verificado',
          ObjetivoFijo: 'Depósito',
          LatitudDispositivo: -38.8996,
          LongitudDispositivo: -70.0698,
          FechaObservacionGIS: '2025-12-15',
          HoraObservacionGIS: '18:00'
        },
        {
          Id: 2,
          Title: 'ALR-2025-0099',
          Anio: '2025',
          FechaHoraIncidente: '2025-12-20T09:00:00',
          HoraIncidente: '09:00',
          TipoAlerta: 'Alerta de Incidente',
          CategoriaPrincipal: { Id: 1, Title: 'Robo' },
          CategoriaPrincipalId: 1,
          CategoriaSecundaria: { Id: 4, Title: 'Robo de equipos' },
          CategoriaSecundariaId: 4,
          Estado: Estados.Concretado,
          Region: 'NORTE',
          Vicepresidencia: 'VP Operaciones',
          UnidadDeNegocio: { Id: 1, Title: 'Unidad Norte' },
          Activo: { Id: 4, Title: 'Oficina Administrativa' },
          Instalacion: 'Oficina Central',
          Turno: 'Mañana',
          Provincia: 'Mendoza',
          Departamento: 'Luján de Cuyo',
          ReportadoPor: 'Laura Fernández',
          Direccion: 'Calle Principal 567',
          Latitud: '-33.0341',
          Longitud: '-68.8737',
          Observaciones: 'Robo de equipamiento de oficina confirmado. Denuncia policial realizada.',
          NroAlerta: 'ALR-2025-0099',
          var_IDText: '2',
          var_Seccion: 7,
          MensajesDescripcion: [],
          AlertaDatos: '',
          Novedad: 'Caso cerrado - pérdida confirmada',
          EsMOB: false,
          ObservacionGIS: 'Confirmado',
          ObjetivoFijo: 'Oficina',
          LatitudDispositivo: -33.0341,
          LongitudDispositivo: -68.8737,
          FechaObservacionGIS: '2025-12-22',
          HoraObservacionGIS: '16:00'
        },
        // TRATAMIENTO (Asignada, DerivadaAprobador)
        {
          Id: 3,
          Title: 'ALR-2026-0003',
          Anio: '2026',
          FechaHoraIncidente: '2026-01-06T14:00:00',
          HoraIncidente: '14:00',
          TipoAlerta: 'Alerta de Prevención',
          CategoriaPrincipal: { Id: 3, Title: 'Intrusión' },
          CategoriaPrincipalId: 3,
          CategoriaSecundaria: { Id: 3, Title: 'Acceso no autorizado' },
          CategoriaSecundariaId: 3,
          Estado: Estados.Asignada,
          Region: 'NORTE',
          Vicepresidencia: 'VP Logística',
          UnidadDeNegocio: { Id: 3, Title: 'Unidad Central' },
          Activo: { Id: 3, Title: 'Depósito Principal' },
          Instalacion: 'Depósito Central',
          Turno: 'Tarde',
          Provincia: 'Neuquén',
          Departamento: 'Zapala',
          ReportadoPor: 'Carlos Rodríguez',
          Direccion: 'Av. Industrial 1234',
          Latitud: '-38.8996',
          Longitud: '-70.0698',
          Observaciones: 'Alerta en tratamiento - asignada a operador para seguimiento.',
          NroAlerta: 'ALR-2026-0003',
          var_IDText: '3',
          var_Seccion: 7,
          MensajesDescripcion: [],
          AlertaDatos: '',
          Novedad: 'Novedad de prueba 3',
          EsMOB: false,
          ObservacionGIS: '',
          ObjetivoFijo: '',
          LatitudDispositivo: -38.8996,
          LongitudDispositivo: -70.0698,
          FechaObservacionGIS: '',
          HoraObservacionGIS: ''
        },
        {
          Id: 4,
          Title: 'ALR-2026-0004',
          Anio: '2026',
          FechaHoraIncidente: '2026-01-05T20:00:00',
          HoraIncidente: '20:00',
          TipoAlerta: 'Alerta de Incidente',
          CategoriaPrincipal: { Id: 1, Title: 'Robo' },
          CategoriaPrincipalId: 1,
          CategoriaSecundaria: { Id: 4, Title: 'Robo de equipos' },
          CategoriaSecundariaId: 4,
          Estado: Estados.DerivadaAprobador,
          Region: 'NORTE',
          Vicepresidencia: 'VP Operaciones',
          UnidadDeNegocio: { Id: 1, Title: 'Unidad Norte' },
          Activo: { Id: 4, Title: 'Oficina Administrativa' },
          Instalacion: 'Oficina Central',
          Turno: 'Noche',
          Provincia: 'Mendoza',
          Departamento: 'Luján de Cuyo',
          ReportadoPor: 'Ana Martínez',
          Direccion: 'Calle Principal 567',
          Latitud: '-33.0341',
          Longitud: '-68.8737',
          Observaciones: 'Alerta en tratamiento - derivada a aprobador para autorización.',
          NroAlerta: 'ALR-2026-0004',
          var_IDText: '4',
          var_Seccion: 7,
          MensajesDescripcion: [],
          AlertaDatos: '',
          Novedad: 'Novedad de prueba 4',
          EsMOB: false,
          ObservacionGIS: '',
          ObjetivoFijo: '',
          LatitudDispositivo: -33.0341,
          LongitudDispositivo: -68.8737,
          FechaObservacionGIS: '',
          HoraObservacionGIS: ''
        },
        // PENDIENTES (Ingresada, DevueltaCOS)
        {
          Id: 5,
          Title: 'ALR-2026-0005',
          Anio: '2026',
          FechaHoraIncidente: '2026-01-10T08:30:00',
          HoraIncidente: '08:30',
          TipoAlerta: 'Alerta de Incidente',
          CategoriaPrincipal: { Id: 1, Title: 'Robo' },
          CategoriaPrincipalId: 1,
          CategoriaSecundaria: { Id: 1, Title: 'Robo de materiales' },
          CategoriaSecundariaId: 1,
          Estado: Estados.Ingresada,
          Region: 'NORTE',
          Vicepresidencia: 'VP Operaciones',
          UnidadDeNegocio: { Id: 1, Title: 'Unidad Norte' },
          Activo: { Id: 1, Title: 'Planta de Procesamiento' },
          Instalacion: 'Planta Norte',
          Turno: 'Mañana',
          Provincia: 'Neuquén',
          Departamento: 'Confluencia',
          ReportadoPor: 'Roberto Sánchez',
          Direccion: 'Ruta 22 Km 10',
          Latitud: '-38.9520',
          Longitud: '-68.0600',
          Observaciones: 'Se detectó faltante de herramientas en el taller de mantenimiento.',
          NroAlerta: 'ALR-2026-0005',
          var_IDText: '5',
          MensajesDescripcion: [],
          AlertaDatos: '',
          Novedad: '',
          EsMOB: false,
          ObservacionGIS: '',
          ObjetivoFijo: '',
          LatitudDispositivo: -38.9520,
          LongitudDispositivo: -68.0600,
          FechaObservacionGIS: '',
          HoraObservacionGIS: ''
        },
        {
          Id: 6,
          Title: 'ALR-2026-0006',
          Anio: '2026',
          FechaHoraIncidente: '2026-01-09T15:45:00',
          HoraIncidente: '15:45',
          TipoAlerta: 'Alerta de Control',
          CategoriaPrincipal: { Id: 2, Title: 'Vandalismo' },
          CategoriaPrincipalId: 2,
          CategoriaSecundaria: { Id: 2, Title: 'Daño a instalaciones' },
          CategoriaSecundariaId: 2,
          Estado: Estados.DevueltaCOS,
          Region: 'NORTE',
          Vicepresidencia: 'VP Operaciones',
          UnidadDeNegocio: { Id: 2, Title: 'Unidad Sur' },
          Activo: { Id: 2, Title: 'Estación de Bombeo' },
          Instalacion: 'Estación Sur',
          Turno: 'Tarde',
          Provincia: 'Río Negro',
          Departamento: 'General Roca',
          ReportadoPor: 'Lucía Fernández',
          Direccion: 'Camino Rural Km 5',
          Latitud: '-39.0340',
          Longitud: '-67.5810',
          Observaciones: 'Daño a cerco perimetral detectado. Requiere revisión adicional.',
          NroAlerta: 'ALR-2026-0006',
          var_IDText: '6',
          MensajesDescripcion: [],
          AlertaDatos: '',
          Novedad: '',
          EsMOB: false,
          ObservacionGIS: '',
          ObjetivoFijo: '',
          LatitudDispositivo: -39.0340,
          LongitudDispositivo: -67.5810,
          FechaObservacionGIS: '',
          HoraObservacionGIS: ''
        },
        // MÁS ALERTAS EN TRATAMIENTO (Eninvestigacion, Bloqueoproceso)
        {
          Id: 7,
          Title: 'ALR-2026-0007',
          Anio: '2026',
          FechaHoraIncidente: '2026-01-04T11:00:00',
          HoraIncidente: '11:00',
          TipoAlerta: 'Alerta de Incidente',
          CategoriaPrincipal: { Id: 1, Title: 'Robo' },
          CategoriaPrincipalId: 1,
          CategoriaSecundaria: { Id: 1, Title: 'Robo de materiales' },
          CategoriaSecundariaId: 1,
          Estado: Estados.Eninvestigacion,
          Region: 'NORTE',
          Vicepresidencia: 'VP Operaciones',
          UnidadDeNegocio: { Id: 1, Title: 'Unidad Norte' },
          Activo: { Id: 1, Title: 'Planta de Procesamiento' },
          Instalacion: 'Planta Norte',
          Turno: 'Mañana',
          Provincia: 'Neuquén',
          Departamento: 'Confluencia',
          ReportadoPor: 'Miguel Torres',
          Direccion: 'Ruta 22 Km 8',
          Latitud: '-38.9510',
          Longitud: '-68.0580',
          Observaciones: 'Robo de cables de cobre en subestación eléctrica. Caso en investigación policial.',
          NroAlerta: 'ALR-2026-0007',
          var_IDText: '7',
          var_Seccion: 7,
          MensajesDescripcion: [],
          AlertaDatos: '',
          Novedad: 'En investigación activa',
          EsMOB: true,
          ObservacionGIS: 'Zona verificada',
          ObjetivoFijo: 'Subestación',
          LatitudDispositivo: -38.9510,
          LongitudDispositivo: -68.0580,
          FechaObservacionGIS: '2026-01-04',
          HoraObservacionGIS: '14:00'
        },
        {
          Id: 8,
          Title: 'ALR-2026-0008',
          Anio: '2026',
          FechaHoraIncidente: '2026-01-03T22:30:00',
          HoraIncidente: '22:30',
          TipoAlerta: 'Alerta de Prevención',
          CategoriaPrincipal: { Id: 3, Title: 'Intrusión' },
          CategoriaPrincipalId: 3,
          CategoriaSecundaria: { Id: 3, Title: 'Acceso no autorizado' },
          CategoriaSecundariaId: 3,
          Estado: Estados.Bloqueoproceso,
          Region: 'NORTE',
          Vicepresidencia: 'VP Logística',
          UnidadDeNegocio: { Id: 3, Title: 'Unidad Central' },
          Activo: { Id: 3, Title: 'Depósito Principal' },
          Instalacion: 'Depósito Central',
          Turno: 'Noche',
          Provincia: 'Neuquén',
          Departamento: 'Zapala',
          ReportadoPor: 'Patricia Gómez',
          Direccion: 'Av. Industrial 1500',
          Latitud: '-38.9000',
          Longitud: '-70.0700',
          Observaciones: 'Intento de intrusión nocturna. Proceso bloqueado pendiente de autorización gerencial.',
          NroAlerta: 'ALR-2026-0008',
          var_IDText: '8',
          var_Seccion: 7,
          MensajesDescripcion: [],
          AlertaDatos: '',
          Novedad: 'Bloqueado - esperando autorización',
          EsMOB: true,
          ObservacionGIS: 'Perímetro revisado',
          ObjetivoFijo: 'Depósito',
          LatitudDispositivo: -38.9000,
          LongitudDispositivo: -70.0700,
          FechaObservacionGIS: '2026-01-04',
          HoraObservacionGIS: '08:00'
        }
      ];
      // Almacenar datos mock en el provider para que getItemById funcione
      SPODataProvider.setMockData(LIST_NAMES.ALERTAS, _listItemAlerta);
      // Datos mock para listas de lookup
      SPODataProvider.setMockData('VPs', [
        { Id: 1, Title: 'VP Operaciones' },
        { Id: 2, Title: 'VP Logística' },
        { Id: 3, Title: 'VP Administración' }
      ]);
      SPODataProvider.setMockData('UnidadesDeNegocio', [
        { Id: 1, Title: 'Unidad Norte', VPId: 1 },
        { Id: 2, Title: 'Unidad Sur', VPId: 1 },
        { Id: 3, Title: 'Unidad Central', VPId: 2 }
      ]);
      SPODataProvider.setMockData('Activos', [
        { Id: 1, Title: 'Planta de Procesamiento', Activo: 1, Region: { Id: 1, Title: 'NORTE' }, VP: { Id: 1, Title: 'VP Operaciones' }, UN: { Id: 1, Title: 'Unidad Norte' } },
        { Id: 2, Title: 'Estación de Bombeo', Activo: 1, Region: { Id: 1, Title: 'NORTE' }, VP: { Id: 1, Title: 'VP Operaciones' }, UN: { Id: 2, Title: 'Unidad Sur' } },
        { Id: 3, Title: 'Depósito Principal', Activo: 1, Region: { Id: 1, Title: 'NORTE' }, VP: { Id: 2, Title: 'VP Logística' }, UN: { Id: 3, Title: 'Unidad Central' } },
        { Id: 4, Title: 'Oficina Administrativa', Activo: 1, Region: { Id: 1, Title: 'NORTE' }, VP: { Id: 1, Title: 'VP Operaciones' }, UN: { Id: 1, Title: 'Unidad Norte' } }
      ]);
      SPODataProvider.setMockData('Categorias Principales', [
        { Id: 1, Title: 'Robo', Activo: 1, Formulario: 'Incidente' },
        { Id: 2, Title: 'Vandalismo', Activo: 1, Formulario: 'Control' },
        { Id: 3, Title: 'Intrusión', Activo: 1, Formulario: 'Prevención' }
      ]);
      SPODataProvider.setMockData('Categorias Secundarias', [
        { Id: 1, Title: 'Robo de materiales', Activo: 1, CategoriaPrincipal: { Id: 1, Title: 'Robo' } },
        { Id: 2, Title: 'Daño a instalaciones', Activo: 1, CategoriaPrincipal: { Id: 2, Title: 'Vandalismo' } },
        { Id: 3, Title: 'Acceso no autorizado', Activo: 1, CategoriaPrincipal: { Id: 3, Title: 'Intrusión' } },
        { Id: 4, Title: 'Robo de equipos', Activo: 1, CategoriaPrincipal: { Id: 1, Title: 'Robo' } }
      ]);
      SPODataProvider.setMockData('Regiones', [
        { Id: 1, Title: 'NORTE' },
        { Id: 2, Title: 'SUR' },
        { Id: 3, Title: 'CENTRO' }
      ]);
      // Datos mock para Comentarios (descripciones de alertas en tratamiento)
      SPODataProvider.setMockData('Comentarios', [
        { 
          Id: 1, 
          IDAlerta: '3', 
          Comentario: 'Se detectó intento de acceso no autorizado por el sector norte del depósito. Personal de seguridad intervino y se alejaron del perímetro.', 
          Created: '2026-01-06T14:30:00',
          Modified: '2026-01-06T14:30:00',
          Author: { Id: 1, Title: 'Carlos Rodríguez', EMail: 'carlos.rodriguez@demo.com' },
          Editor: { Id: 1, Title: 'Carlos Rodríguez', EMail: 'carlos.rodriguez@demo.com' }
        },
        { 
          Id: 2, 
          IDAlerta: '3', 
          Comentario: 'Se revisaron las cámaras de seguridad. Se identificaron 2 personas que intentaron ingresar por la reja perimetral.', 
          Created: '2026-01-06T16:00:00',
          Modified: '2026-01-06T16:00:00',
          Author: { Id: 2, Title: 'María López', EMail: 'maria.lopez@demo.com' },
          Editor: { Id: 2, Title: 'María López', EMail: 'maria.lopez@demo.com' }
        },
        { 
          Id: 3, 
          IDAlerta: '4', 
          Comentario: 'Robo de equipos de computación en oficina administrativa. Se sustrajeron 3 notebooks y 2 monitores.', 
          Created: '2026-01-05T21:00:00',
          Modified: '2026-01-05T21:00:00',
          Author: { Id: 3, Title: 'Ana Martínez', EMail: 'ana.martinez@demo.com' },
          Editor: { Id: 3, Title: 'Ana Martínez', EMail: 'ana.martinez@demo.com' }
        },
        { 
          Id: 4, 
          IDAlerta: '4', 
          Comentario: 'Se realizó denuncia policial. Número de causa: 2026-00123. La policía ya está investigando el caso.', 
          Created: '2026-01-06T09:00:00',
          Modified: '2026-01-06T09:00:00',
          Author: { Id: 3, Title: 'Ana Martínez', EMail: 'ana.martinez@demo.com' },
          Editor: { Id: 3, Title: 'Ana Martínez', EMail: 'ana.martinez@demo.com' }
        },
        { 
          Id: 5, 
          IDAlerta: '7', 
          Comentario: 'Se detectó robo de aproximadamente 200 metros de cable de cobre en la subestación eléctrica norte.', 
          Created: '2026-01-04T12:00:00',
          Modified: '2026-01-04T12:00:00',
          Author: { Id: 4, Title: 'Miguel Torres', EMail: 'miguel.torres@demo.com' },
          Editor: { Id: 4, Title: 'Miguel Torres', EMail: 'miguel.torres@demo.com' }
        },
        { 
          Id: 6, 
          IDAlerta: '7', 
          Comentario: 'Se realizó denuncia policial. La brigada de investigaciones está trabajando en el caso.', 
          Created: '2026-01-04T15:00:00',
          Modified: '2026-01-04T15:00:00',
          Author: { Id: 4, Title: 'Miguel Torres', EMail: 'miguel.torres@demo.com' },
          Editor: { Id: 4, Title: 'Miguel Torres', EMail: 'miguel.torres@demo.com' }
        },
        { 
          Id: 7, 
          IDAlerta: '8', 
          Comentario: 'Cámaras registraron movimiento sospechoso en el perímetro del depósito a las 22:30 hs.', 
          Created: '2026-01-03T23:00:00',
          Modified: '2026-01-03T23:00:00',
          Author: { Id: 5, Title: 'Patricia Gómez', EMail: 'patricia.gomez@demo.com' },
          Editor: { Id: 5, Title: 'Patricia Gómez', EMail: 'patricia.gomez@demo.com' }
        },
        { 
          Id: 8, 
          IDAlerta: '8', 
          Comentario: 'Personal de seguridad realizó recorrida preventiva. Se encontraron marcas de corte en cerco perimetral.', 
          Created: '2026-01-04T07:00:00',
          Modified: '2026-01-04T07:00:00',
          Author: { Id: 6, Title: 'Guardia Nocturno', EMail: 'guardia@demo.com' },
          Editor: { Id: 6, Title: 'Guardia Nocturno', EMail: 'guardia@demo.com' }
        }
      ]);
      // Datos mock para Impactos (impacto y pérdida asociada)
      // Valores válidos: Nulo, Bajo, Medio, Alto
      SPODataProvider.setMockData('Impactos', [
        { 
          Id: 1, 
          IDAlerta: '3', 
          ImpactoPersonas: 'Nulo',
          ImpactoInfraestructura: 'Bajo',
          ImpactoOperaciones: 'Nulo',
          ImpactoMedioambiente: 'Nulo',
          ImpactoImagen: 'Bajo',
          ImpactoInformacion: 'Nulo',
          MaterialAfectadoTotal: 'Reja perimetral dañada - 5 metros',
          PerdidaDiariaProduccion: '15000',
          UnidadDeMedida: 'Pesos'
        },
        { 
          Id: 2, 
          IDAlerta: '4', 
          ImpactoPersonas: 'Nulo',
          ImpactoInfraestructura: 'Medio',
          ImpactoOperaciones: 'Medio',
          ImpactoMedioambiente: 'Nulo',
          ImpactoImagen: 'Medio',
          ImpactoInformacion: 'Alto',
          MaterialAfectadoTotal: '3 Notebooks Dell Latitude, 2 Monitores Samsung 24"',
          PerdidaDiariaProduccion: '50000',
          UnidadDeMedida: 'Pesos'
        },
        { 
          Id: 3, 
          IDAlerta: '7', 
          ImpactoPersonas: 'Nulo',
          ImpactoInfraestructura: 'Alto',
          ImpactoOperaciones: 'Medio',
          ImpactoMedioambiente: 'Nulo',
          ImpactoImagen: 'Bajo',
          ImpactoInformacion: 'Nulo',
          MaterialAfectadoTotal: 'Cable de cobre - 200 metros',
          PerdidaDiariaProduccion: '120000',
          UnidadDeMedida: 'Pesos'
        },
        { 
          Id: 4, 
          IDAlerta: '8', 
          ImpactoPersonas: 'Nulo',
          ImpactoInfraestructura: 'Bajo',
          ImpactoOperaciones: 'Nulo',
          ImpactoMedioambiente: 'Nulo',
          ImpactoImagen: 'Bajo',
          ImpactoInformacion: 'Nulo',
          MaterialAfectadoTotal: 'Cerco perimetral - 3 metros dañados',
          PerdidaDiariaProduccion: '8000',
          UnidadDeMedida: 'Pesos'
        }
      ]);
      // Datos mock para FotosYvideos - usando URLs de imágenes públicas accesibles
      SPODataProvider.setMockData('FotosYvideos', [
        {
          ID: 1,
          IDAlerta: '3',
          Descripcion: 'Imagen de la reja perimetral dañada',
          File: { Name: 'evidencia_reja.jpg', ServerRelativeUrl: 'https://picsum.photos/400/300?random=1' }
        },
        {
          ID: 2,
          IDAlerta: '4',
          Descripcion: 'Foto del área donde se produjo el robo',
          File: { Name: 'evidencia_robo.jpg', ServerRelativeUrl: 'https://picsum.photos/400/300?random=2' }
        },
        {
          ID: 3,
          IDAlerta: '7',
          Descripcion: 'Cables cortados en subestación eléctrica',
          File: { Name: 'cables_cortados.jpg', ServerRelativeUrl: 'https://picsum.photos/400/300?random=3' }
        },
        {
          ID: 4,
          IDAlerta: '8',
          Descripcion: 'Marcas de corte en cerco perimetral',
          File: { Name: 'cerco_danado.jpg', ServerRelativeUrl: 'https://picsum.photos/400/300?random=4' }
        }
      ]);
      // Datos mock para DatosComplementarios
      SPODataProvider.setMockData('DatosComplementarios', [
        {
          Id: 1,
          IDAlerta: '3',
          HuellasEncontradas: ['Huellas de calzado'],
          OtrasHuellas: '',
          MedidasAdoptadas: 'Se reforzó la vigilancia perimetral y se instalaron cámaras adicionales',
          ElementosEncontrados: 'Herramientas de corte abandonadas cerca de la reja',
          ObservacionesAdicionales: 'Se detectaron marcas de vehículo en el camino de acceso'
        },
        {
          Id: 2,
          IDAlerta: '4',
          HuellasEncontradas: ['Huellas dactilares', 'Huellas de calzado'],
          OtrasHuellas: 'Marcas de forzamiento en la cerradura',
          MedidasAdoptadas: 'Se cambió el sistema de cerraduras y se activó alarma silenciosa',
          ElementosEncontrados: 'Destornillador y guantes descartados',
          ObservacionesAdicionales: 'Denuncia policial realizada - Causa N° 2026-00123'
        },
        {
          Id: 3,
          IDAlerta: '7',
          HuellasEncontradas: ['Huellas de calzado', 'Huellas de neumáticos'],
          OtrasHuellas: 'Marcas de herramientas de corte en cables',
          MedidasAdoptadas: 'Instalación de sensores de movimiento y alarmas en subestación',
          ElementosEncontrados: 'Pinza cortacables abandonada en el lugar',
          ObservacionesAdicionales: 'Caso en investigación policial activa - Brigada de Robos'
        },
        {
          Id: 4,
          IDAlerta: '8',
          HuellasEncontradas: ['Huellas de calzado'],
          OtrasHuellas: 'Marcas de corte en alambre del cerco',
          MedidasAdoptadas: 'Reparación del cerco y aumento de rondas nocturnas',
          ElementosEncontrados: 'Tijera de podar encontrada cerca del cerco',
          ObservacionesAdicionales: 'Se incrementó iluminación perimetral'
        }
      ]);
      // Datos mock para Involucrados
      SPODataProvider.setMockData('Involucrados', [
        {
          Id: 1,
          IDAlerta: '3',
          Nombre: 'Desconocido',
          Apellido: '1',
          TelefonoInvolucrado: '',
          DNIInvolucrado: '',
          RelacionConIncidente: 'Sospechoso',
          RelacionConEmpresa: 'Tercero',
          NombreContratista: '',
          ManejabaVehiculo: 'Sí',
          MarcaVehiculo: 'Ford',
          ModeloVehiculo: 'Ranger',
          ColorVehiculo: 'Blanco',
          PatenteVehiculo: 'AB 123 CD'
        },
        {
          Id: 2,
          IDAlerta: '4',
          Nombre: 'Juan',
          Apellido: 'Testigo',
          TelefonoInvolucrado: '1155667788',
          DNIInvolucrado: '',
          RelacionConIncidente: 'Testigo',
          RelacionConEmpresa: 'Personal Empresa',
          NombreContratista: '',
          ManejabaVehiculo: 'No',
          MarcaVehiculo: '',
          ModeloVehiculo: '',
          ColorVehiculo: '',
          PatenteVehiculo: ''
        },
        {
          Id: 3,
          IDAlerta: '7',
          Nombre: 'Sospechoso',
          Apellido: 'Desconocido',
          TelefonoInvolucrado: '',
          DNIInvolucrado: '',
          RelacionConIncidente: 'Sospechoso',
          RelacionConEmpresa: 'Tercero',
          NombreContratista: '',
          ManejabaVehiculo: 'Sí',
          MarcaVehiculo: 'Chevrolet',
          ModeloVehiculo: 'S10',
          ColorVehiculo: 'Gris',
          PatenteVehiculo: 'Parcial: XX-XXX'
        },
        {
          Id: 4,
          IDAlerta: '8',
          Nombre: 'Mario',
          Apellido: 'Vigilante',
          TelefonoInvolucrado: '1144556677',
          DNIInvolucrado: '25678901',
          RelacionConIncidente: 'Testigo',
          RelacionConEmpresa: 'Contratista',
          NombreContratista: 'Seguridad Integral SRL',
          ManejabaVehiculo: 'No',
          MarcaVehiculo: '',
          ModeloVehiculo: '',
          ColorVehiculo: '',
          PatenteVehiculo: ''
        }
      ]);
      _filtrosPermisos = { pendientes: 'mock', tratamiento: 'mock' };
      _visible = true;
      _permiso = Permisos.COS;
      _region = 'NORTE';
      this._isOwner = true;
      return Promise.resolve();
    }

    getSP(this.context);
    const sendEmailObj = this.properties.sendEmailObj || { url: '', key: '' };
    const propiedades: ISeguridadFisicaWebPartProps = {
      description: this.properties.description,
      ServiceApiUrlAF: this.properties.ServiceApiUrlAF,
      HealthcheckApiUrl: this.properties.HealthcheckApiUrl,
      GisMapUrl: this.properties.GisMapUrl,
      enlaces: this.properties.enlaces,
      sendEmailObj: {
        url: sendEmailObj.url,
        key: sendEmailObj.key
      }
    };
    SPODataProvider.Init(propiedades);
    this._VPN = await SPODataProvider.isConnected();

    const userId = await SPODataProvider.getUserId(
      this.context.pageContext.user.loginName,
    );
    if (userId) {
      (this.context.pageContext.user as any).id = userId;
    }
    let filtro: IFiltro = await this.getPermisos();
    if (filtro.pendientes !== '') {
      _listId = await this.getListIdsByNames();
      _listItemAlerta = [];
      _filtrosPermisos = filtro;
      _visible = true;
    } else {
      _visible = false;
      _filtrosPermisos = filtro;
    }
    this._isOwner = await SPODataProvider.isUserInGroup(permisosSitio.Propietarios);
    const isAdmin = await SPODataProvider.isSiteCollectionAdmin();
    if (!this._isOwner && !isAdmin) {
      this._initDomObserver();
    }
    return Promise.resolve();
  }

  public render(): void {
    const sendEmailObj = this.properties.sendEmailObj || { url: '', key: '' };
    const element: React.ReactElement<ISeguridadFisicaProps> = React.createElement(
      AppRouter,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        listId: _listId,
        listItemAlerta: _listItemAlerta,
        filtrosPermisos: _filtrosPermisos,
        visible: _visible,
        permiso: _permiso,
        region: _region,
        context: this.context,
        VPNisConnected: this._VPN,
        enlaces: this.properties.enlaces,
        sendEmailObj: {
          url: sendEmailObj.url,
          key: sendEmailObj.key
        },
      },
    );

    ReactDom.render(element, this.domElement);
  }

  public _initDomObserver(): void {
    const observer = new MutationObserver((mutations, obs) => {
      const settingsIcon = document.querySelector('#O365_MainLink_Settings_container');

      if (settingsIcon) {
        settingsIcon.remove();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  public async getListIdsByNames(): Promise<IListId> {
    const listTitles: string[] = [LIST_NAMES.ALERTAS];
    const listIds: IListId = {
      Alertas: '',
    };
    try {
      const promises = listTitles.map((title) => SPODataProvider.getListId(title));
      const results = await Promise.all(promises);
      listIds.Alertas = results[0];
    } catch (error) {
      console.error('Error al obtener los IDs de las listas de SharePoint:', error);
    }
    return listIds;
  }

  public async getPermisos(): Promise<IFiltro> {
    let items: BaseEntity[] = await SPODataProvider.getListItems<BaseEntity>(
      LIST_NAMES.PERMISOS,
    );
    let itemsPermisos = items.map((item) => new BaseEntity(item));
    let groupsName = '';
    let pendientes = '';
    let tratamiento = '';
    let ambos = '';
    for (let item of itemsPermisos) {
      groupsName = item.Titulo !== undefined ? item.Titulo.toUpperCase() : '';
      if (groupsName.indexOf(Permisos.COS) === 0) {
        let region = groupsName.substring(4);
        _region = region;
        _permiso = Permisos.COS;
        pendientes = `Region eq '${region}' and (Estado eq '${Estados.Ingresada}' or Estado eq '${Estados.DevueltaCOS}')`;
        tratamiento = `Region eq '${region}' and (Estado eq '${Estados.Asignada}' or Estado eq '${Estados.DerivadaAprobador}')`;
        ambos = `Region eq '${region}' and (Estado eq '${Estados.Ingresada}' or Estado eq '${Estados.DevueltaCOS}' or Estado eq '${Estados.Asignada}' or Estado eq '${Estados.DerivadaAprobador}')`;
      }
      if (groupsName.indexOf('GERENTES REGIONALES') === 0) {
        let region = groupsName.substring(20);
        _permiso = Permisos.GERENTESREGIONALES;
        _region = region;
        pendientes = `Region eq '${region}' and (Estado eq '${Estados.DerivadaAprobador}' or Estado eq '${Estados.Eninvestigacion}')`;
        tratamiento = `Region eq '${region}' and (Estado eq '${Estados.AsignadaAprobador}' or Estado eq '${Estados.Bloqueoproceso}' or Estado eq '${Estados.Eninvestigacion}')`;
        ambos = `Region eq '${region}' and (Estado eq '${Estados.DerivadaAprobador}' or Estado eq '${Estados.Eninvestigacion}' or Estado eq '${Estados.AsignadaAprobador}' or Estado eq '${Estados.Bloqueoproceso}' or Estado eq '${Estados.Eninvestigacion}')`;
      }
    }
    let filtro: IFiltro = {
      pendientes: pendientes,
      tratamiento: tratamiento,
    };
    return filtro;
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (this.context.sdks.microsoftTeams) {
      // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext().then((context) => {
        let environmentMessage: string = '';
        switch (context.app.host.name) {
          case 'Office': // running in Office
            environmentMessage = this.context.isServedFromLocalhost
              ? strings.AppLocalEnvironmentOffice
              : strings.AppOfficeEnvironment;
            break;
          case 'Outlook': // running in Outlook
            environmentMessage = this.context.isServedFromLocalhost
              ? strings.AppLocalEnvironmentOutlook
              : strings.AppOutlookEnvironment;
            break;
          case 'Teams': // running in Teams
          case 'TeamsModern':
            environmentMessage = this.context.isServedFromLocalhost
              ? strings.AppLocalEnvironmentTeams
              : strings.AppTeamsTabEnvironment;
            break;
          default:
            environmentMessage = strings.UnknownEnvironment;
        }

        return environmentMessage;
      });
    }

    return Promise.resolve(
      this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentSharePoint
        : strings.AppSharePointEnvironment,
    );
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty(
        '--linkHovered',
        semanticColors.linkHovered || null,
      );
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                }),
                PropertyPaneTextField('ServiceApiUrlAF', {
                  label: strings.ServiceApiUrlAF,
                }),
                PropertyPaneTextField('HealthcheckApiUrl', {
                  label: strings.HealthcheckApiUrl,
                }),
                PropertyPaneTextField('GisMapUrl', {
                  label: strings.GisMapUrl,
                }),
                PropertyPaneTextField('enlaces', {
                  label: 'Enlaces JSON',
                  multiline: true,
                  value: JSON.stringify(this.properties.enlaces || [], null, 2),
                }),
                PropertyPaneTextField('sendEmailObj.url', {
                  label: strings.SendEmailURL
                }),
                PropertyPaneTextField('sendEmailObj.key', {
                  label: strings.SendEmailKey
                })
              ],
            },
          ],
        },
      ],
    };
  }
}
