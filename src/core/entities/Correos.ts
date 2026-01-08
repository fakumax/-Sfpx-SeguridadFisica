import { BaseEntity } from './';

export default class Correos extends BaseEntity {
    constructor(item?: any) {
        super(item);
    }

    protected mapItem(item: any): void {
        this.Codigo = item.Codigo ? item.Codigo : undefined;
        this.SUBJECT = item.SUBJECT ? item.SUBJECT : undefined;
        this.BODY = item.BODY ? item.BODY : undefined;
        this.AvisoLegal = item.AvisoLegal ? item.AvisoLegal : undefined;
        this.TO = item.TO ? item.TO : undefined;
    }

    public toListItem(): any {
        return {
            ...super.toListItem(),
        };
    }
    public Codigo?: string;
    public SUBJECT?: string;
    public BODY?: string;
    public AvisoLegal?: string;
    public TO:string;
}
export interface ICorreos {
    Codigo: string,
    SUBJECT: string,
    BODY: string,
    AvisoLegal: string,
    TO:string,
}
