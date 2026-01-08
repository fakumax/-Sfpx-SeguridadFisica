import * as React from 'react';
import { DefaultButton, Stack, Text, Modal, Selection } from '@fluentui/react';
import { useCustomFormContext } from '../../../common/context/CustomFormProvider';
import styles from './Antecedentes.module.scss';
import EmptyDataSVG from '../../../assets/img-sin-datos.svg';
import ListaModal from './ListModal/ListaModal';
import ListResult from './ListResult/ListResult';
import { IAlerta } from '../../../../../core/interfaces/IAlerta';
import {
  getAlertasByRegion,
  getRegistrosByIDAlerta,
} from '../../../../../core/api/services/antecedenteService';
import { IComentario } from '../../../../../core/interfaces/IComentario';
import { IDatoComplementario } from '../../../../../core/interfaces/IDatoComplementario';
import { IInvolucrado } from '../../../../../core/interfaces/IInvolucrado';
import { IImpacto } from '../../../../../core/interfaces/IImpacto';
import {
  LIST_NAMES,
  camposSeleccionadosDeListaComentarios,
  camposSeleccionadosDeListaDatosComplementarios,
  camposSeleccionadosDeListaInvolucrados,
  camposSeleccionadosDeListaImpactos,
} from '../../../../../core/utils/Constants';

