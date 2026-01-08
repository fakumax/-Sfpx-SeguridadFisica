import { IDropdownOption } from '@fluentui/react';
import SPODataProvider from '../../pnp/sp/SharePointDataProvider';

export const fetchChoices = async (
  listName: string,
  fieldName: string
): Promise<IDropdownOption[]> => {
  try {
    const choices = await SPODataProvider.getFieldChoices(listName, fieldName);
    return choices.map((choice) => ({
      key: choice,
      text: choice,
    }));
  } catch (error) {
    console.error(
      `Error trayendo las opciones choices de ${listName}.${fieldName}:`,
      error
    );
    return [];
  }
};
