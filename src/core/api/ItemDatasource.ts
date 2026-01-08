import { SPFI } from '@pnp/sp';
import { getSP } from '../pnp/sp/pnpjs-presets';
import IDatasource from './IDatasource';
import { Item } from '../entities';
import AFBackend from '../azure/AFBackend';

export default class ItemDatasource implements IDatasource<Item> {
  private _sp: SPFI;
  public listTitle: string;
  private selectProperties: Array<string> = [
    'Id',
    'Title',
    'Created',
    'Author/EMail',
    'Author/ID',
  ];
  private expand: Array<string> = ['Author'];

  constructor(listTitle: string, campoTitle?: string) {
    this._sp = getSP();
    this.listTitle = listTitle;
  }

  public async getItems(): Promise<Array<Item>> {
    const items: any[] = await this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.select(...this.selectProperties)
      .expand(...this.expand)();
    return items.map((item) => new Item(item));
  }

  public add(item: Item): Promise<Item> {
    const listItem = item.toListItem();

    //Agrega el elemento desde SP con el usuario en curso, también se puede agregar el elemento desde
    //una Azure Function, por ejemplo por medio de la funcion AFBackend.createPrueba(item), que agrega
    //el elemento usando los permisos de aplicación configurados (ClientId and ClientSecret).
    return this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.add(listItem)
      .then((result: any) => {
        return this.getById(result.ID).then((itemAdd: Item) => {
          //Solo a modo de prueba llama a la Azure Function para enviar un correo, no necesariamente se
          //deben enviar correos desde la Azure Function, se puede hacer desde el SPFx.
          return AFBackend.sendEmail(itemAdd).then(() => {
            return itemAdd;
          });
        });
      });
  }

  public edit(item: Item): Promise<Item> {
    const listItem = item.toListItem();
    return this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(item.Id)
      .update(listItem)
      .then(() => {
        return this.getById(item.Id);
      });
  }

  public delete(itemId: number): Promise<void> {
    return this._sp.web.lists.getByTitle(this.listTitle).items.getById(itemId).delete();
  }

  public async getById(itemId: number): Promise<Item> {
    return this._sp.web.lists
      .getByTitle(this.listTitle)
      .items.getById(itemId)
      .select(...this.selectProperties)
      .expand(...this.expand)()
      .then((item) => new Item(item));
  }
}
