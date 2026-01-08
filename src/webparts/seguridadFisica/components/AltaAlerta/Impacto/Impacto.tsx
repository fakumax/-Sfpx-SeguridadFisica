import {
  DefaultButton,
  Stack,
  ChoiceGroup,
  IChoiceGroupOption,
  Text,
  TooltipHost,
  Icon,
  Dropdown,
  TextField,
  IDropdownOption,
} from '@fluentui/react';
import * as React from 'react';
import { useCustomFormContext } from '../../../common/context/CustomFormProvider';
import styles from './Impacto.module.scss';
import { FormPanel } from '../../../../../core';
import { Controller } from 'react-hook-form';
import {
  fetchAllChoiceOptions,
  fetchImpactos,
} from '../../../../../core/api/services/impactoService';
import EmptyDataSVG from '../../../assets/img-sin-datos.svg';
import { createGruposImpacto, MensajeImpacto } from './impactoUtils';

const Impacto = ({ context, alertData }) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    getValues,
    trigger,
    isDisabled,
    register,
    formState: { errors },
  } = useCustomFormContext();
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);
  const [impactos, setImpactos] = React.useState(null);
  const perdidaDiariaProduccion = watch('ImpactoPerdida.PerdidaDiariaProduccion');
  const [choiceOptions, setChoiceOptions] = React.useState({});
  const [isSaveDisabled, setIsSaveDisabled] = React.useState(true);
  const [formValues, setFormValues] = React.useState(null);

  const [mensajes, setMensajes] = React.useState([]);
  const valoresActuales = getValues();
  const defaultImpactoValues = {
    ImpactoPersonas: '',
    ImpactoInfraestructura: '',
    ImpactoOperaciones: '',
    ImpactoMedioambiente: '',
    ImpactoImagen: '',
    ImpactoInformacion: '',
    MaterialAfectadoTotal: '',
    PerdidaDiariaProduccion: '',
    UnidadDeMedida: '',
    IDAlerta: alertData?.Id || '',
    Id: '',
  };

  React.useEffect(() => {
    const cargarImpactos = async () => {
      try {
        const datosImpactos: any = await fetchImpactos(alertData.Id);
        setImpactos(datosImpactos);

        if (datosImpactos && datosImpactos.length > 0) {
          const impacto = datosImpactos[0];

          const mensajesIniciales = [];

          if (impacto.ImpactoPersonas !== 'Nulo') {
            mensajesIniciales.push({ campo: 'Personas', valor: impacto.ImpactoPersonas });
          }

          if (impacto.ImpactoInfraestructura) {
            mensajesIniciales.push({
              campo: 'Infraestructura/Material',
              valor: impacto.ImpactoInfraestructura,
            });
          }

          if (impacto.ImpactoOperaciones) {
            mensajesIniciales.push({
              campo: 'Operaciones',
              valor: impacto.ImpactoOperaciones,
            });
          }

          if (impacto.ImpactoMedioambiente !== 'Nulo') {
            mensajesIniciales.push({
              campo: 'Medio Ambiente',
              valor: impacto.ImpactoMedioambiente,
            });
          }

          if (impacto.ImpactoImagen !== 'Nulo') {
            mensajesIniciales.push({ campo: 'Imagen', valor: impacto.ImpactoImagen });
          }
          if (impacto.ImpactoInformacion !== 'Nulo') {
            mensajesIniciales.push({
              campo: 'Información',
              valor: impacto.ImpactoInformacion,
            });
          }

          if (impacto.MaterialAfectadoTotal) {
            mensajesIniciales.push({
              campo: 'Material Afectado Total',
              valor: impacto.MaterialAfectadoTotal,
            });
          }
          if (impacto.PerdidaDiariaProduccion) {
            mensajesIniciales.push({
              campo: 'Pérdida Diaria de Producción',
              valor: impacto.PerdidaDiariaProduccion,
            });
          }
          if (impacto.UnidadDeMedida) {
            mensajesIniciales.push({
              campo: 'Unidad de Medida',
              valor: impacto.UnidadDeMedida,
            });
          }
          setValue('ImpactoPerdida', impacto);
          setFormValues(impacto);
          setMensajes(mensajesIniciales);
        } else {
          setValue('ImpactoPerdida', {});
          setMensajes([]);
          setFormValues(defaultImpactoValues);
        }
      } catch (error) {
        setValue('ImpactoPerdida', {});
        console.error('Error al cargar impactos:', error);
      }
    };

    cargarImpactos();
  }, [alertData.Id, setValue]);

  React.useEffect(() => {
    const cargarOpcionesChoice = async () => {
      try {
        const opciones = await fetchAllChoiceOptions();
        setChoiceOptions(opciones);
      } catch (error) {
        console.error('Error al cargar opciones:', error);
      }
    };

    cargarOpcionesChoice();
  }, []);

  const openPanelToAdd = () => {
    setIsSaveDisabled(true);
    const impactoActualizado =
      formValues || (mensajes.length > 0 ? defaultImpactoValues : null);
    reset({
      ...valoresActuales,
      ImpactoPerdida: impactoActualizado,
    });
    setIsPanelOpen(true);
  };

  const gruposImpacto = createGruposImpacto(choiceOptions);

  const unidadesDeMedida: IDropdownOption[] =
    choiceOptions['UnidadDeMedida']?.map((option) => ({
      key: option,
      text: option,
    })) || [];

  const handleSaveImpacto = async () => {
    const esValido = await validarCamposDelPanel();
    if (esValido) {
      const formData = getValues('ImpactoPerdida');
      const nuevosMensajes = [];

      if (formData.ImpactoPersonas !== 'Nulo') {
        nuevosMensajes.push({ campo: 'Personas', valor: formData.ImpactoPersonas });
      }
      if (formData.ImpactoInfraestructura) {
        nuevosMensajes.push({
          campo: 'Infraestructura/Material',
          valor: formData.ImpactoInfraestructura,
        });
      }
      if (formData.ImpactoOperaciones) {
        nuevosMensajes.push({ campo: 'Operaciones', valor: formData.ImpactoOperaciones });
      }
      if (formData.ImpactoMedioambiente !== 'Nulo') {
        nuevosMensajes.push({
          campo: 'Medio Ambiente',
          valor: formData.ImpactoMedioambiente,
        });
      }
      if (formData.ImpactoImagen !== 'Nulo') {
        nuevosMensajes.push({ campo: 'Imagen', valor: formData.ImpactoImagen });
      }
      if (formData.ImpactoInformacion !== 'Nulo') {
        nuevosMensajes.push({ campo: 'Información', valor: formData.ImpactoInformacion });
      }
      if (formData.MaterialAfectadoTotal) {
        nuevosMensajes.push({
          campo: 'Material Afectado Total',
          valor: formData.MaterialAfectadoTotal,
        });
      }
      if (formData.PerdidaDiariaProduccion) {
        nuevosMensajes.push({
          campo: 'Pérdida Diaria de Producción',
          valor: formData.PerdidaDiariaProduccion,
        });
      }
      if (formData.UnidadDeMedida) {
        nuevosMensajes.push({
          campo: 'Unidad de Medida',
          valor: formData.UnidadDeMedida,
        });
      }

      setFormValues(formData);
      setMensajes(nuevosMensajes);
      setIsPanelOpen(false);
    } else {
      console.log('Campos del panel no son válidos');
      setIsSaveDisabled(true);
    }
  };

  const validarCamposDelPanel = async () => {
    const esValido = await trigger([
      'ImpactoPerdida.ImpactoPersonas',
      'ImpactoPerdida.ImpactoInfraestructura',
      'ImpactoPerdida.ImpactoOperaciones',
      'ImpactoPerdida.ImpactoMedioambiente',
      'ImpactoPerdida.ImpactoImagen',
      'ImpactoPerdida.ImpactoInformacion',
      'ImpactoPerdida.PerdidaDiariaProduccion',
      'ImpactoPerdida.UnidadDeMedida',
    ]);
    setIsSaveDisabled(!esValido);
    return esValido;
  };

  React.useEffect(() => {
    const areAllFieldsValid = () => {
      const formData = getValues('ImpactoPerdida') || {};
      return (
        !formData.ImpactoPersonas ||
        !formData.ImpactoInfraestructura ||
        !formData.ImpactoOperaciones ||
        !formData.ImpactoMedioambiente ||
        !formData.ImpactoImagen ||
        !formData.ImpactoInformacion ||
        (!!formData.PerdidaDiariaProduccion && !formData.UnidadDeMedida)
      );
    };

    setIsSaveDisabled(areAllFieldsValid());
  }, [
    watch('ImpactoPerdida.ImpactoPersonas'),
    watch('ImpactoPerdida.ImpactoInfraestructura'),
    watch('ImpactoPerdida.ImpactoOperaciones'),
    watch('ImpactoPerdida.ImpactoMedioambiente'),
    watch('ImpactoPerdida.ImpactoImagen'),
    watch('ImpactoPerdida.ImpactoInformacion'),
    watch('ImpactoPerdida.PerdidaDiariaProduccion'),
    watch('ImpactoPerdida.UnidadDeMedida'),
  ]);

  return (
    <>
      <Stack horizontal horizontalAlign="end">
        {!isDisabled && (
          <DefaultButton
            text="Editar"
            onClick={openPanelToAdd}
            className={styles.buttonStyle}
            iconProps={{ iconName: 'Edit' }}
          />
        )}
      </Stack>
      {mensajes.length > 0 ? (
        <MensajeImpacto mensajes={mensajes} />
      ) : (
        <Stack
          horizontal
          horizontalAlign="center"
          verticalAlign="center"
          tokens={{ childrenGap: 10 }}
        >
          <img src={EmptyDataSVG} alt="No data" style={{ height: 200, width: 'auto' }} />
          <Stack>
            <Text styles={{ root: { fontWeight: 'bold', fontSize: 18 } }}>
              No tenés pérdidas asociadas cargadas.
            </Text>
            {errors?.ImpactoPerdida?.message && (
              <Text className={styles.errorText} style={{ marginTop: '25px' }}>
                {errors.ImpactoPerdida.message}
              </Text>
            )}
          </Stack>
        </Stack>
      )}

      <FormPanel
        title={'Impacto y pérdida asociada'}
        isOpen={isPanelOpen}
        onCancel={() => {
          reset({
            ...valoresActuales,
            ImpactoPerdida: mensajes.length > 0 ? formValues : null,
          });
          setIsPanelOpen(false);
        }}
        onSave={handleSaveImpacto}
        saveLabel="Guardar"
        cancelLabel="Cancelar"
        isSaveDisabled={isSaveDisabled}
      >
        <Text variant="large" block>
          Impacto asociado
        </Text>
        <Text variant="small" block>
          Los impactos nulos no se mostrarán en el detalle del incidente salvo para el
          impacto nulo en las Operaciones.
        </Text>

        <Stack tokens={{ childrenGap: 20 }} styles={{ root: { marginTop: '20px' } }}>
          {gruposImpacto.map((grupo) => (
            <div key={grupo.name} className={styles.impactContainer}>
              <Stack horizontal verticalAlign="center" className={styles.labelContainer}>
                <Text variant="mediumPlus" className={styles.groupLabel}>
                  {grupo.label} <span className={styles.asterisk}>*</span>
                </Text>
              </Stack>
              <Controller
                name={grupo.name}
                key={grupo.name}
                control={control}
                rules={{ required: 'Este campo es obligatorio' }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <ChoiceGroup
                      {...field}
                      options={grupo.options.map((option) => ({
                        key: option.key,
                        text: option.text,
                        onRenderLabel: option.onRenderLabel,
                      }))}
                      required
                      styles={{
                        root: { marginBottom: '10px' },
                        flexContainer: `${styles.choiceGroupContainer}`,
                      }}
                      selectedKey={field.value}
                      onChange={(e, option) => field.onChange(option.key)}
                    />
                    {error && <span className={styles.errorText}>{error.message}</span>}
                  </>
                )}
              />
            </div>
          ))}
        </Stack>
        {/* Pérdida asociada */}
        <Stack
          tokens={{ childrenGap: 20 }}
          styles={{ root: { marginTop: 20, marginBottom: 20 } }}
        >
          <Text variant="large" block>
            Pérdida asociada
          </Text>
          <Controller
            name="ImpactoPerdida.MaterialAfectadoTotal"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Material afectado total"
                placeholder="Describí el material y cantidad total afectada"
                multiline
                onChange={(_, value) => field.onChange(value)}
              />
            )}
          />

          <Stack
            horizontal
            tokens={{ childrenGap: 20 }}
            styles={{ root: { width: '100%' } }}
          >
            <Stack.Item grow styles={{ root: { width: '50%' } }}>
              <Controller
                name="ImpactoPerdida.PerdidaDiariaProduccion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Pérdida diaria de producción"
                    placeholder="Registrá la pérdida diaria de producción"
                    onChange={(_, value) => field.onChange(value)}
                  />
                )}
              />
            </Stack.Item>
            <Stack.Item grow styles={{ root: { width: '50%' } }}>
              <Controller
                name="ImpactoPerdida.UnidadDeMedida"
                control={control}
                rules={{ required: !!perdidaDiariaProduccion }}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    label="Unidad de medida"
                    placeholder="Seleccioná unidad"
                    options={unidadesDeMedida}
                    selectedKey={field.value}
                    onChange={(event, option) => field.onChange(option.key)}
                    disabled={!perdidaDiariaProduccion}
                    required={!!perdidaDiariaProduccion}
                  />
                )}
              />
            </Stack.Item>
          </Stack>
        </Stack>
      </FormPanel>
    </>
  );
};

export { Impacto };
