import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'SeguridadFisicaWebPartStrings';
import { ISeguridadFisicaProps } from './components/ListaAlerta/ISeguridadFisicaProps';
import { IListId } from '../../core/interfaces/IListId';
import { IAlerta } from '../../core/interfaces/IAlerta';
import SPODataProvider from '../../core/pnp/sp/SharePointDataProvider';
import { getSP } from '../../core/pnp/sp/pnpjs-presets';
import AppRouter from './components/AppRouter';
import '@pnp/graph/groups';
import '@pnp/graph/members';
import '@pnp/graph/users';
import { Estados, LIST_NAMES, Permisos, permisosSitio } from '../../core/utils/Constants';
import { IFiltro } from '../../core/interfaces/IFiltro';
import BaseEntity from '../../core/entities/BaseEntity';
import { ISeguridadFisicaWebPartProps } from '../../core/interfaces/ISeguridadFisicaWebPartProps';

let _listId: IListId;
let _visible: boolean;
let _permiso: string;
let _region: string;
let _listItemAlerta: IAlerta[];
let _filtrosPermisos: IFiltro;

export default class SeguridadFisicaWebPart extends BaseClientSideWebPart<ISeguridadFisicaWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _VPN: boolean = true;
  private _isOwner: boolean = false;

  protected async onInit(): Promise<void> {
    getSP(this.context);
    const sendEmailObj = this.properties.sendEmailObj || { url: '', key: '' };
    const propiedades: ISeguridadFisicaWebPartProps = {
      description: this.properties.description,
      ServiceApiUrlAF: this.properties.ServiceApiUrlAF,
      HealthcheckApiUrl: this.properties.HealthcheckApiUrl,
      GisMapUrl: this.properties.GisMapUrl,
      enlaces: this.properties.enlaces,
      sendEmailObj: {
        url: sendEmailObj.url,
        key: sendEmailObj.key
      }
    };
    SPODataProvider.Init(propiedades);
    this._VPN = await SPODataProvider.isConnected();

    const userId = await SPODataProvider.getUserId(
      this.context.pageContext.user.loginName,
    );
    if (userId) {
      (this.context.pageContext.user as any).id = userId;
    }
    let filtro: IFiltro = await this.getPermisos();
    if (filtro.pendientes !== '') {
      _listId = await this.getListIdsByNames();
      _listItemAlerta = [];
      _filtrosPermisos = filtro;
      _visible = true;
    } else {
      _visible = false;
      _filtrosPermisos = filtro;
    }
    this._isOwner = await SPODataProvider.isUserInGroup(permisosSitio.Propietarios);
    const isAdmin = await SPODataProvider.isSiteCollectionAdmin();
    if (!this._isOwner && !isAdmin) {
      this._initDomObserver();
    }
    return Promise.resolve();
  }

  public render(): void {
    const sendEmailObj = this.properties.sendEmailObj || { url: '', key: '' };
    const element: React.ReactElement<ISeguridadFisicaProps> = React.createElement(
      AppRouter,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        listId: _listId,
        listItemAlerta: _listItemAlerta,
        filtrosPermisos: _filtrosPermisos,
        visible: _visible,
        permiso: _permiso,
        region: _region,
        context: this.context,
        VPNisConnected: this._VPN,
        enlaces: this.properties.enlaces,
        sendEmailObj: {
          url: sendEmailObj.url,
          key: sendEmailObj.key
        },
      },
    );

    ReactDom.render(element, this.domElement);
  }

  public _initDomObserver(): void {
    const observer = new MutationObserver((mutations, obs) => {
      const settingsIcon = document.querySelector('#O365_MainLink_Settings_container');

      if (settingsIcon) {
        settingsIcon.remove();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  public async getListIdsByNames(): Promise<IListId> {
    const listTitles: string[] = [LIST_NAMES.ALERTAS];
    const listIds: IListId = {
      Alertas: '',
    };
    try {
      const promises = listTitles.map((title) => SPODataProvider.getListId(title));
      const results = await Promise.all(promises);
      listIds.Alertas = results[0];
    } catch (error) {
      console.error('Error al obtener los IDs de las listas de SharePoint:', error);
    }
    return listIds;
  }

  public async getPermisos(): Promise<IFiltro> {
    let items: BaseEntity[] = await SPODataProvider.getListItems<BaseEntity>(
      LIST_NAMES.PERMISOS,
    );
    let itemsPermisos = items.map((item) => new BaseEntity(item));
    let groupsName = '';
    let pendientes = '';
    let tratamiento = '';
    let ambos = '';
    for (let item of itemsPermisos) {
      groupsName = item.Titulo !== undefined ? item.Titulo.toUpperCase() : '';
      if (groupsName.indexOf(Permisos.COS) === 0) {
        let region = groupsName.substring(4);
        _region = region;
        _permiso = Permisos.COS;
        pendientes = `Region eq '${region}' and (Estado eq '${Estados.Ingresada}' or Estado eq '${Estados.DevueltaCOS}')`;
        tratamiento = `Region eq '${region}' and (Estado eq '${Estados.Asignada}' or Estado eq '${Estados.DerivadaAprobador}')`;
        ambos = `Region eq '${region}' and (Estado eq '${Estados.Ingresada}' or Estado eq '${Estados.DevueltaCOS}' or Estado eq '${Estados.Asignada}' or Estado eq '${Estados.DerivadaAprobador}')`;
      }
      if (groupsName.indexOf('GERENTES REGIONALES') === 0) {
        let region = groupsName.substring(20);
        _permiso = Permisos.GERENTESREGIONALES;
        _region = region;
        pendientes = `Region eq '${region}' and (Estado eq '${Estados.DerivadaAprobador}' or Estado eq '${Estados.Eninvestigacion}')`;
        tratamiento = `Region eq '${region}' and (Estado eq '${Estados.AsignadaAprobador}' or Estado eq '${Estados.Bloqueoproceso}' or Estado eq '${Estados.Eninvestigacion}')`;
        ambos = `Region eq '${region}' and (Estado eq '${Estados.DerivadaAprobador}' or Estado eq '${Estados.Eninvestigacion}' or Estado eq '${Estados.AsignadaAprobador}' or Estado eq '${Estados.Bloqueoproceso}' or Estado eq '${Estados.Eninvestigacion}')`;
      }
    }
    let filtro: IFiltro = {
      pendientes: pendientes,
      tratamiento: tratamiento,
    };
    return filtro;
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (this.context.sdks.microsoftTeams) {
      // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext().then((context) => {
        let environmentMessage: string = '';
        switch (context.app.host.name) {
          case 'Office': // running in Office
            environmentMessage = this.context.isServedFromLocalhost
              ? strings.AppLocalEnvironmentOffice
              : strings.AppOfficeEnvironment;
            break;
          case 'Outlook': // running in Outlook
            environmentMessage = this.context.isServedFromLocalhost
              ? strings.AppLocalEnvironmentOutlook
              : strings.AppOutlookEnvironment;
            break;
          case 'Teams': // running in Teams
          case 'TeamsModern':
            environmentMessage = this.context.isServedFromLocalhost
              ? strings.AppLocalEnvironmentTeams
              : strings.AppTeamsTabEnvironment;
            break;
          default:
            environmentMessage = strings.UnknownEnvironment;
        }

        return environmentMessage;
      });
    }

    return Promise.resolve(
      this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentSharePoint
        : strings.AppSharePointEnvironment,
    );
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty(
        '--linkHovered',
        semanticColors.linkHovered || null,
      );
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                }),
                PropertyPaneTextField('ServiceApiUrlAF', {
                  label: strings.ServiceApiUrlAF,
                }),
                PropertyPaneTextField('HealthcheckApiUrl', {
                  label: strings.HealthcheckApiUrl,
                }),
                PropertyPaneTextField('GisMapUrl', {
                  label: strings.GisMapUrl,
                }),
                PropertyPaneTextField('enlaces', {
                  label: 'Enlaces JSON',
                  multiline: true,
                  value: JSON.stringify(this.properties.enlaces || [], null, 2),
                }),
                PropertyPaneTextField('sendEmailObj.url', {
                  label: strings.SendEmailURL
                }),
                PropertyPaneTextField('sendEmailObj.key', {
                  label: strings.SendEmailKey
                })
              ],
            },
          ],
        },
      ],
    };
  }
}
