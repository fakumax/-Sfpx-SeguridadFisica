import { BaseEntity } from './';

export class Complementarios extends BaseEntity {

  constructor(
    public HuellasEncontradas: string[],
    public OtrasHuellas: string,
    public MedidasAdoptadas: string,
    public ObservacionesAdicionales: string,
    public ElementosEncontrados: string,
    public IDAlerta: string,
  ) {
    super();
  }

  protected mapItem(item: any): void {
    this.HuellasEncontradas = item.HuellasEncontradas ? item.HuellasEncontradas : undefined;
    this.OtrasHuellas = item.OtrasHuellas ? item.OtrasHuellas : undefined;
    this.MedidasAdoptadas = item.MedidasAdoptadas ? item.MedidasAdoptadas : undefined;
    this.ObservacionesAdicionales = item.ObservacionesAdicionales ? item.ObservacionesAdicionales : undefined;
    this.ElementosEncontrados = item.ElementosEncontrados ? item.ElementosEncontrados : undefined;
    this.IDAlerta = item.IDAlerta ? item.IDAlerta : undefined;
  }

  public toListItem(): any {
    return {
      ...super.toListItem(),
      HuellasEncontradas: this.HuellasEncontradas,
      OtrasHuellas: this.OtrasHuellas,
      MedidasAdoptadas: this.MedidasAdoptadas,
      ObservacionesAdicionales: this.ObservacionesAdicionales,
      ElementosEncontrados: this.ElementosEncontrados,
      IDAlerta:this.IDAlerta
    };
  }

}

export interface ItemComplementarios{
  HuellasEncontradas:string[];
  OtrasHuellas:string;
  MedidasAdoptadas:string;
  ObservacionesAdicionales:string;
  ElementosEncontrados:string;
  IDAlerta:string;
  Id?:string;
}
