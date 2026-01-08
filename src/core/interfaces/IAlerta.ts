import { IMensajesDescripcion } from './IMensajesDescripcion';
import { IUser } from './IUser';

export interface IAlerta {
  Id: number;
  Title: string;
  Anio: string;
  FechaHoraIncidente?: string;
  HoraIncidente?: string;
  LlamadaCOS?: boolean;
  ReportadoPor?: string;
  Direccion?: string;
  Latitud?: string;
  Longitud?: string;
  TipoAlerta?: string;
  CategoriaPrincipal?: {
    Id: number;
    Title: string;
  };
  CategoriaPrincipalId?: number;
  CategoriaSecundaria?: {
    Id: number;
    Title: string;
  };
  CategoriaSecundariaId?: number;
  NegocioAfectado?: string;
  Observaciones?: string;
  ObservacionModificada?: string;
  Estado?: string;
  EstadoGerente?: string;
  GerenteRegAsignado?: IUser;
  COSasignado?: IUser;
  Yacimiento?: string;
  Instalacion?: string;
  Turno?: string;
  Region?: string;
  Vicepresidencia?: string;
  UnidadDeNegocio?: {
    Id: number;
    Title: string;
  };
  Activo?: {
    Id: number;
    Title: string;
  };
  Provincia?: string;
  Departamento?: string;
  ReferenciaUbicacion?: string;
  NroAlerta?: string;
  var_IDText?: string;
  var_Seccion?: number;
  MensajesDescripcion: IMensajesDescripcion[];
  AlertaDatos: string;
  Novedad: string;
  EsMOB: boolean;
  ObservacionGIS: string;
  ObjetivoFijo: string;
  LatitudDispositivo: number;
  LongitudDispositivo: number;
  ObservacionModificadaPorId?: number;
  FechaObservacionGIS: string;
  HoraObservacionGIS: string;
}
