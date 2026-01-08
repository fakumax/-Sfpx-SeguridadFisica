import {
  expandFields,
  selectFields,
} from '../../../webparts/seguridadFisica/common/helpers';
import { IAlerta } from '../../interfaces/IAlerta';
import SPODataProvider from '../../pnp/sp/SharePointDataProvider';
import { Estados, LIST_NAMES } from '../../utils/Constants';
import { ConIDAlerta } from '../../utils/Utils';

export const getAlertasByRegion = async (
  alertData: IAlerta,
  unidadDeNegocioId?: number,
  activoId?: number,
): Promise<IAlerta[]> => {
  try {
    const estadosValidos = [
      Estados.Finalizado,
      Estados.Eninvestigacion,
      Estados.Concretado,
      Estados.Frustrado,
      Estados.FrustradoIntSSFF,
      Estados.Bloqueoproceso,
    ];

    const estadosFilter = estadosValidos
      .map((estado) => `Estado eq '${estado}'`)
      .join(' or ');

    const instalacionFilter = `(
        Instalacion eq '${alertData.Instalacion}' or 
        Instalacion eq 'Ninguna Instalación'
      )`;

    const filterQuery = `Region eq '${alertData.Region}' and (${instalacionFilter})  and  ID lt ${alertData.Id} and (${estadosFilter})`;

    let items = await SPODataProvider.getListItems<IAlerta>(
      LIST_NAMES.ALERTAS,
      selectFields,
      filterQuery,
      expandFields,
    );
    items = items
      .map((item) => {
        if (item.Instalacion === 'Ninguna Instalación') {
          const compareUnidadNegocio = unidadDeNegocioId || alertData.UnidadDeNegocio?.Id;
          const compareActivo = activoId || alertData.Activo?.Id;

          return (compareUnidadNegocio &&
            item.UnidadDeNegocio?.Id === compareUnidadNegocio) &&
            (compareActivo && item.Activo?.Id === compareActivo)
            ? item
            : null;
        }
        return item;
      })
      .filter((item) => item !== null);

    return items;
  } catch (error) {
    console.error('Error al traer alertas de Antecedentes:', error);
    return [];
  }
};

export const getRegistrosByIDAlerta = async <T extends ConIDAlerta>(
  alertas: IAlerta[],
  nombreDeLista: string,
  campos: string,
): Promise<T[]> => {
  try {
    return await SPODataProvider.getListItems<T>(
      nombreDeLista,
      campos,
      construirFiltroPorIDAlerta(alertas)
    );
  } catch (error: unknown) {
    console.error(`Error al traer registros de la lista ${nombreDeLista}: ${error}`);
    return [] as T[];
  }
};

export const construirFiltroPorIDAlerta = (alertas: IAlerta[]): string => {
  return null === alertas || 0 === alertas.length
    ? ''
    : alertas.map((alerta: IAlerta) => `IDAlerta eq '${alerta.Id}'`).join(' or ');
};

export const formatAntecedenteToSend = (items) => {
  if (!items || items.length === 0) return '';
  return items.map((item) => item.Id).join(';');
};

export const buscarAlertas = async (term: string): Promise<IAlerta[]> => {
  if (!term) return [];
  const filtro = `
    substringof('${term}', Instalacion) or
    substringof('${term}', Region) or
    substringof('${term}', Title)
  `;
  return await SPODataProvider.getListItems<IAlerta>(
    LIST_NAMES.ALERTAS,
    'Id,Instalacion,Region,Title,FechaHoraIncidente,Estado,TipoAlerta,CategoriaPrincipal/Title,CategoriaSecundaria/Title',
    filtro,
    'CategoriaPrincipal,CategoriaSecundaria',
  );
};
