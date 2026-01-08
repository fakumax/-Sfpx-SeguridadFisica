import { IAlerta } from '../../../core/interfaces/IAlerta';
import { IUser } from '../../../core/interfaces/IUser';
import { Estados } from '../../../core/utils/Constants';

const initialUser: IUser = {
  Id: undefined,
  Title: '',
  EMail: '',
  LoginName: undefined,
  Picture: undefined,
  SipAddress: undefined,
};
export const initAlertas = (): any => {
  return {
    Id: undefined,
    Title: '',
    Anio: '',
    FechaHoraIncidente: '',
    HoraIncidente: '',
    LlamadaCOS: false,
    ReportadoPor: '',
    Direccion: '',
    Latitud: '',
    Longitud: '',
    TipoAlerta: '',
    CategoriaPrincipal: { Id: undefined, Title: '' },
    CategoriaSecundaria: { Id: undefined, Title: '' },
    NegocioAfectado: '',
    Observaciones: '',
    Estado: '',
    GerenteRegAsignado: initialUser,
    COSAsignado: initialUser,
    Yacimiento: '',
    Instalacion: '',
    Turno: '',
    Region: '',
    Vicepresidencia: '',
    UnidadDeNegocio: { Id: undefined, Title: '' },
    Activo: { Id: undefined, Title: '' },
    Provincia: '',
    Departamento: '',
    ReferenciaUbicacion: '',
    NroAlerta: '',
    var_IDText: '',
    var_Seccion: undefined,
    AlertaDatos: { Antecedentes: '', Novedad: '' },
    MensajesDescripcion: [
      {
        Id: '',
        Title: '',
        Comentario: '',
        IDAlerta: '',
        Created: '',
        Modified: '',
        Author: initialUser,
        Editor: initialUser,
      },
    ],
  };
};

export const selectFields: string = [
  'Id',
  'Title',
  'Author/ID',
  'Author/Title',
  'Created',
  'ObservacionModificadaPor/Id',
  'ObservacionModificadaPor/Title',
  'ObservacionModificada',
  'Anio',
  'FechaHoraIncidente',
  'HoraIncidente',
  'LlamadaCOS',
  'ReportadoPor',
  'Direccion',
  'Latitud',
  'Longitud',
  'TipoAlerta',
  'CategoriaPrincipal/Id',
  'CategoriaPrincipal/Title',
  'CategoriaSecundaria/Id',
  'CategoriaSecundaria/Title',
  'NegocioAfectado',
  'Observaciones',
  'Estado',
  'GerenteRegAsignado/Id',
  'GerenteRegAsignado/Title',
  'GerenteRegAsignado/EMail',
  'COSasignado/Id',
  'COSasignado/Title',
  'COSasignado/EMail',
  'Yacimiento',
  'Instalacion',
  'Turno',
  'Region',
  'Vicepresidencia',
  'UnidadDeNegocio/Id',
  'UnidadDeNegocio/Title',
  'Activo/Id',
  'Activo/Title',
  'Provincia',
  'Departamento',
  'ReferenciaUbicacion',
  'NroAlerta',
  'var_IDText',
  'var_Seccion',
  'Antecedentes',
  'Novedad',
  'EsMOB',
  'EstadoGerente',
  'ObjetivoFijo',
  'ObservacionGIS',
  'FechaObservacionGIS',
  'HoraObservacionGIS',
  'LatitudDispositivo',
  'LongitudDispositivo',
].join(',');

export const expandFields: string = [
  'CategoriaPrincipal',
  'CategoriaSecundaria',
  'GerenteRegAsignado',
  'COSasignado',
  'UnidadDeNegocio',
  'Activo',
  'Author',
  'ObservacionModificadaPor',
].join(',');

export const getStatusColor = (estado: string) => {
  switch (estado) {
    case Estados.Ingresada:
      return 'red';
    case Estados.Asignada:
      return 'orange';
    case Estados.DevueltaVigilador:
      return 'green';
    case Estados.EliminadaCOS:
      return 'gray';
    case Estados.DerivadaAprobador:
      return 'orange';
    case Estados.AsignadaAprobador:
      return 'orange';
    case Estados.Eliminado:
      return 'gray';
    case Estados.Bloqueoproceso:
      return 'blue';
    case Estados.Eninvestigacion:
      return 'purple';
    case Estados.FrustradoIntSSFF:
      return 'brown';
    case Estados.Frustrado:
      return 'brown';
    case Estados.Finalizado:
      return 'darkgreen';
    case Estados.Concretado:
      return 'darkblue';
    case Estados.DevueltaCOS:
      return 'red';
    default:
      return '';
  }
};

export const DayPickerSpanish = {
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  shortMonths: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],
  days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  shortDays: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  goToToday: 'Ir a hoy',
  prevMonthAriaLabel: 'Mes anterior',
  nextMonthAriaLabel: 'Mes siguiente',
  prevYearAriaLabel: 'Año anterior',
  nextYearAriaLabel: 'Año siguiente',
  closeButtonAriaLabel: 'Cerrar',
  weekNumberFormatString: 'Semana {0}',
  isRequiredErrorMessage: 'La fecha es obligatoria.',
  invalidInputErrorMessage: 'Formato de fecha no válido.',
};

export const formatDate = (date: Date | undefined): string => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateFromString = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
