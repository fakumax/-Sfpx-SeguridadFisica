import * as React from 'react';
import { SectionDropdown } from '../../../../../core/ui/components/SectionDropdown/SectionDropdown';
import { useCustomFormContext } from '../../../common/context/CustomFormProvider';
import { fetchChoices } from '../../../../../core/api/services/generalService';
import { AlertTypes, LIST_NAMES } from '../../../../../core/utils/Constants';
import { IDropdownOption } from '@fluentui/react';
import { IAlerta } from '../../../../../core/interfaces/IAlerta';

interface OpcionFinalProps {
  alertData: IAlerta;
  stateGerenteRegional: boolean;
}

const OpcionFinal: React.FC<OpcionFinalProps> = ({ alertData, stateGerenteRegional }) => {
  const { isDisabled, watch, setValue } = useCustomFormContext();
  const [estadoOptions, setEstadoOptions] = React.useState<IDropdownOption[]>([]);

  const estadoLabel = {
    label: '¿Cómo debe ser catalogada esta alerta?',
    placeholder: 'Seleccioná la opción de catalogación',
  };
  const tipoAlertaValue = watch('TipoAlerta');
  const getChoices = async () => {
    try {
      const choices = await fetchChoices(LIST_NAMES.ALERTAS, 'Novedad');
      setEstadoOptions(choices);
    } catch (error) {
      console.error('Error al obtener las opciones', error);
    }
  };

  React.useEffect(() => {
    getChoices();
  }, []);

  React.useEffect(() => {
    if (alertData?.Novedad) {
      setValue('AlertaDatos.Novedad', alertData.Novedad);
    }
  }, [alertData, setValue]);

  const handleDropdownChange = (event: React.FormEvent<HTMLDivElement>, option: any) => {
    setValue('AlertaDatos.Novedad', option.key);
  };

  const shouldShowDropdown = tipoAlertaValue !== AlertTypes.AlertaIncidente;

  return (
    <>
      {shouldShowDropdown && (
        <SectionDropdown
          name="AlertaDatos.Novedad"
          options={estadoOptions}
          label={estadoLabel.label}
          placeholder={estadoLabel.placeholder}
          required={true}
          disabled={isDisabled || stateGerenteRegional}
          initialValue={alertData.Novedad || ''}
          onChange={handleDropdownChange}
        />
      )}
    </>
  );
};

export { OpcionFinal };
