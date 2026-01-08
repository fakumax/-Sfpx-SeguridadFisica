import { Item } from '../entities';
import IDatasource from './IDatasource';

export default class ItemMock implements IDatasource<Item> {
  public listTitle: string;

  public getItems(): Promise<Item[]> {
    const items: Item[] = Array.from({ length: 12 }, (_, i) => {
      return new Item({
        Title: `Título ${i % 3}`,
        Id: i + 1,
        Created: new Date().toISOString(),
      });
    });

    return Promise.resolve(items);
  }

  public add(item: Item): Promise<Item> {
    const crypto = window.crypto;
    var array = new Uint32Array(1);

    const newItem = new Item({
      Id: crypto.getRandomValues(array),
      Title: item.Titulo,
      Created: new Date().toISOString(),
    });

    return Promise.resolve(newItem);
  }

  public edit(item: Item): Promise<Item> {
    return Promise.resolve(item);
  }

  public delete(itemId: number): Promise<void> {
    return Promise.resolve();
  }

  public getById(itemId: number): Promise<Item> {
    return this.getItems().then((items) => items.filter((item) => item.Id === itemId)[0]);
  }
}
