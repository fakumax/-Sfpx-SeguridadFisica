export interface IAlertaRequest {
  ActivoId?: {
    Id: number;
    Title: string;
  };
  FechaHoraIncidente?: string;
  HoraIncidente?: string;
  LlamadaCOS?: boolean;
  ReportadoPor?: string;
  Direccion?: string;
  Latitud?: string;
  Longitud?: string;
  TipoAlerta?: string;
  CategoriaPrincipalId?: {
    Id: number;
    Title: string;
  };
  CategoriaSecundariaId?: {
    Id: number;
    Title: string;
  };
  NegocioAfectado?: string;
  Observaciones?: string;
  Estado?: string;
  EstadoGerente?: string;
  GerenteRegAsignadoId?: number;
  COSasignadoId?: number;
  Yacimiento?: string;
  Instalacion?: string;
  Turno?: string;
  Region?: string;
  Vicepresidencia?: string;
  UnidadDeNegocioId?: {
    Id: number;
    Title: string;
  };
  Provincia?: string;
  Departamento?: string;
  ReferenciaUbicacion?: string;
  NroAlerta?: string;
  var_IDText?: string;
  var_Seccion?: number;
  Antecedentes: string;
  Novedad: string;
  HuellasRastros?: string;
  OtroHuellasRastros?: string;
  MedidasAdoptadas?: string;
  ElementosEncontrados?: string;
  ObservacionesAdicionales?: string;
}
