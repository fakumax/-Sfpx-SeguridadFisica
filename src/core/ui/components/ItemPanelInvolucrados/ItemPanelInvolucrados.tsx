import {
  ChoiceGroup,
  IChoiceGroupOption,
  Label,
  MessageBar,
  MessageBarType,
  Stack,
  TextField,
} from '@fluentui/react';
import * as React from 'react';
import { ItemInvolucrados } from '../../../entities/Involucrados';
import { RelationEmpresa } from '../../../utils/Constants';
import FormPanelInvolucrados from '../FormPanelInvolucrados/FormPanelInvolucrados';
import styles from './ItemPanelInvolucrados.module.scss';

export interface IItemFormPanelProps {
  item: ItemInvolucrados;
  ChoiceRelacion: IChoiceGroupOption[];
  ChoiceRelacionEmpresa: IChoiceGroupOption[];
  onSave: (item: ItemInvolucrados) => void;
  onCancel: () => void;
  cancelLabel?: string;
  saveLabel?: string;
  isOpen: boolean;
  title: string;
  formName: string;
  isVer?: boolean;
  className?: string;
  id?: string;
}
export interface ILista {
  key: number;
  text: string;
}
const ItemPanelInvolucrados: React.FunctionComponent<IItemFormPanelProps> = ({
  item,
  ChoiceRelacion,
  ChoiceRelacionEmpresa,
  onSave,
  onCancel,
  cancelLabel,
  saveLabel,
  className,
  isOpen,
  title,
  formName,
  isVer,
  id,
}) => {
  const [isDisabledcontratista, setisDisabledcontratista] = React.useState<boolean>(true);
  const [isDisabledGuardar, setisDisabledGuardar] = React.useState<boolean>(false);
  const [stateInvolucrado, setInvolucrado] = React.useState<ItemInvolucrados>({
    Nombre: undefined,
    Apellido: undefined,
    TelefonoInvolucrado: undefined,
    DNIInvolucrado: undefined,
    RelacionConIncidente: undefined,
    RelacionConEmpresa: undefined,
    NombreContratista: undefined,
    ManejabaVehiculo: undefined,
    MarcaVehiculo: undefined,
    ModeloVehiculo: undefined,
    ColorVehiculo: undefined,
    PatenteVehiculo: undefined,
    IDAlerta: undefined,
  });
  const handleCancel = () => {
    setInvolucrado({
      ...stateInvolucrado,
      Nombre: undefined,
      Apellido: undefined,
      TelefonoInvolucrado: undefined,
      DNIInvolucrado: undefined,
      RelacionConIncidente: undefined,
      RelacionConEmpresa: undefined,
      NombreContratista: undefined,
      ManejabaVehiculo: undefined,
      MarcaVehiculo: undefined,
      ModeloVehiculo: undefined,
      ColorVehiculo: undefined,
      PatenteVehiculo: undefined,
      IDAlerta: undefined,
    });
    setisDisabledGuardar(false);
    onCancel();
  };
  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    let bloquear = validarCargado();
    if (!bloquear) {
      setInvolucrado({
        ...stateInvolucrado,
        Nombre: undefined,
        Apellido: undefined,
        TelefonoInvolucrado: undefined,
        DNIInvolucrado: undefined,
        RelacionConIncidente: undefined,
        RelacionConEmpresa: undefined,
        NombreContratista: undefined,
        ManejabaVehiculo: undefined,
        MarcaVehiculo: undefined,
        ModeloVehiculo: undefined,
        ColorVehiculo: undefined,
        PatenteVehiculo: undefined,
        IDAlerta: undefined,
      });
      setisDisabledGuardar(false);
      onSave(stateInvolucrado);
    }
  };
  React.useEffect(() => {
    if (item) {
      setInvolucrado({
        ...stateInvolucrado,
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
        Id: item.Id,
      });
      if (item.RelacionConEmpresa === RelationEmpresa.Contratado) {
        setisDisabledcontratista(false);
      } else {
        setisDisabledcontratista(true);
      }
    } else {
      setInvolucrado({
        ...stateInvolucrado,
        Nombre: undefined,
        Apellido: undefined,
        TelefonoInvolucrado: undefined,
        DNIInvolucrado: undefined,
        RelacionConIncidente: undefined,
        RelacionConEmpresa: undefined,
        NombreContratista: undefined,
        ManejabaVehiculo: undefined,
        MarcaVehiculo: undefined,
        ModeloVehiculo: undefined,
        ColorVehiculo: undefined,
        PatenteVehiculo: undefined,
        IDAlerta: undefined,
      });
    }
  }, [isOpen]);
  const validarCargado = () => {
    let Nombre = stateInvolucrado.Nombre !== undefined ? true : false;
    let Apellido = stateInvolucrado.Apellido !== undefined ? true : false;
    let TelefonoInvolucrado =
      stateInvolucrado.TelefonoInvolucrado !== undefined ? true : false;
    let DNIInvolucrado = stateInvolucrado.DNIInvolucrado !== undefined ? true : false;
    let RelacionConIncidente =
      stateInvolucrado.RelacionConIncidente !== undefined ? true : false;
    let RelacionConEmpresa = stateInvolucrado.RelacionConEmpresa !== undefined ? true : false;
    let NombreContratista =
      stateInvolucrado.NombreContratista !== undefined ? true : false;
    let MarcaVehiculo = stateInvolucrado.MarcaVehiculo !== undefined ? true : false;
    let ModeloVehiculo = stateInvolucrado.ModeloVehiculo !== undefined ? true : false;
    let ColorVehiculo = stateInvolucrado.ColorVehiculo !== undefined ? true : false;
    let PatenteVehiculo = stateInvolucrado.PatenteVehiculo !== undefined ? true : false;
    if (
      Nombre ||
      Apellido ||
      TelefonoInvolucrado ||
      DNIInvolucrado ||
      RelacionConIncidente ||
      RelacionConEmpresa ||
      NombreContratista ||
      MarcaVehiculo ||
      ModeloVehiculo ||
      ColorVehiculo ||
      PatenteVehiculo
    ) {
      setisDisabledGuardar(false);
      return false;
    } else {
      setisDisabledGuardar(true);
      return true;
    }
  };
  return (
    <FormPanelInvolucrados
      title={title}
      isOpen={isOpen}
      formName={formName}
      cancelLabel={cancelLabel}
      saveLabel={saveLabel}
      onCancel={handleCancel}
      onSave={handleSave}
      className={`${styles.FormPanelInvolucrados} ${className}`}
      isSaveDisabled={false}
    >
      <div className={styles.gridContainer4}>
        <div style={{ width: '100%' }}>
          {item !== undefined && (
            <div className={styles.orderField}>
              <label className={styles.requiredLabel}>Nombre/s</label>
              <TextField
                className={styles.textField}
                onChange={(
                  _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                  newValue?: string,
                ) => {
                  setInvolucrado({
                    ...stateInvolucrado,
                    Nombre: newValue?.slice(0, 30) || null,
                  });
                  setisDisabledGuardar(false);
                }}
                maxLength={30}
                value={stateInvolucrado?.Nombre || ''}
                autoComplete="off"
                disabled={isVer}
              />
            </div>
          )}
        </div>
        <div style={{ width: '100%' }}>
          {item !== undefined && (
            <div className={styles.orderField}>
              <label className={styles.requiredLabel}>Apellido/s</label>
              <TextField
                className={styles.textField}
                onChange={(
                  _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                  newValue?: string,
                ) => {
                  setInvolucrado({
                    ...stateInvolucrado,
                    Apellido: newValue?.slice(0, 30) || null,
                  });
                  setisDisabledGuardar(false);
                }}
                maxLength={30}
                value={stateInvolucrado?.Apellido || ''}
                autoComplete="off"
                disabled={isVer}
              />
            </div>
          )}
        </div>
        <div style={{ width: '100%' }}>
          {item !== undefined && (
            <div className={styles.orderField}>
              <label className={styles.requiredLabel}>Teléfono</label>
              <TextField
                className={styles.textField}
                disabled={isVer}
                onChange={(
                  _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                  newValue?: string,
                ) => {
                  const numericValue = newValue?.replace(/\D/g, '').slice(0, 13);
                  setInvolucrado({
                    ...stateInvolucrado,
                    TelefonoInvolucrado: numericValue || null,
                  });
                  setisDisabledGuardar(false);
                }}
                maxLength={13}
                value={stateInvolucrado?.TelefonoInvolucrado || ''}
                autoComplete="off"
              />
            </div>
          )}
        </div>
        <div style={{ width: '100%' }}>
          {item !== undefined && (
            <div className={styles.orderField}>
              <label className={styles.requiredLabel}>DNI</label>
              <TextField
                className={styles.textField}
                disabled={isVer}
                onChange={(
                  _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                  newValue?: string,
                ) => {
                  const numericValue = newValue?.replace(/\D/g, '').slice(0, 9);
                  setInvolucrado({
                    ...stateInvolucrado,
                    DNIInvolucrado: numericValue || null,
                  });
                  setisDisabledGuardar(false);
                }}
                maxLength={9}
                value={stateInvolucrado?.DNIInvolucrado || ''}
                autoComplete="off"
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles.gridContainer3}>
        <div>
          <Stack tokens={{ childrenGap: 20 }} styles={{ root: { marginTop: '0px' } }}>
            <div key="Relacion">
              <Stack horizontal verticalAlign="center">
                <label>Relación con el incidente</label>
              </Stack>
              <ChoiceGroup
                options={ChoiceRelacion}
                disabled={isVer}
                styles={{
                  root: { margin: '10px 10px 0px 0px' },
                  flexContainer: [
                    {
                      display: 'flex',
                      selectors: {
                        '.ms-ChoiceField': {
                          margin: '0px 10px',
                        },
                      },
                    },
                  ],
                }}
                onChange={(
                  ev: React.FormEvent<HTMLInputElement>,
                  option: IChoiceGroupOption,
                ) => {
                  setInvolucrado({
                    ...stateInvolucrado,
                    RelacionConIncidente: option.text,
                  });
                  setisDisabledGuardar(false);
                }}
                selectedKey={
                  stateInvolucrado != undefined
                    ? stateInvolucrado.RelacionConIncidente
                    : ''
                }
              />
            </div>
          </Stack>
        </div>
        <div>
          <Stack tokens={{ childrenGap: 20 }} styles={{ root: { marginTop: '0px' } }}>
            <div key="Relacion">
              <Stack horizontal verticalAlign="center">
                <label>Relación con la Empresa</label>
              </Stack>
              <ChoiceGroup
                disabled={isVer}
                options={ChoiceRelacionEmpresa}
                styles={{
                  root: { margin: '10px 10px 0px 0px' },
                  flexContainer: [
                    {
                      display: 'flex',
                      selectors: {
                        '.ms-ChoiceField': {
                          margin: '0px 10px',
                        },
                      },
                    },
                  ],
                }}
                selectedKey={
                  stateInvolucrado != undefined ? stateInvolucrado.RelacionConEmpresa : ''
                }
                onChange={(
                  ev: React.FormEvent<HTMLInputElement>,
                  option: IChoiceGroupOption,
                ) => {
                  if (option.text === RelationEmpresa.Contratado) {
                    setisDisabledcontratista(false);
                    setInvolucrado({
                      ...stateInvolucrado,
                      RelacionConEmpresa: option.text,
                    });
                  } else {
                    setisDisabledcontratista(true);
                    setInvolucrado({
                      ...stateInvolucrado,
                      RelacionConEmpresa: option.text,
                      NombreContratista: '',
                    });
                  }
                  setisDisabledGuardar(false);
                }}
              />
            </div>
          </Stack>
        </div>
        <div style={{ width: '100%' }}>
          <div className={styles.orderField}>
            <label className={styles.requiredLabel}>Nombre de la contratista</label>
            <TextField
              className={styles.textField}
              disabled={isDisabledcontratista || isVer}
              onChange={(
                _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                newValue?: string,
              ) => {
                setInvolucrado({
                  ...stateInvolucrado,
                  NombreContratista: newValue || null,
                });
                setisDisabledGuardar(false);
              }}
              value={stateInvolucrado?.NombreContratista || ''}
            />
          </div>
        </div>
      </div>
      <div className={styles.gridContainer3}>
        <div>
          <Label>Si manejaba vehículo, complete los siguientes campos:</Label>
        </div>
      </div>
      <div className={styles.gridContainer4}>
        <div style={{ width: '100%' }}>
          <div className={styles.orderField}>
            <label className={styles.requiredLabel}>Marca</label>
            <TextField
              className={styles.textField}
              disabled={isVer}
              onChange={(
                _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                newValue?: string,
              ) => {
                setInvolucrado({
                  ...stateInvolucrado,
                  MarcaVehiculo: newValue?.slice(0, 20) || null,
                });
                setisDisabledGuardar(false);
              }}
              maxLength={20}
              value={stateInvolucrado?.MarcaVehiculo || ''}
              autoComplete={'off'}
            />
          </div>
        </div>
        <div style={{ width: '100%' }}>
          <div className={styles.orderField}>
            <label className={styles.requiredLabel}>Modelo</label>
            <TextField
              className={styles.textField}
              disabled={isVer}
              onChange={(
                _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                newValue?: string,
              ) => {
                setInvolucrado({
                  ...stateInvolucrado,
                  ModeloVehiculo: newValue?.slice(0, 20) || null,
                });
                setisDisabledGuardar(false);
              }}
              maxLength={20}
              value={stateInvolucrado?.ModeloVehiculo || ''}
              autoComplete={'off'}
            />
          </div>
        </div>
      </div>
      <div className={styles.gridContainer4}>
        <div style={{ width: '100%' }}>
          <div className={styles.orderField}>
            <label className={styles.requiredLabel}>Color</label>
            <TextField
              className={styles.textField}
              disabled={isVer}
              onChange={(
                _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                newValue?: string,
              ) => {
                setInvolucrado({
                  ...stateInvolucrado,
                  ColorVehiculo: newValue?.slice(0, 20) || null,
                });
                setisDisabledGuardar(false);
              }}
              maxLength={20}
              value={stateInvolucrado?.ColorVehiculo || ''}
              autoComplete={'off'}
            />
          </div>
        </div>
        <div style={{ width: '100%' }}>
          <div className={styles.orderField}>
            <label className={styles.requiredLabel}>Dominio</label>
            <TextField
              className={styles.textField}
              disabled={isVer}
              onChange={(
                _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                newValue?: string,
              ) => {
                setInvolucrado({
                  ...stateInvolucrado,
                  PatenteVehiculo: newValue?.slice(0, 10) || null,
                });
                setisDisabledGuardar(false);
              }}
              maxLength={10}
              value={stateInvolucrado?.PatenteVehiculo || ''}
              autoComplete={'off'}
            />
          </div>
        </div>
      </div>
      <div>
        {isDisabledGuardar && (
          <MessageBar messageBarType={MessageBarType.warning}>
            Se debe completar al menos un dato.
          </MessageBar>
        )}
      </div>
    </FormPanelInvolucrados>
  );
};
export default ItemPanelInvolucrados;
