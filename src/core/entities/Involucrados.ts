import { BaseEntity } from './';

export class InvolucradosClass extends BaseEntity {
  constructor(items?: any) {
    super(items);
  }

  protected mapItem(item: any): void {
    this.Nombre = item.Nombre ? item.Nombre : undefined;
    this.Apellido = item.Apellido ? item.Apellido : undefined;
    this.TelefonoInvolucrado = item.TelefonoInvolucrado
      ? item.TelefonoInvolucrado
      : undefined;
    this.DNIInvolucrado = item.DNIInvolucrado ? item.DNIInvolucrado : undefined;
    this.RelacionConIncidente = item.RelacionConIncidente
      ? item.RelacionConIncidente
      : undefined;
    this.RelacionConEmpresa = item.RelacionConEmpresa ? item.RelacionConEmpresa : undefined;
    this.NombreContratista = item.NombreContratista ? item.NombreContratista : undefined;
    this.ManejabaVehiculo = item.ManejabaVehiculo ? item.ManejabaVehiculo : undefined;
    this.MarcaVehiculo = item.MarcaVehiculo ? item.MarcaVehiculo : undefined;
    this.ModeloVehiculo = item.ModeloVehiculo ? item.ModeloVehiculo : undefined;
    this.ColorVehiculo = item.ColorVehiculo ? item.ColorVehiculo : undefined;
    this.PatenteVehiculo = item.PatenteVehiculo ? item.PatenteVehiculo : undefined;
    this.IDAlerta = item.IDAlerta ? item.IDAlerta : undefined;
  }

  public toListItem(): any {
    return {
      ...super.toListItem(),
      Nombre: this.Nombre,
      Apellido: this.Apellido,
      TelefonoInvolucrado: this.TelefonoInvolucrado,
      DNIInvolucrado: this.DNIInvolucrado,
      RelacionConIncidente: this.RelacionConIncidente,
      RelacionConEmpresa: this.RelacionConEmpresa,
      NombreContratista: this.NombreContratista,
      ManejabaVehiculo: this.ManejabaVehiculo,
      MarcaVehiculo: this.MarcaVehiculo,
      ModeloVehiculo: this.ModeloVehiculo,
      ColorVehiculo: this.ColorVehiculo,
      PatenteVehiculo: this.PatenteVehiculo,
      IDAlerta: this.IDAlerta,
    };
  }

  public Nombre: string;
  public Apellido: string;
  public TelefonoInvolucrado: string;
  public DNIInvolucrado: string;
  public RelacionConIncidente: string;
  public RelacionConEmpresa: string;
  public NombreContratista: string;
  public ManejabaVehiculo: boolean;
  public MarcaVehiculo: string;
  public ModeloVehiculo: string;
  public ColorVehiculo: string;
  public PatenteVehiculo: string;
  public IDAlerta: string;
  public Estado: number;
  public Posicion: number;
}

export interface ItemInvolucrados {
  Nombre: string;
  Apellido: string;
  DNIInvolucrado: string;
  TelefonoInvolucrado: string;
  RelacionConIncidente: string;
  RelacionConEmpresa: string;
  NombreContratista: string;
  ManejabaVehiculo: boolean;
  MarcaVehiculo: string;
  ModeloVehiculo: string;
  ColorVehiculo: string;
  PatenteVehiculo: string;
  IDAlerta: string;
  Estado?: number;
  Id?: number;
  Posicion?: number;
}
