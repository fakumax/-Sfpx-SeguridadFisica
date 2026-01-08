import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, IColumn, IconButton } from '@fluentui/react';
import { Link } from 'react-router-dom';

interface ListResultProps {
  items: any[];
  onRemoveItem: (itemId: string) => void;
  isDisabled: boolean;
}

const ListResult: React.FC<ListResultProps> = ({ items, onRemoveItem, isDisabled }) => {
  const showDeleteButton = !isDisabled;

  const columns: IColumn[] = [
    {
      key: 'column1',
      name: 'ID de Alerta',
      fieldName: 'Id',
      minWidth: 50,
      maxWidth: 80,
      isResizable: true,
      onRender: (item) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Link to={`/alerta/${item.Id}`} target="_blank" rel="noopener noreferrer">
            {item.Id}
          </Link>
        </div>
      ),
    },

    {
      key: 'column2',
      name: 'Categoría Principal',
      fieldName: 'CategoriaPrincipal',
      minWidth: 130,
      maxWidth: 160,
      isResizable: true,
      onRender: (item) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          {item.CategoriaPrincipal.Title}
        </div>
      ),
    },
    {
      key: 'column3',
      name: 'Categoría Secundaria',
      fieldName: 'CategoriaSecundaria',
      minWidth: 130,
      maxWidth: 160,
      isResizable: true,
      onRender: (item) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          {item.CategoriaSecundaria.Title}
        </div>
      ),
    },
    {
      key: 'column4',
      name: 'Instalación / Otros',
      fieldName: 'Instalacion',
      minWidth: 100,
      maxWidth: 140,
      isResizable: true,
      onRender: (item) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          {item.Instalacion}
        </div>
      ),
    },
    {
      key: 'column5',
      name: 'Fecha',
      fieldName: 'FechaHoraIncidente',
      minWidth: 50,
      maxWidth: 100,
      isResizable: true,
      onRender: (item) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          {new Date(item.FechaHoraIncidente).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'column6',
      name: '',
      fieldName: 'delete',
      minWidth: 50,
      maxWidth: 50,
      isResizable: false,
      onRender: (item) =>
        showDeleteButton && (
          <IconButton
            iconProps={{ iconName: 'Delete', styles: { root: { color: 'red' } } }}
            title="Eliminar"
            ariaLabel="Eliminar"
            onClick={() => onRemoveItem(item.Id)}
          />
        ),
    },
  ];

  return (
    <DetailsList
      items={items}
      columns={columns}
      setKey="set"
      layoutMode={DetailsListLayoutMode.fixedColumns}
      selectionPreservedOnEmptyClick={true}
      selectionMode={0}
    />
  );
};

export default ListResult;