const Antecedentes = ({ context, alertData }) => {
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [items, setItems] = React.useState<IAlerta[]>([]);
  const { setValue, isDisabled, watch } = useCustomFormContext();
  const [comentariosDeAlertasPrefiltradas, setComentariosDeAlertasPrefiltradas] =
    React.useState<IComentario[]>([]);
  const [
    datosComplementariosDeAlertasPrefiltradas,
    setDatosComplementariosDeAlertasPrefiltradas,
  ] = React.useState<IDatoComplementario[]>([]);
  const [involucradosDeAlertasPrefiltradas, setInvolucradosDeAlertasPrefiltradas] =
    React.useState<IInvolucrado[]>([]);
  const [impactosDeAlertasPrefiltradas, setImpactosDeAlertasPrefiltradas] =
    React.useState<IImpacto[]>([]);

  const fetchItemsByIds = (ids) => {
    return ids.split(';').map((id) => ({
      Id: id,
    }));
  };

  const selection = React.useMemo(
    () =>
      new Selection({
        onSelectionChanged: () => {
          const selectedItems = selection.getSelection();
          console.log('Items seleccionados dentro de onSelectionChanged:', selectedItems);
        },
      }),
    [],
  );
  React.useEffect(() => {
    if (alertData) {
      const currentActivo = watch('Activo');
      const currentUnidadDeNegocio = watch('UnidadDeNegocio');
      getAlertasByRegion(alertData, currentUnidadDeNegocio, currentActivo).then(
        (response) => {
          const itemsWithKeys = response.map((alerta) => ({
            ...alerta,
            key: alerta.Id.toString(),
          }));

          setItems(itemsWithKeys);
          if (alertData.Antecedentes) {
            const antecedenteIds = fetchItemsByIds(alertData.Antecedentes);

            const antecedenteList: number[] = antecedenteIds.map((element) =>
              parseInt(element.Id),
            );

            const initialItems = response.filter((item) =>
              antecedenteList.includes(item.Id),
            );
            setSelectedItems(initialItems);
            setValue('AlertaDatos.Antecedentes', antecedenteIds);
            setValue('AlertaDatos.AntecedentesCompleto', initialItems);
          }
        },
      );
    }
  }, [alertData, watch('UnidadDeNegocio'), watch('Activo')]);

  React.useEffect(() => {
    if (items && items.length > 0) {
      (async () => {
        setComentariosDeAlertasPrefiltradas(
          await getRegistrosByIDAlerta(
            items,
            LIST_NAMES.COMENTARIOS,
            camposSeleccionadosDeListaComentarios,
          ),
        );

        setDatosComplementariosDeAlertasPrefiltradas(
          await getRegistrosByIDAlerta(
            items,
            LIST_NAMES.DATOSCOMPLEMENTARIOS,
            camposSeleccionadosDeListaDatosComplementarios,
          ),
        );

        setInvolucradosDeAlertasPrefiltradas(
          await getRegistrosByIDAlerta(
            items,
            LIST_NAMES.INVOLUCRADOS,
            camposSeleccionadosDeListaInvolucrados,
          ),
        );

        setImpactosDeAlertasPrefiltradas(
          await getRegistrosByIDAlerta(
            items,
            LIST_NAMES.IMPACTOS,
            camposSeleccionadosDeListaImpactos,
          ),
        );
      })();
    }
  }, [items]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSave = () => {
    const selectedItems = selection.getSelection() as IAlerta[];
    const elementsToSave = items.filter((item) =>
      selectedItems.some((selected) => selected.Id == item.Id),
    );
    handleItemsSelected(elementsToSave);
  };

  const handleItemsSelected = (items) => {
    setSelectedItems(items);
    setValue('AlertaDatos.Antecedentes', items);
    setValue('AlertaDatos.AntecedentesCompleto', items);
    setIsModalOpen(false);
  };

  const handleRemoveItem = (itemId) => {
    selection.setKeySelected(itemId.toString(), false, false);
    const updatedItems = selectedItems.filter((item) => item.Id !== itemId);
    setSelectedItems(updatedItems);
    setValue('AlertaDatos.Antecedentes', updatedItems);
    setValue('AlertaDatos.AntecedentesCompleto', updatedItems);
  };

  const handleRestoreItems = () => {
    const savedItems = getSavedItems();
    const itemsToDeselect = items.filter((item) => !savedItems.includes(item.Id));
    itemsToDeselect.forEach((item: any) => {
      selection.setKeySelected(item.key, false, false);
    });
  };

  const getSavedItems = (): number[] => {
    return selectedItems.map((item) => item.Id);
  };

  return (
    <>
      <Stack horizontal horizontalAlign="end">
        {!isDisabled && (
          <DefaultButton
            text="Editar"
            onClick={openModal}
            className={styles.buttonStyle}
            iconProps={{ iconName: 'Edit' }}
          />
        )}
      </Stack>
      <Modal
        isOpen={isModalOpen}
        onDismiss={closeModal}
        isBlocking={false}
        containerClassName={styles.containerModal}
      >
        <Stack className={styles.modalButtons} horizontal tokens={{ childrenGap: 10 }}>
          <DefaultButton
            onClick={handleSave}
            text="Guardar"
            className={styles.buttonStyleModal}
          />
          <DefaultButton
            text="Salir"
            onClick={() => {
              closeModal();
              handleRestoreItems();
            }}
          />
        </Stack>
        <ListaModal
          selection={selection}
          items={items}
          defaultItems={selectedItems}
          comentariosDeAlertasPrefiltradas={comentariosDeAlertasPrefiltradas}
          datosComplementariosDeAlertasPrefiltradas={
            datosComplementariosDeAlertasPrefiltradas
          }
          involucradosDeAlertasPrefiltradas={involucradosDeAlertasPrefiltradas}
          impactosDeAlertasPrefiltradas={impactosDeAlertasPrefiltradas}
        />
      </Modal>

      <div>
        {selectedItems.length > 0 ? (
          <ListResult
            items={selectedItems}
            onRemoveItem={handleRemoveItem}
            isDisabled={isDisabled}
          />
        ) : (
          <Stack
            horizontal
            horizontalAlign="center"
            verticalAlign="center"
            tokens={{ childrenGap: 10 }}
          >
            <img
              src={EmptyDataSVG}
              alt="No data"
              style={{ height: 200, width: 'auto' }}
            />
            <Text styles={{ root: { fontWeight: 'bold', fontSize: 18 } }}>
              No tenés antecedentes cargados.
            </Text>
          </Stack>
        )}
      </div>
    </>
  );
};

export { Antecedentes };
