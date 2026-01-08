import { Item } from '../entities';
import ItemDatasource from './ItemDatasource';
import ItemMock from './ItemMock';
import useDatasource from './useDatasource';

function useItemDatasource(listTitle: string) {
	return useDatasource<Item>(new ItemDatasource(listTitle), new ItemMock());
}

export default useItemDatasource;
