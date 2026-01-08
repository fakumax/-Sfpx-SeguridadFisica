export interface IFiltrar {
  numero?: string;
  FechaHoraIncidenteDesde?: Date;
  FechaHoraIncidenteHasta?: Date;
  Estado?: string;
  Region?: string;
  Vicepresidencia?: string;
  UnidadDeNegocio?: number;
  UnidadDeNegocioTxt?: string;
  Activo?: number;
  ActivoTxt?: string;
  TipoAlerta?: string;
  CategoriaPrincipal?: number;
  CategoriaPrincipalTxt?: string;
  CategoriaSecundaria?: number;
  CategoriaSecundariaTxt?: string;
  instalacion?: string;
}
