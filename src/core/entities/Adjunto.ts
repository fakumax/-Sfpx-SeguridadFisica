export interface IAdjunto {
  Archivo: File;
  Contenido: any;
  UniqueID: string;
  FileID: string;
  Descripcion: string;
  ServerRelativeUrl: string;
  Name: string;
  IdItem: string;
  added: boolean;
  deleted: boolean;
  modified: boolean;
  errorDescripcion: boolean;
}

export class Adjunto implements IAdjunto {
  constructor(
    public Archivo: File = null,
    public Contenido: any,
    public UniqueID: string,
    public FileID: string,
    public Descripcion: string,
    public ServerRelativeUrl: string,
    public Name: string,
    public IdItem: string,
    public added: boolean = false,
    public deleted: boolean = false,
    public modified: boolean = false,
    public errorDescripcion: boolean = false,
  ) { }
}
export interface ItemImagenesVideos {
  IDAlerta: string;
  Descripcion: string;
}
export interface IDescripcion {
  descripcion: string;
  posicion: string;
}
