import { IAlertaRequest } from '../interfaces/IAlertaRequest';

export const mapperData = (formData: any): IAlertaRequest => {
  return {
    Estado: formData.Estado,
    EstadoGerente: formData.EstadoGerente,
    COSasignadoId: formData.COSasignadoId,
    Vicepresidencia: formData.Vicepresidencia,
    UnidadDeNegocioId: formData.UnidadDeNegocio,
    ActivoId: formData.Activo,
    TipoAlerta: formData.TipoAlerta,
    CategoriaPrincipalId: formData.CategoriaPrincipal.Id,
    CategoriaSecundariaId: formData.CategoriaSecundaria,
    ReportadoPor: formData.ReportadoPor,
    HoraIncidente: formData.HoraIncidente,
    FechaHoraIncidente: formData.FechaHoraIncidente,
    Antecedentes: formData.AlertaDatos?.Antecedentes || null,
    Novedad: formData.AlertaDatos?.Novedad || null,
    Turno: formData.Turno ? formData.Turno : undefined,
    LlamadaCOS: formData.LlamadaCOS,
  };
};
