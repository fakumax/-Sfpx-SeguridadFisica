export interface IFiltro {
  pendientes: string;
  tratamiento: string;
  numero?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  estado?: string;
  regionId?: string | number;
  region?: string;
  vicepresidenciaId?: string | number;
  vicepresidencia?: string;
  unidadId?: string | number;
  unidad?: string;
  activo?: string;
  activoId?: string | number;
  tipoAlerta?: string;
  tipoAlertaId?: string | number;
  categoriaPrincipal?: string;
  categoriaPrincipalId?: string | number;
  CategoriaSecundaria?: string;
  CategoriaSecundariaId?: string | number;
  instalacion?: string;
}
