import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import styles from './SegundaFila.module.scss';
import { useCustomFormContext } from '../../../../common/context/CustomFormProvider';
import {
  fetchCategoriasPrincipales,
  fetchCategoriasSecundarias,
  fetchTipoAlertaChoices,
  normalizeText,
} from '../../../../../../core/api/services/datosBaseService';
import { AlertTypes } from '../../../../../../core/utils/Constants';

interface SegundaFilaProps {
  alertData: any;
}

export interface ICategoriaPrincipalOption extends IDropdownOption {
  Formulario: string;
}

const SegundaFila: React.FC<SegundaFilaProps> = ({ alertData }) => {
  const {
    control,
    setValue,
    formState: { errors },
    watch,
    isDisabled,
    getValues,
  } = useCustomFormContext();

  const [tipoAlertaChoices, setTipoAlertaChoices] = React.useState<IDropdownOption[]>([]);
  const [categoriasSecundarias, setCategoriasSecundarias] = React.useState<any[]>([]);
  const [selectedTipoAlerta, setSelectedTipoAlerta] = React.useState<any>(undefined);
  const [filteredCategoriasSecundarias, setFilteredCategoriasSecundarias] =
    React.useState<IDropdownOption[]>([]);
  const [allCategoriasPrincipales, setAllCategoriasPrincipales] = React.useState<
    ICategoriaPrincipalOption[]
  >([]);
  const [categoriasPrincipales, setCategoriasPrincipales] = React.useState<
    ICategoriaPrincipalOption[]
  >([]);
  const tipoAlertaValue = watch('TipoAlerta');
  const categoriaPrincipalValue = watch('CategoriaPrincipal');
  const tipoAlertaDisabled = watch('states.TipoAlertaDisabled');

  const handleCategoriaPrincipalChange = (categoriaPrincipalId?: string) => {
    const filtered = categoriasSecundarias
      .filter((sec) => sec.CategoriaPrincipal.Id === categoriaPrincipalId)
      .map((sec) => ({ key: sec.Id, text: sec.Title }));
    setFilteredCategoriasSecundarias(filtered);
  };

  React.useEffect(() => {
    const loadData = async () => {
      const [categoriasPrincipalesData, categoriasSecundariasData, tipoAlertaChoicesData] = await Promise.all([
        fetchCategoriasPrincipales(),
        fetchCategoriasSecundarias(),
        fetchTipoAlertaChoices(),
      ]);
      setAllCategoriasPrincipales(categoriasPrincipalesData);
      setCategoriasSecundarias(categoriasSecundariasData);
      setTipoAlertaChoices(tipoAlertaChoicesData);

      if (
        alertData?.TipoAlerta &&
        alertData.TipoAlerta.toLowerCase() !== AlertTypes.AlertaSinTipo
      ) {
        const matchedOption = tipoAlertaChoicesData.find(
          (choice) => choice.text.toLowerCase() === alertData.TipoAlerta.toLowerCase(),
        );
        if (matchedOption) {
          setSelectedTipoAlerta(matchedOption.key);
          setValue('TipoAlerta', matchedOption.text, { shouldValidate: true });
        }

        const filteredCategorias = categoriasPrincipalesData.filter((cat) => {
          const normalizedFormulario = normalizeText(cat.Formulario);
          return normalizeText(alertData.TipoAlerta).includes(normalizedFormulario);
        });
        const currentStates = getValues('states');
        setValue('states', {
          ...currentStates,
          TipoAlertaDisabled: true,
        });
        setCategoriasPrincipales(filteredCategorias);

        if (alertData.CategoriaPrincipal) {
          setValue(
            'CategoriaPrincipal',
            {
              Id: alertData.CategoriaPrincipal.Id,
              Title: alertData.CategoriaPrincipal.Title,
            },
            { shouldValidate: true },
          );
          // Usar categoriasSecundariasData directamente en lugar del estado
          const filtered = categoriasSecundariasData
            .filter((sec) => sec.CategoriaPrincipal.Id === alertData.CategoriaPrincipal.Id)
            .map((sec) => ({ key: sec.Id, text: sec.Title }));
          setFilteredCategoriasSecundarias(filtered);
        }

        if (alertData.CategoriaSecundaria) {
          setValue('CategoriaSecundaria', alertData.CategoriaSecundaria.Id, {
            shouldValidate: true,
          });
        }
      } else {
        setCategoriasPrincipales(categoriasPrincipalesData);
      }
    };
    loadData();
  }, [alertData]);

  React.useEffect(() => {
    const loadTipoAlertaChoices = async () => {
      const choices = await fetchTipoAlertaChoices();
      setTipoAlertaChoices(choices);
      if (alertData?.TipoAlerta) {
        const matchedOption = choices.find((choice) => {
          return choice.text.toLowerCase().includes(alertData.TipoAlerta.toLowerCase());
        });
        if (matchedOption) {
          setSelectedTipoAlerta(matchedOption.key);
          setValue('TipoAlerta', matchedOption.text, { shouldValidate: true });
        }
      }
    };
    loadTipoAlertaChoices();
  }, [alertData]);

  React.useEffect(() => {
    if (categoriaPrincipalValue && categoriaPrincipalValue.Id) {
      handleCategoriaPrincipalChange(categoriaPrincipalValue.Id);
    } else {
      setFilteredCategoriasSecundarias([]);
    }
  }, [categoriaPrincipalValue]);

  React.useEffect(() => {
    if (selectedTipoAlerta) {
      const filteredCategorias = allCategoriasPrincipales.filter(
        (cat) => normalizeText(cat.Formulario) === selectedTipoAlerta.toLowerCase(),
      );
      setCategoriasPrincipales(filteredCategorias);
    } else {
      setCategoriasPrincipales(allCategoriasPrincipales);
    }

    setValue('CategoriaPrincipal', undefined);
    setValue('CategoriaSecundaria', undefined);
    setFilteredCategoriasSecundarias([]);
  }, [selectedTipoAlerta, setValue, allCategoriasPrincipales]);

  const handleTipoAlertaChange = (event: any, option: IDropdownOption) => {
    setSelectedTipoAlerta(option.key as string);
    setValue('TipoAlerta', option.text);
  };
  return (
    <>
      <div>
        <Controller
          name="TipoAlerta"
          control={control}
          defaultValue={alertData?.TipoAlerta || ''}
          rules={{ required: 'El campo es obligatorio' }}
          render={({ field }) => (
            <Dropdown
              placeholder="Seleccioná un tipo de alerta"
              onRenderLabel={() => (
                <span className={styles.requiredLabel}>Tipo de alerta</span>
              )}
              options={tipoAlertaChoices}
              selectedKey={selectedTipoAlerta}
              onChange={handleTipoAlertaChange}
              className={styles.dropdown}
              disabled={isDisabled || tipoAlertaDisabled}
            />
          )}
        />
        {errors.TipoAlerta && (
          <span className={styles.errorText}>{errors.TipoAlerta.message}</span>
        )}
      </div>

      <div>
        <Controller
          name="CategoriaPrincipal"
          control={control}
          defaultValue={alertData?.CategoriaPrincipal?.Id || ''}
          rules={{
            required:
              !isDisabled && tipoAlertaValue ? 'El campo es obligatorio' : undefined,
          }}
          render={({ field }) => (
            <Dropdown
              placeholder="Seleccioná una categoría principal"
              onRenderLabel={() => (
                <span className={styles.requiredLabel}>Categoría principal</span>
              )}
              options={categoriasPrincipales}
              selectedKey={field.value?.Id || alertData?.CategoriaPrincipal?.Id}
              onChange={(e, option) => {
                field.onChange(option?.key);
                setValue('CategoriaPrincipal', { Id: option?.key, Title: option?.text });
                handleCategoriaPrincipalChange(option?.key as string);
                setValue('CategoriaSecundaria', undefined);
              }}
              className={styles.dropdown}
              disabled={!tipoAlertaValue || isDisabled}
            />
          )}
        />
        {errors.CategoriaPrincipal && (
          <span className={styles.errorText}>{errors.CategoriaPrincipal.message}</span>
        )}
      </div>

      <div>
        <Controller
          name="CategoriaSecundaria"
          control={control}
          defaultValue={alertData?.CategoriaSecundaria?.Id || ''}
          rules={{
            required: categoriaPrincipalValue ? 'El campo es obligatorio' : undefined,
          }}
          render={({ field }) => (
            <Dropdown
              placeholder="Seleccioná una categoría secundaria"
              onRenderLabel={() => (
                <span className={styles.requiredLabel}>Categoría secundaria</span>
              )}
              options={filteredCategoriasSecundarias}
              selectedKey={field.value || alertData?.CategoriaSecundaria?.Id}
              onChange={(e, option) => field.onChange(option?.key)}
              className={styles.dropdown}
              disabled={!categoriaPrincipalValue || !tipoAlertaValue || isDisabled}
            />
          )}
        />
        {errors.CategoriaSecundaria && (
          <span className={styles.errorText}>{errors.CategoriaSecundaria.message}</span>
        )}
      </div>
    </>
  );
};

export { SegundaFila };
