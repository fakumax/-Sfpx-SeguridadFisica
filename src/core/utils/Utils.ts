export default class Utils {
  public static getVersion() {
    var json = require('../../../config/package-solution.json');
    return json['solution']['version'];
  }
}

export type ConIDAlerta = { IDAlerta: string; };

export type AlertaReducida = {
  IDAlerta: string;
  CategoriaPrincipalTitle?: string;
  CategoriaSecundariaTitle?: string;
  Turno?: string;
  TipoAlerta?: string;
  Estado?: string;
  Fecha?: string;
};
