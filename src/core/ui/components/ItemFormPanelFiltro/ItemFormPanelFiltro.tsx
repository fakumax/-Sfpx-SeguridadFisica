import * as React from 'react';
import { TextField } from '@fluentui/react';

import { Item, FormPanel } from '../../../';
import styles from './ItemFormPanelFiltro.module.scss';

export interface IItemFormPanelProps {
  item?: Item;
  onSave: (item: Item) => void;
  onCancel: () => void;
  isOpen: boolean;
  title: string;
  formName: string;
  className?: string;
}

const ItemFormPanelFiltro: React.FunctionComponent<IItemFormPanelProps> = ({
  item = new Item({}),
  onSave,
  onCancel,
  className,
  isOpen,
  title,
  formName,
}) => {
  const handleSave = (event: React.FormEvent<HTMLFormElement>) =>
    onSave(
      new Item({
        Id: item.Id,
        Title: event.target['title'].value,
        Created: item.FechaCreacion,
      }),
    );

  return (
    <FormPanel
      title={title}
      isOpen={isOpen}
      formName={formName}
      cancelLabel="Cancelar"
      saveLabel="Guardar"
      onCancel={onCancel}
      onSave={handleSave}
      className={`${styles.ItemFormPanelFiltro} ${className}`}
    >
      <TextField
        name="title"
        defaultValue={item.Titulo}
        label="Título"
        required
        className={styles.input}
      />
    </FormPanel>
  );
};

export default ItemFormPanelFiltro;
