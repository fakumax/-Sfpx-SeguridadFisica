import { IDropdownOption } from '@fluentui/react';
import * as React from 'react';
import { IAlerta } from '../../../../../core/interfaces/IAlerta';
import { SectionDropdown } from '../../../../../core/ui/components/SectionDropdown/SectionDropdown';
import { useCustomFormContext } from '../../../common/context/CustomFormProvider';
import { AlertTypes, Categorias, Estados } from '../../../../../core/utils/Constants';

interface EstadoProps {
  alertData: IAlerta;
  GerenteDropdownChange: () => void;
}
const EstadoGerenteRegional: React.FC<EstadoProps> = ({
  alertData,
  GerenteDropdownChange,
}) => {
  const { isDisabled, watch, setValue } = useCustomFormContext();
  const [estadoOptions, setEstadoOptions] = React.useState<IDropdownOption[]>([]);
  const tipoAlertaValue = watch('TipoAlerta');
  const estadoLabel = {
    label: 'Nuevo estado para el incidente',
    placeholder: 'Seleccioná el estado con el que se guardará el incidente aprobado',
  };

  const Estado: IDropdownOption[] = [
    { key: Estados.FrustradoIntSSFF, text: Estados.FrustradoIntSSFF },
    { key: Estados.Frustrado, text: Estados.Frustrado },
    { key: Estados.Bloqueoproceso, text: Estados.Bloqueoproceso },
    { key: Estados.Concretado, text: Estados.Concretado },
    { key: Estados.Eninvestigacion, text: Estados.Eninvestigacion },
    { key: Estados.Finalizado, text: Estados.Finalizado },
  ];

  React.useEffect(() => {
    if (alertData.Estado) {
      const opciones = Estado.filter((estado) => estado.key !== alertData.Estado);
      setEstadoOptions(opciones);
    } else {
      setEstadoOptions(Estado);
    }
  }, []);

  const handleDropdownChange = (
    event: React.FormEvent<HTMLDivElement>,
    option: IDropdownOption,
  ) => {
    setValue('EstadoGerente', option.key as string, { shouldValidate: true });
    GerenteDropdownChange();
  };

  const shouldShowDropdown = tipoAlertaValue === AlertTypes.AlertaIncidente;

  const shouldShowComponent =
    shouldShowDropdown &&
    alertData.Estado !== Estados.Concretado &&
    alertData.Estado !== Estados.Finalizado &&
    alertData.Estado !== Estados.Frustrado &&
    alertData.Estado !== Estados.FrustradoIntSSFF;

  return (
    <>
      {shouldShowComponent && (
        <SectionDropdown
          name="EstadoGerente"
          options={estadoOptions}
          label={estadoLabel.label}
          placeholder={estadoLabel.placeholder}
          required={true}
          disabled={isDisabled}
          initialValue={alertData?.EstadoGerente || ''}
          onChange={handleDropdownChange}
        />
      )}
    </>
  );
};
export { EstadoGerenteRegional };
