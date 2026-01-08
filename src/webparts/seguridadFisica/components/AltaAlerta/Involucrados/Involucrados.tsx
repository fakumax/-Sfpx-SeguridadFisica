import * as React from 'react';
import {
  DefaultButton,
  IButtonStyles,
  IChoiceGroupOption,
  IColumn,
  Stack,
} from '@fluentui/react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { TooltipButton } from '../../../../../core';
import {
  fetchRelacionChoices,
  fetchRelacionEmpresaChoices,
} from '../../../../../core/api/services/datosBaseService';
import {
  InvolucradosClass,
  ItemInvolucrados,
} from '../../../../../core/entities/Involucrados';
import SPODataProvider from '../../../../../core/pnp/sp/SharePointDataProvider';
import ItemPanelInvolucrados from '../../../../../core/ui/components/ItemPanelInvolucrados/ItemPanelInvolucrados';
import Lista from '../../../../../core/ui/components/Lista/Lista';
import { LIST_NAMES } from '../../../../../core/utils/Constants';
import { useCustomFormContext } from '../../../common/context/CustomFormProvider';
import styles from './Involucrados.module.scss';

interface InvolucradosProps {
  alertData: any;
  context: WebPartContext;
  involucradosData: ItemInvolucrados[];
  setInvolucradosData: React.Dispatch<React.SetStateAction<ItemInvolucrados[]>>;
  involucradosEliminarData: ItemInvolucrados[];
  setInvolucradosEliminarData: React.Dispatch<React.SetStateAction<ItemInvolucrados[]>>;
}
const Involucrados: React.FC<InvolucradosProps> = ({
  alertData,
  context,
  involucradosData,
  setInvolucradosData,
  involucradosEliminarData,
  setInvolucradosEliminarData,
}) => {
  const {
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useFormContext();
  const { isDisabled } = useCustomFormContext();
  const { id } = useParams<{ id: string }>();
  const [involucrado, setInvolucrado] = React.useState<ItemInvolucrados>();
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);
  const [isPanelOpenEdit, setIsPanelOpenEdit] = React.useState(false);
  const [isPanelOpenVer, setIsPanelOpenVer] = React.useState(false);
  const [statePosicion, setPosicion] = React.useState(0);
  const [stateLimpiar, setLimpiar] = React.useState(false);
  const [stateChoiceRelacion, setChoiceRelacion] = React.useState<IChoiceGroupOption[]>(
    [],
  );
  const [stateChoiceRelacionEmpresa, setChoiceRelacionEmpresa] = React.useState<
    IChoiceGroupOption[]
  >([]);

  React.useEffect(() => {
    let filtro = `IDAlerta eq '${id}'`;
    const archivo = SPODataProvider.getListItems(LIST_NAMES.INVOLUCRADOS, '', filtro, '');
    archivo.then((response) => {
      const ListaArchivosINI: ItemInvolucrados[] = [];
      let Posicion = 0;
      response.forEach((data) => {
        Posicion++;
        let inv = new InvolucradosClass();
        inv.Nombre = data['Nombre'];
        inv.Posicion = Posicion;
        inv.Apellido = data['Apellido'];
        inv.TelefonoInvolucrado = data['TelefonoInvolucrado'];
        inv.DNIInvolucrado = data['DNIInvolucrado'];
        inv.RelacionConIncidente = data['RelacionConIncidente'];
        inv.RelacionConEmpresa = data['RelacionConEmpresa'];
        inv.NombreContratista = data['NombreContratista'];
        inv.ManejabaVehiculo = data['ManejabaVehiculo'];
        inv.MarcaVehiculo = data['MarcaVehiculo'];
        inv.ModeloVehiculo = data['ModeloVehiculo'];
        inv.ColorVehiculo = data['ColorVehiculo'];
        inv.PatenteVehiculo = data['PatenteVehiculo'];
        inv.Estado = 0;
        inv.Id = data['ID'];
        ListaArchivosINI.push(inv);
      });
      setPosicion(Posicion);
      setInvolucradosData([...ListaArchivosINI]);
      setValue('InvolucradosActa', ListaArchivosINI ? ListaArchivosINI : []);
    });

    const choices = fetchRelacionChoices();
    choices.then((res) => {
      setChoiceRelacion(res);
    });
    const choiceEmpresa = fetchRelacionEmpresaChoices();
    choiceEmpresa.then((res) => {
      setChoiceRelacionEmpresa(res);
    });
  }, [id, setValue, setInvolucradosData]);

  React.useEffect(() => {
    if (involucradosData?.length > 0) {
      setValue('Involucrados', involucradosData);
    }
  }, [involucradosData, setValue]);

  const handleClickAdd = () => {
    setInvolucrado(new InvolucradosClass());
    setIsPanelOpen(true);
  };
  const handleNewItemClose = () => {
    setIsPanelOpen(false);
  };
  const handleNewItemSave = (item: ItemInvolucrados) => {
    let Posicion = statePosicion + 1;
    item.Estado = 1;
    item.Posicion = Posicion;
    let involucradoData = item;
    let newInvolucrados = [...involucradosData, ...[involucradoData]];
    setInvolucradosData([...involucradosData, ...[involucradoData]]);
    setValue('Involucrados', newInvolucrados);
    setIsPanelOpen(false);
    setPosicion(Posicion);
  };
  const handleEditItemSave = (item: ItemInvolucrados) => {
    let currentSelect = involucrado;
    let currentInvolucrados = [...involucradosData];

    const index = currentInvolucrados.findIndex(
      (res) => res.Posicion === currentSelect.Posicion,
    );

    if (index !== -1) {
      if (currentInvolucrados[index].Id) {
        currentInvolucrados[index].Estado = 2;
      } else {
        currentInvolucrados[index].Estado = 1;
      }

      currentInvolucrados[index] = {
        ...currentInvolucrados[index],
        Nombre: item.Nombre,
        Apellido: item.Apellido,
        TelefonoInvolucrado: item.TelefonoInvolucrado,
        DNIInvolucrado: item.DNIInvolucrado,
        RelacionConIncidente: item.RelacionConIncidente,
        RelacionConEmpresa: item.RelacionConEmpresa,
        NombreContratista: item.NombreContratista,
        MarcaVehiculo: item.MarcaVehiculo,
        ModeloVehiculo: item.ModeloVehiculo,
        ColorVehiculo: item.ColorVehiculo,
        PatenteVehiculo: item.PatenteVehiculo,
      };
    }

    setInvolucradosData([...currentInvolucrados]);
    setValue('Involucrados', currentInvolucrados);
    setIsPanelOpenEdit(false);
  };

  const handleEditItemClose = () => {
    setIsPanelOpenEdit(false);
  };
  const handleVerItemClose = () => {
    setIsPanelOpenVer(false);
  };
  const btnVER = (item: ItemInvolucrados) => {
    setInvolucrado(item);
    setIsPanelOpenVer(true);
  };
  const btnEDITAR = (item: ItemInvolucrados) => {
    setInvolucrado(item);
    setIsPanelOpenEdit(true);
  };
  const btnELIMINAR = (itemToDelete: ItemInvolucrados) => {
    if (!itemToDelete) return;

    const newInvolucrados = involucradosData.filter(
      (res) => res.Posicion !== itemToDelete.Posicion,
    );

    if (itemToDelete.Id) {
      const itemToAdd = { ...itemToDelete, Estado: 3 };

      const filteredEliminados = involucradosEliminarData.filter(
        (item) => item.Id !== itemToDelete.Id && item.Estado === 3,
      );

      const updatedEliminados = [...filteredEliminados, itemToAdd];

      setInvolucradosEliminarData(updatedEliminados);
      setValue('InvolucradosEliminar', updatedEliminados);
    }

    setInvolucradosData(newInvolucrados);
    setValue('Involucrados', newInvolucrados);
    setLimpiar((prev) => !prev);
  };

  function onItemSelected(selectedItem: ItemInvolucrados): void {
    if (selectedItem) {
      setInvolucrado(selectedItem);
    }
  }
  const ButtonStylesEditar: IButtonStyles = {
    root: {
      display: isDisabled ? 'none' : 'block',
    },
  };
  const ButtonStylesEliminar: IButtonStyles = {
    root: {
      display: isDisabled ? 'none' : 'block',
    },
  };
  const defaultColumns: Array<IColumn> = [
    {
      key: 'Nombre',
      name: 'Nombre',
      fieldName: 'Nombre',
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
      key: 'Apellido',
      name: 'Apellido',
      fieldName: 'Apellido',
      minWidth: 100,
      maxWidth: 150,
      isRowHeader: true,
      isResizable: false,
      isSorted: false,
      isSortedDescending: false,
      data: 'string',
      isPadded: true,
    },

    {
      key: 'DNIInvolucrado',
      name: 'DNI',
      fieldName: 'DNIInvolucrado',
      minWidth: 100,
      maxWidth: 150,
      isRowHeader: true,
      isResizable: false,
      isSorted: false,
      isSortedDescending: false,
      data: 'string',
      isPadded: true,
    },
    {
      key: '',
      name: '',
      fieldName: '',
      minWidth: 100,
      maxWidth: 100,
      isRowHeader: true,
      isResizable: true,
      onRender: (item: ItemInvolucrados) => {
        return <TooltipButton iconName="View" title="VER" onClick={() => btnVER(item)} />;
      },
    },
    {
      key: '',
      name: '',
      fieldName: '',
      minWidth: 100,
      maxWidth: 100,
      isRowHeader: true,
      isResizable: true,
      onRender: (item: ItemInvolucrados) => {
        return (
          <TooltipButton
            iconName="Edit"
            title="EDITAR"
            onClick={() => btnEDITAR(item)}
            className={ButtonStylesEditar}
          />
        );
      },
    },
    {
      key: '',
      name: '',
      fieldName: '',
      minWidth: 100,
      maxWidth: 100,
      isRowHeader: true,
      isResizable: true,
      onRender: (item: ItemInvolucrados) => {
        return (
          <TooltipButton
            iconName="Delete"
            title="ELIMINAR"
            onClick={() => btnELIMINAR(item)}
            className={ButtonStylesEliminar}
          />
        );
      },
    },
  ];

  return (
    <>
      <Stack horizontal horizontalAlign="end">
        {!isDisabled && (
          <DefaultButton
            text="Agregar"
            onClick={handleClickAdd}
            className={styles.buttonStyle}
            iconProps={{ iconName: 'Add' }}
          />
        )}
      </Stack>
      <div>
        {involucradosData && involucradosData.length > 0 && (
          <Lista
            items={involucradosData}
            columns={defaultColumns}
            onItemSelected={onItemSelected}
            limpiar={stateLimpiar}
          />
        )}
      </div>
      <ItemPanelInvolucrados
        item={involucrado}
        ChoiceRelacion={stateChoiceRelacion}
        ChoiceRelacionEmpresa={stateChoiceRelacionEmpresa}
        formName="Involucrados-item"
        isOpen={isPanelOpen}
        isVer={false}
        title="Involucrado"
        onSave={handleNewItemSave}
        onCancel={handleNewItemClose}
        cancelLabel="Cancelar"
        saveLabel="Guardar"
        id={undefined}
      />
      <ItemPanelInvolucrados
        item={involucrado}
        ChoiceRelacion={stateChoiceRelacion}
        ChoiceRelacionEmpresa={stateChoiceRelacionEmpresa}
        formName="Involucrados-item"
        isOpen={isPanelOpenEdit}
        isVer={false}
        title="Involucrado"
        onSave={handleEditItemSave}
        onCancel={handleEditItemClose}
        cancelLabel="Cancelar"
        saveLabel="Guardar"
        id={undefined}
      />
      <ItemPanelInvolucrados
        item={involucrado}
        ChoiceRelacion={stateChoiceRelacion}
        ChoiceRelacionEmpresa={stateChoiceRelacionEmpresa}
        formName="Involucrados-item"
        isOpen={isPanelOpenVer}
        isVer={true}
        title="Involucrado"
        onSave={handleEditItemSave}
        onCancel={handleVerItemClose}
        cancelLabel="Salir"
        saveLabel=""
        id={undefined}
      />
    </>
  );
};
export { Involucrados };
