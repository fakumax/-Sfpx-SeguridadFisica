import BaseEntity from './BaseEntity';

export default class itemPermisos extends BaseEntity {
  constructor(item?: any) {
    super(item);
  }
  protected mapItem(item: any): void {
    this.Region = item.Region;
  }
  public Region: string;
}
