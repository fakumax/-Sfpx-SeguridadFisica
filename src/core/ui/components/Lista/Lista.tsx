import * as React from 'react';
import {
  DetailsList,
  IColumn,
  SelectionMode,
  DetailsListLayoutMode,
  Selection,
  ISelection,
  CheckboxVisibility,
} from '@fluentui/react';

import { Item } from '../../../entities';
import styles from './Lista.module.scss';
import { ItemInvolucrados } from '../../../entities/Involucrados';
import TooltipButton from '../TooltipButton/TooltipButton';

export interface IListProps {
  items: Array<ItemInvolucrados>;
  columns?: Array<IColumn>;
  onItemSelected?: (selectedItem?: ItemInvolucrados) => void;
  key?: string;
  className?: string;
  loose?: boolean;
  limpiar?:boolean;
}



function copyAndSort<T>(
  itemsToSort: T[],
  key: string,
  isSortedDescending?: boolean
): T[] {
  return [...itemsToSort].sort((a: T, b: T) => {
    let sortEx = isSortedDescending ? a[key] < b[key] : a[key] > b[key];
    return sortEx ? 1 : -1;
  });
}

const Lista: React.FunctionComponent<IListProps> = ({
  items,
  key,
  columns,
  onItemSelected,
  className,
  loose,
  limpiar,
}) => {
  const [sortingColumn, setSortingColumn] = React.useState<string>('Id');
  const [sortDescending, setSortDescending] = React.useState<boolean>(false);

  const handleColumnClick = (
    ev: React.MouseEvent<HTMLElement>,
    column: IColumn
  ): void => {
    setSortingColumn(column.fieldName);
    setSortDescending(!column.isSortedDescending);
  };

  React.useEffect(() => {
    selection.setIndexSelected(1,false,false);
	}, [limpiar]);

  const [selection, setSelection] = React.useState(		
		new Selection({ 
			onSelectionChanged: () => {
				const selectedItem = selection.getSelection(); 
				if(selectedItem[0] !== undefined){
					onItemSelected(selectedItem[0] as ItemInvolucrados);
				}
			}
		})
	)

  const getItemKey = (item: ItemInvolucrados): string => `ListItem${item.IDAlerta}`;

  const listKey: string = key || items.map((item) => item.IDAlerta).join('');

  return (
    <DetailsList
      items={copyAndSort<ItemInvolucrados>(items, sortingColumn, sortDescending)}
      setKey={listKey}
      getKey={getItemKey}
      compact={!loose}
      columns={columns.map((column) =>
        column.fieldName === sortingColumn
          ? {
              ...column,
              isSorted: true,
              isSortedDescending: sortDescending,
              onColumnClick: handleColumnClick,
            }
          : { ...column, isSorted: false, onColumnClick: handleColumnClick }
      )}
      selectionMode={onItemSelected ? SelectionMode.single : SelectionMode.none}
      layoutMode={DetailsListLayoutMode.justified}
      isHeaderVisible={true}
      selection={selection}
      className={`${styles.list} ${className}`}
      checkboxVisibility={CheckboxVisibility.hidden}
      listProps={onItemSelected ? { className: styles.items } : undefined}
    />
  );
};

export default Lista;
