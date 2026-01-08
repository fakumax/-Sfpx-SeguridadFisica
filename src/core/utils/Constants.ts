//Cambiar AZURE_URL en base a donde se coloque la url de la azure function publicada, lista de configuración, archivo de configuración, variable de entorno etc...
export const AZURE_URL: string = 'http://localhost:7071'; //Solo a modo de ejemplo

export const AZURE_ERROR: string = 'AzureError';
export const AZURE_API: string = 'api';

export const LIST_NAMES = {
  ALERTAS: 'Alertas',
  CATEGORIAS_PRINCIPALES: 'Categorias Principales',
  CATEGORIAS_SECUNDARIAS: 'Categorias Secundarias',
  CORREOS: 'Correos',
  ACTIVOS: 'Activos',
  UNIDADES_DE_NEGOCIO: 'UnidadesDeNegocio',
  VICEPRESIDENCIAS: 'VPs',
  PERMISOS: 'permisos',
  IMPACTOS: 'Impactos',
  FOTOSYVIDEOS: 'FotosYvideos',
  INVOLUCRADOS: 'Involucrados',
  DATOSCOMPLEMENTARIOS: 'DatosComplementarios',
  LOG_ALERTAS: 'Log Alertas',
  REGIONES: 'Regiones',
  COMENTARIOS: 'Comentarios',
};

export const Estados = {
  Ingresada: 'Ingresada',
  Asignada: 'Asignada',
  DevueltaVigilador: 'Devuelta a Vigilador',
  EliminadaCOS: 'Eliminada por COS',
  DerivadaAprobador: 'Derivada a Aprobador',
  AsignadaAprobador: 'Asignada a Aprobador',
  Eliminado: 'Eliminado',
  Bloqueoproceso: 'Bloqueo en proceso',
  Eninvestigacion: 'En investigacion',
  FrustradoIntSSFF: 'Frustrado Int SSFF',
  Frustrado: 'Frustrado',
  Finalizado: 'Finalizado',
  Concretado: 'Concretado',
  DevueltaCOS: 'Devuelta a COS',
};
export const Categorias = {
  IncidenteBloqueo: 'Incidente de Seguridad de Bloqueo Cortes de Acceso',
};

export const enum AlertTypes {
  AlertaControl = 'Alerta de Control',
  AlertaIncidente = 'Alerta de Incidente',
  AlertaPrevencion = 'Alerta de Prevención',
  AlertaSinTipo = 'sintipo',
  SinTipo = 'Sin Tipo',
}

export const enum CodigosCorreos {
  CO001 = 'CO001',
  CO002 = 'CO002',
  CO003 = 'CO003',
  CO004 = 'CO004',
  CO005 = 'CO005',
  CO006 = 'CO006',
  CO007 = 'CO007',
}

export const enum AlertLetter {
  Control = 'C',
  Incidente = 'I',
  Prevencion = 'P',
  SinTipo = '?',
}

export const enum RelationEmpresa {
  Personal = 'Personal Empresa',
  Contratado = 'Contratado',
  Tercero = 'Tercero',
}

export const enum Complementary {
  Otras = 'Otras',
}

export const enum Permisos {
  COS = 'COS',
  GERENTESREGIONALES = 'GERENTESREGIONALES',
}

export const enum EstadoAlerta {
  pendientes = 'pendientes',
  tratamiento = 'tratamiento',
}

export const Actas = {
  NA: 'N/A',
};

export const Instalacion = {
  Ninguna: 'Ninguna Instalación',
};

export const permisosSitio = {
  Propietarios: 'Propietarios Plataforma Seguridad Fisica',
};

export const enum Ordenamiento {
  Tipo = 'tipo',
  Estado = 'Estado',
  FechaHoraIncidente = 'FechaHoraIncidente',
  CategoriaSecundaria = 'CategoriaSecundaria',
  CategoriaPrincipal = 'CategoriaPrincipal',
  Turno = 'Turno',
}

export const camposSeleccionadosDeListaComentarios: string =
  'IDAlerta, Title, Comentario';
export const camposSeleccionadosDeListaDatosComplementarios: string =
  'HuellasEncontradas, IDAlerta, OtrasHuellas, MedidasAdoptadas, ElementosEncontrados, ObservacionesAdicionales';
export const camposSeleccionadosDeListaInvolucrados: string =
  'Nombre, Apellido, ModeloVehiculo, MarcaVehiculo, PatenteVehiculo, IDAlerta, NombreContratista';
export const camposSeleccionadosDeListaImpactos: string =
  'IDAlerta, MaterialAfectadoTotal';
