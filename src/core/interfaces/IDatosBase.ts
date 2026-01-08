import { IMensajesDescripcion } from './IMensajesDescripcion';
import { IUser } from './IUser';

export interface IDatosBase {
  Vicepresidencia: string;
  UnidadDeNegocioId: number;
  ActivoId?: number;
  TipoAlerta: string;
  CategoriaPrincipalId: number;
  CategoriaSecundariaId: number;
  ReportadoPor: string;
  HoraIncidente: string;
  FechaHoraIncidente: string;
  EsMOB: boolean;
}
