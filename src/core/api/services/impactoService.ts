import { IFieldInfo } from '@pnp/sp/fields';
import SPODataProvider from '../../pnp/sp/SharePointDataProvider';
import { LIST_NAMES } from '../../utils/Constants';

const fetchImpactos = async (alertaId: any): Promise<any[]> => {
  try {
    const filterQuery = `IDAlerta eq '${alertaId}'`;
    const items = await SPODataProvider.getListItems<any>(
      `${LIST_NAMES.IMPACTOS}`,
      `
      Id,
      Title,
      ImpactoPersonas,
      ImpactoMedioambiente,
      ImpactoInfraestructura,
      ImpactoInformacion,
      ImpactoOperaciones,
      ImpactoImagen,
      IDAlerta,
      MaterialAfectadoTotal,
      PerdidaDiariaProduccion,
      UnidadDeMedida
      `,
      filterQuery,
    );

    return items;
  } catch (error) {
    console.error('Error fetching impactos:', error);
    return [];
  }
};

const fetchAllChoiceOptions = async (): Promise<{ [key: string]: string[] }> => {
  try {
    const fields: IFieldInfo[] = await SPODataProvider.getListFields(
      `${LIST_NAMES.IMPACTOS}`,
    );

    const choiceFields = fields.filter(
      (field) => field.FieldTypeKind === 6 || field.FieldTypeKind === 15,
    );

    const options = choiceFields.reduce((acc: { [key: string]: string[] }, field) => {
      acc[field.InternalName] = field.Choices;
      return acc;
    }, {});

    return options;
  } catch (error) {
    console.error('Error trayendo las opciones choice:', error);
    return {};
  }
};

const UpdateImpactos = async (
  formData: any,
  setValue: (name: string, value: any) => void,
): Promise<void> => {
  if (formData.ImpactoPerdida) {
    try {
      const impactoData = {
        ImpactoPersonas: formData.ImpactoPerdida.ImpactoPersonas || '',
        ImpactoInfraestructura: formData.ImpactoPerdida.ImpactoInfraestructura || '',
        ImpactoOperaciones: formData.ImpactoPerdida.ImpactoOperaciones || '',
        ImpactoMedioambiente: formData.ImpactoPerdida.ImpactoMedioambiente || '',
        ImpactoImagen: formData.ImpactoPerdida.ImpactoImagen || '',
        ImpactoInformacion: formData.ImpactoPerdida.ImpactoInformacion || '',
        MaterialAfectadoTotal: formData.ImpactoPerdida.MaterialAfectadoTotal || '',
        PerdidaDiariaProduccion: formData.ImpactoPerdida.PerdidaDiariaProduccion || '',
        UnidadDeMedida: formData.ImpactoPerdida.UnidadDeMedida || '',
        IDAlerta: String(formData.ImpactoPerdida.IDAlerta),
      };

      if (formData.ImpactoPerdida.Id) {
        await SPODataProvider.update(
          LIST_NAMES.IMPACTOS,
          formData.ImpactoPerdida.Id,
          impactoData,
        );
      } else {
        const newImpacto = await SPODataProvider.add(LIST_NAMES.IMPACTOS, impactoData);

        if (newImpacto) {
          setValue('ImpactoPerdida.Id', newImpacto);
        }
      }
    } catch (error) {
      console.error('Error al enviar el impacto:', error);
    }
  }
};

export { fetchImpactos, fetchAllChoiceOptions, UpdateImpactos };
