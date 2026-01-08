import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IAlerta } from '../../../../core/interfaces/IAlerta';
import { IListId } from '../../../../core/interfaces/IListId';
import { IFiltro } from '../../../../core/interfaces/IFiltro';

export interface ISeguridadFisicaProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  listId: IListId;
  listItemAlerta: IAlerta[];
  filtrosPermisos: IFiltro;
  visible: boolean;
  permiso: string;
  region: string;
  context: WebPartContext;
  VPNisConnected: boolean;
  enlaces?: Array<{
    title: string;
    url: string;
  }>;
  sendEmailObj: ISendEmailConfig;
}

export interface ISendEmailConfig {
  url: string;
  key: string;
}
