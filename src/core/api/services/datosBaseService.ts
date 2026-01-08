// src/core/api/services/dataService.ts

import { IChoiceGroupOption, IDropdownOption } from '@fluentui/react';
import SPODataProvider from '../../pnp/sp/SharePointDataProvider';
import { LIST_NAMES } from '../../utils/Constants';
import { ICategoriaPrincipalOption } from '../../../webparts/seguridadFisica/components/AltaAlerta/DatosBase/SegundaFila/SegundaFila';

interface FetchDataOptions {
  listName: string;
  selectFields: string;
  keyField: string;
  textField: string;
  filterQuery?: string;
  expandFields?: string;
}

const fetchData = async ({
  listName,
  selectFields,
  keyField,
  textField,
  filterQuery = '',
  expandFields = '',
}: FetchDataOptions): Promise<IDropdownOption[]> => {
  try {
    const items = await SPODataProvider.getListItems<any>(
      listName,
      selectFields,
      filterQuery,
      expandFields,
    );

    return items.map((item) => ({
      key: item[keyField],
      text: item[textField],
    }));
  } catch (error) {
    console.error(`Error fetching data from ${listName}:`, error);
    return [];
  }
};

const fetchCategoriasPrincipales = async (): Promise<ICategoriaPrincipalOption[]> => {
  const filterQuery = 'Activo eq 1';
  try {
    const categoriasPrincipalesData = await SPODataProvider.getListItems<any>(
      'Categorias Principales',
      'Id,Title,Activo,Formulario',
      filterQuery,
    );
    return categoriasPrincipalesData.map((cat) => ({
      key: cat.Id,
      text: cat.Title,
      Formulario: cat.Formulario,
    }));
  } catch (error) {
    console.error('Error loading categorias principales:', error);
    return [];
  }
};

const fetchCategoriasSecundarias = async (): Promise<any[]> => {
  const filterQuery = 'Activo eq 1';
  return await SPODataProvider.getListItems<any>(
    'Categorias Secundarias',
    'Id,Title,CategoriaPrincipal/Id,CategoriaPrincipal/Title',
    filterQuery,
    'CategoriaPrincipal',
  );
};

const fetchChoices = async (
  listName: string,
  fieldName: string,
): Promise<IDropdownOption[]> => {
  try {
    const choices = await SPODataProvider.getFieldChoices(listName, fieldName);
    return choices.map((choice) => ({
      key: choice,
      text: choice,
    }));
  } catch (error) {
    console.error(`Error fetching choices from ${listName}.${fieldName}:`, error);
    return [];
  }
};
const fetchOpciones = async (
  listName: string,
  fieldName: string,
): Promise<IChoiceGroupOption[]> => {
  try {
    const choices = await SPODataProvider.getFieldChoices(listName, fieldName);
    return choices.map((choice) => ({
      key: choice,
      text: choice,
    }));
  } catch (error) {
    console.error(`Error fetching choices from ${listName}.${fieldName}:`, error);
    return [];
  }
};

const fetchActivosByRegion = async (regionTitle: string): Promise<any[]> => {
  const filterQuery = `(Region/Title eq '${regionTitle}') and (Activo eq 1)`;
  try {
    const items = await SPODataProvider.getListItems<any>(
      'Activos',
      'Id,Title,Region/Id,Region/Title,VP/Id,VP/Title,UN/Id,UN/Title,Activo',
      filterQuery,
      'Region,VP,UN',
    );
    return items;
  } catch (error) {
    console.error('Error fetching data from Activos:', error);
    return [];
  }
};

const fetchVicepresidencias = async (): Promise<IDropdownOption[]> => {
  return await fetchData({
    listName: 'VPs',
    selectFields: 'Id,Title',
    keyField: 'Id',
    textField: 'Title',
  });
};

const fetchUnidadesDeNegocio = async (
  vicepresidencia: string,
): Promise<IDropdownOption[]> => {
  const filterQuery = `Vicepresidencia eq '${vicepresidencia}'`;
  return await fetchData({
    listName: 'UnidadesDeNegocio',
    selectFields: 'Id,Title,Vicepresidencia',
    keyField: 'Id',
    textField: 'Title',
    filterQuery,
  });
};

const fetchActivos = async (): Promise<IDropdownOption[]> => {
  return await fetchData({
    listName: 'Activos',
    selectFields: 'Id,Title',
    keyField: 'Id',
    textField: 'Title',
  });
};

const normalizeText = (text) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

const modifyChoices = (choices) => {
  return choices.map((choice) => {
    const normalizedText = normalizeText(choice.text);
    const key = normalizedText.split(' de ')[1];
    return { ...choice, key: key };
  });
};

const fetchTipoAlertaChoices = async (): Promise<IDropdownOption[]> => {
  const choices = await fetchChoices(LIST_NAMES.ALERTAS, 'TipoAlerta');
  return modifyChoices(choices);
};

const fetchHuellasChoices = async (): Promise<IDropdownOption[]> => {
  return await fetchChoices('DatosComplementarios', 'HuellasEncontradas');
};
const fetchRelacionChoices = async (): Promise<IChoiceGroupOption[]> => {
  return await fetchOpciones('Involucrados', 'RelacionConIncidente');
};
const fetchRelacionEmpresaChoices = async (): Promise<IChoiceGroupOption[]> => {
  return await fetchOpciones('Involucrados', 'RelacionConEmpresa');
};
const fetchEstadosOpciones = async (): Promise<IDropdownOption[]> => {
  return await fetchChoices(LIST_NAMES.ALERTAS, 'Estado');
};
const fetchTipoAlertaOpciones = async (): Promise<IDropdownOption[]> => {
  return await fetchChoices(LIST_NAMES.ALERTAS, 'TipoAlerta');
};
export {
  fetchCategoriasPrincipales,
  fetchCategoriasSecundarias,
  fetchVicepresidencias,
  fetchUnidadesDeNegocio,
  fetchActivos,
  fetchActivosByRegion,
  fetchTipoAlertaChoices,
  fetchHuellasChoices,
  fetchRelacionChoices,
  fetchRelacionEmpresaChoices,
  normalizeText,
  fetchEstadosOpciones,
  fetchTipoAlertaOpciones,
};
