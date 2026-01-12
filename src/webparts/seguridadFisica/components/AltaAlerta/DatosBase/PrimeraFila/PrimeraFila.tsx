import * as React from 'react';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { Controller } from 'react-hook-form';
import { fetchActivosByRegion } from '../../../../../../core/api/services/datosBaseService';
import { useCustomFormContext } from '../../../../common/context/CustomFormProvider';
import styles from './PrimeraFila.module.scss';

interface PrimeraFilaProps {
  alertData: any;
}

interface IActivo {
  Id: string;
  Title: string;
  VP: {
    Title: string;
  };
  UN: {
    Id: string;
    Title: string;
  };
}

const PrimeraFila: React.FC<PrimeraFilaProps> = ({ alertData }) => {
  const {
    control,
    setValue,
    formState: { errors },
    isDisabled,
  } = useCustomFormContext();
  const [activosData, setActivosData] = React.useState<IActivo[]>([]);
  const [vicepresidencias, setVicepresidencias] = React.useState<IDropdownOption[]>([]);
  const [unidadesDeNegocio, setUnidadesDeNegocio] = React.useState<IDropdownOption[]>([]);
  const [activos, setActivos] = React.useState<IDropdownOption[]>([]);
  const [selectedVP, setSelectedVP] = React.useState<string | undefined>(undefined);
  const [selectedUN, setSelectedUN] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const loadData = async () => {
      if (alertData?.Region) {
        const data = await fetchActivosByRegion(alertData.Region);
        setActivosData(data);
        const uniqueVPs = Array.from(new Set(data.map((item) => item.VP.Title))).map(
          (title) => ({ key: title, text: title }),
        );
        setVicepresidencias(uniqueVPs);

        // Inicializar UNs y Activos basándose en los datos de la alerta
        if (alertData?.Vicepresidencia) {
          const filteredUNs = data
            .filter((item) => item.VP.Title === alertData.Vicepresidencia)
            .map((item) => ({ key: item.UN.Id, text: item.UN.Title }));
          const uniqueUNs = Array.from(
            new Map(filteredUNs.map((item) => [item.key, item])).values(),
          );
          setUnidadesDeNegocio(uniqueUNs);

          if (alertData?.UnidadDeNegocio?.Id) {
            const filteredActivos = data
              .filter((item) => item.UN.Id === alertData.UnidadDeNegocio.Id && item.VP.Title === alertData.Vicepresidencia)
              .map((item) => ({ key: item.Id, text: item.Title }));
            setActivos(filteredActivos);
          }
        }
      }
    };
    loadData();
  }, [alertData?.Region]);

  React.useEffect(() => {
    if (selectedVP) {
      const filteredUNs = activosData
        .filter((item) => item.VP.Title === selectedVP)
        .map((item) => ({
          key: item.UN.Id,
          text: item.UN.Title,
        }));

      const uniqueUNs = Array.from(
        new Map(filteredUNs.map((item) => [item.key, item])).values(),
      );
      setUnidadesDeNegocio(uniqueUNs);
      setActivos([]);
    }
  }, [selectedVP, activosData]);

  React.useEffect(() => {
    if (selectedVP && selectedUN) {
      const filteredActivos = activosData
        .filter((item) => item.UN.Id === selectedUN && item.VP.Title === selectedVP)
        .map((item) => ({
          key: item.Id,
          text: item.Title,
        }));

      setActivos(filteredActivos);
    }
  }, [selectedVP, selectedUN, activosData]);

  React.useEffect(() => {
    setValue('Vicepresidencia', alertData?.Vicepresidencia || '');
    setValue('UnidadDeNegocio', alertData?.UnidadDeNegocio?.Id || undefined);
    setValue('Activo', alertData?.Activo?.Id || undefined);
    setValue('ActivoActas', alertData?.Activo?.Title || '');
    setSelectedVP(alertData?.Vicepresidencia);
    setSelectedUN(alertData?.UnidadDeNegocio?.Id);
  }, [alertData, setValue]);
  return (
    <>
      <div>
        <Controller
          name="Vicepresidencia"
          control={control}
          defaultValue=""
          rules={{ required: 'El campo es obligatorio' }}
          render={({ field }) => (
            <Dropdown
              placeholder="Seleccioná una vicepresidencia"
              onRenderLabel={() => (
                <span className={styles.requiredLabel}>Vicepresidencia</span>
              )}
              options={vicepresidencias}
              selectedKey={field.value || selectedVP}
              onChange={(e, option) => {
                field.onChange(option?.key);
                setSelectedVP(option?.key as string);
                setSelectedUN(undefined);
                setValue('UnidadDeNegocio', undefined);
                setValue('Activo', undefined);
              }}
              className={styles.dropdown}
              disabled={isDisabled}
            />
          )}
        />
        {errors.Vicepresidencia && (
          <span className={styles.errorText}>{errors.Vicepresidencia.message}</span>
        )}
      </div>

      <div>
        <Controller
          name="UnidadDeNegocio"
          control={control}
          defaultValue=""
          rules={{ required: 'El campo es obligatorio' }}
          render={({ field }) => (
            <Dropdown
              placeholder="Seleccioná una unidad de negocio"
              onRenderLabel={() => (
                <span className={styles.requiredLabel}>Unidad de negocio</span>
              )}
              options={unidadesDeNegocio}
              selectedKey={field.value || selectedUN}
              onChange={(e, option) => {
                field.onChange(option?.key);
                setSelectedUN(option?.key as string);
                setValue('Activo', undefined);
              }}
              className={styles.dropdown}
              disabled={!selectedVP || isDisabled}
            />
          )}
        />
        {!(!selectedVP || isDisabled) && errors.UnidadDeNegocio && (
          <span className={styles.errorText}>{errors.UnidadDeNegocio.message}</span>
        )}
      </div>

      <div>
        <Controller
          name="Activo"
          control={control}
          defaultValue=""
          rules={{ required: 'El campo es obligatorio' }}
          render={({ field }) => (
            <Dropdown
              placeholder="Seleccioná un activo"
              onRenderLabel={() => <span className={styles.requiredLabel}>Activo</span>}
              options={activos}
              selectedKey={field.value}
              onChange={(e, option) => field.onChange(option?.key)}
              className={styles.dropdown}
              disabled={!selectedUN || isDisabled}
            />
          )}
        />
        {!(!selectedUN || isDisabled) && errors.Activo && (
          <span className={styles.errorText}>{errors.Activo.message}</span>
        )}
      </div>
    </>
  );
};

export { PrimeraFila };
