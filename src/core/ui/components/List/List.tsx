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
import moment from 'moment';

import { Item } from '../../../entities';
import styles from './List.module.scss';

export interface IListProps {
  items: Array<Item>;
  columns?: Array<IColumn>;
  onItemSelected?: (selectedItem?: Item) => void;
  key?: string;
  className?: string;
  loose?: boolean;
}

const defaultColumns: Array<IColumn> = [
  {
    key: 'Id',
    name: 'Id',
    fieldName: 'Id',
    minWidth: 25,
    maxWidth: 50,
    isRowHeader: true,
    isResizable: false,
    isSorted: false,
    isSortedDescending: false,
    data: 'string',
    isPadded: false,
  },
  {
    key: 'Titulo',
    name: 'Titulo',
    fieldName: 'Titulo',
    minWidth: 100,
    maxWidth: 100,
    isRowHeader: true,
    isResizable: false,
    isSorted: false,
    isSortedDescending: false,
    data: 'string',
    isPadded: true,
  },
  {
    key: 'Fecha',
    name: 'Fecha',
    fieldName: 'FechaCreacion',
    minWidth: 100,
    maxWidth: 100,
    isRowHeader: true,
    isResizable: false,
    isSorted: false,
    isSortedDescending: false,
    data: 'string',
    isPadded: true,
    onRender: (item) => moment(item.FechaCreacion).format('DD/MM/YYYY'),
  },
];

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

const List: React.FunctionComponent<IListProps> = ({
  items,
  key,
  columns = defaultColumns,
  onItemSelected,
  className,
  loose,
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

  const selection: ISelection = new Selection({
    onSelectionChanged: () => {
      const [selectedItem] = selection.getSelection();
      if (selectedItem) {
        onItemSelected(selectedItem as Item);
      }
    },
  });

  const getItemKey = (item: Item): string => `ListItem${item.Id}`;

  const listKey: string = key || items.map((item) => item.Id).join('');

  return (
    <DetailsList
      items={copyAndSort<Item>(items, sortingColumn, sortDescending)}
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
      selection={onItemSelected ? selection : undefined}
      className={`${styles.list} ${className}`}
      checkboxVisibility={CheckboxVisibility.hidden}
      listProps={onItemSelected ? { className: styles.items } : undefined}
    />
  );
};

export default List;
