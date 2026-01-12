import { getSP } from './pnpjs-presets';
import { SPFI, spfi } from '@pnp/sp';
import * as Excel from 'exceljs';
//import * as path from 'path';
import '@pnp/sp/fields';
import '@pnp/sp/sites';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/views';
import '@pnp/sp/items';
import '@pnp/sp/profiles';
import '@pnp/sp/site-users/web';
import '@pnp/sp/attachments';
import '@pnp/sp/files';
import '@pnp/sp/folders';
import { IFieldInfo } from '@pnp/sp/fields';
import { ISiteUserInfo } from '@pnp/sp/site-users';
import '@pnp/sp/files';
import { IFile, IFileInfo } from '@pnp/sp/files';
import Email from '../../entities/Email';
import { IAlerta } from '../../interfaces/IAlerta';
import axios from 'axios';
import { ISeguridadFisicaWebPartProps } from '../../interfaces/ISeguridadFisicaWebPartProps';

export default class SPODataProvider {
  private static sp: SPFI;
  private static _ServiceApiUrlAF: string;
  private static _HealthcheckApiUrl: string;
  private static _GisMapUrl: string;
  private static _sendEmailUrl: string;
  private static _sendEmailKey: string;
  private static _isMockMode: boolean = false;
  private static _mockData: Map<string, any[]> = new Map();

  private static isMock(): boolean {
    return this._isMockMode || !this.sp;
  }

  public static setMockMode(mock: boolean): void {
    this._isMockMode = mock;
  }

  public static setMockData(listTitle: string, data: any[]): void {
    this._mockData.set(listTitle, data);
  }

  public static getMockData<T>(listTitle: string): T[] {
    return (this._mockData.get(listTitle) || []) as T[];
  }

  public static Init(propiedades: ISeguridadFisicaWebPartProps): void {
    SPODataProvider._ServiceApiUrlAF = propiedades.ServiceApiUrlAF;
    SPODataProvider._HealthcheckApiUrl = propiedades.HealthcheckApiUrl;
    SPODataProvider._GisMapUrl = propiedades.GisMapUrl;
    this._sendEmailUrl = propiedades.sendEmailObj?.url || '';
    this._sendEmailKey = propiedades.sendEmailObj?.key || '';
    this.sp = spfi(getSP());
  }

  public static async isSiteCollectionAdmin(): Promise<boolean> {
    if (this.isMock()) return true;
    try {
      const currentUser = await this.sp.web.currentUser();
      return currentUser.IsSiteAdmin;
    } catch (error) {
      console.error('Error checking site collection admin:', error);
      return false;
    }
  }

  public static async isUserInGroup(groupName: string): Promise<boolean> {
    if (this.isMock()) return true;
    try {
      const currentUser = await this.sp.web.currentUser();
      const group = await this.sp.web.siteGroups();
      const matchingGroups = group.filter((group) => group.Title.startsWith(groupName));

      for (const grp of matchingGroups) {
        const users = await this.sp.web.siteGroups.getById(grp.Id).users();

        const found = users.some((u) => {
          return u.LoginName === currentUser.LoginName;
        });

        if (found) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  public static async add<T>(listTitle: string, item: T): Promise<number> {
    if (this.isMock()) return 1;
    const itemAdded = await this.sp.web.lists.getByTitle(listTitle).items.add(item);
    return itemAdded.Id;
  }

  public static async update<T>(
    listTitle: string,
    itemId: number,
    item: T,
  ): Promise<void> {
    if (this.isMock()) return;
    await this.sp.web.lists.getByTitle(listTitle).items.getById(itemId).update(item);
  }

  public static async delete<T>(listTitle: string, itemId: number): Promise<void> {
    if (this.isMock()) return;
    const list = this.sp.web.lists.getByTitle(listTitle);
    await list.items.getById(itemId).delete();
  }

  public static async getUsers(): Promise<any[]> {
    if (this.isMock()) return [];
    return await this.sp.web.siteUsers();
  }

  public static async getInternal(
    listTitle: string,
    internalName: string,
  ): Promise<IFieldInfo> {
    if (this.isMock()) return {} as IFieldInfo;
    return await this.sp.web.lists
      .getByTitle(listTitle)
      .fields.getByInternalNameOrTitle(internalName)();
  }

  public static getListId(listTitle: string): Promise<string> {
    if (this.isMock()) return Promise.resolve('mock-list-id');
    return this.sp.web.lists
      .getByTitle(listTitle)()
      .then((response) => {
        const id: string = response.Id;
        return id;
      });
  }

  public static async getLastComment(
    listTitle: string,
    AlertId: number,
  ): Promise<string> {
    if (this.isMock()) return 'Mock comment';
    const filter = `IDAlerta eq ${AlertId}`;
    const res = await this.sp.web.lists
      .getByTitle(listTitle)
      .items.select('ID', 'ComentarioDevolucion')
      .filter(filter)
      .orderBy('ID', false)
      .top(1)();
    if (res.length > 0) return res[0].ComentarioDevolucion;
    else return '';
  }

  public static getListItems<T>(
    listTitle: string,
    select: string = '*',
    filter: string = '',
    expand: string = '',
  ): Promise<T[]> {
    if (this.isMock()) {
      let mockItems = this.getMockData<T>(listTitle);
      // Aplicar filtro básico para modo mock
      if (filter) {
        // Filtro con campo expandido (ej: Region/Title eq 'NORTE')
        const expandedFieldMatch = filter.match(/(\w+)\/(\w+)\s+eq\s+'([^']+)'/);
        // Filtro con string simple (comillas simples)
        const eqMatchString = filter.match(/^(\w+)\s+eq\s+'([^']+)'$/);
        // Filtro con número simple (sin comillas)
        const eqMatchNumber = filter.match(/^(\w+)\s+eq\s+(\d+)$/);
        // Filtro de ID menor que (para antecedentes)
        const ltMatch = filter.match(/ID\s+lt\s+(\d+)/i);
        
        if (expandedFieldMatch) {
          const [, parentField, childField, fieldValue] = expandedFieldMatch;
          mockItems = mockItems.filter((item: any) => {
            const parent = item[parentField];
            if (parent && typeof parent === 'object') {
              return String(parent[childField]) === fieldValue;
            }
            return false;
          });
          // También filtrar por Activo eq 1 si está presente
          if (filter.includes('Activo eq 1')) {
            mockItems = mockItems.filter((item: any) => item.Activo === 1);
          }
        } else if (eqMatchString) {
          const [, fieldName, fieldValue] = eqMatchString;
          mockItems = mockItems.filter((item: any) => {
            const itemValue = item[fieldName];
            return String(itemValue) === fieldValue;
          });
        } else if (eqMatchNumber) {
          const [, fieldName, fieldValue] = eqMatchNumber;
          mockItems = mockItems.filter((item: any) => {
            const itemValue = item[fieldName];
            return itemValue === Number(fieldValue) || String(itemValue) === fieldValue;
          });
        } else if (ltMatch) {
          // Filtro complejo de antecedentes - filtrar por ID menor
          const maxId = Number(ltMatch[1]);
          mockItems = mockItems.filter((item: any) => item.Id < maxId);
          // Filtrar por Region si está presente
          const regionMatch = filter.match(/Region\s+eq\s+'([^']+)'/);
          if (regionMatch) {
            mockItems = mockItems.filter((item: any) => item.Region === regionMatch[1]);
          }
          // Filtrar por estados válidos (Finalizado, Concretado, Frustrado, etc.)
          const estadosValidos = ['Finalizado', 'Concretado', 'Frustrado', 'Frustrado por Int. SSFF', 'En investigación', 'Bloqueo de proceso'];
          mockItems = mockItems.filter((item: any) => estadosValidos.includes(item.Estado));
        }
      }
      return Promise.resolve(mockItems);
    }
    return this.sp.web.lists
      .getByTitle(listTitle)
      .items.select(select)
      .filter(filter)
      .expand(expand)
      .top(4999)()
      .then((response: T[]) => {
        return response;
      });
  }

  public static getItemById<T>(
    listTitle: string,
    id: number,
    select: string = '*',
    expand: string = '',
  ): Promise<T> {
    if (this.isMock()) {
      const mockItems = this.getMockData<any>(listTitle);
      const item = mockItems.find((i: any) => i.Id === id);
      return Promise.resolve((item || {}) as T);
    }
    return this.sp.web.lists
      .getByTitle(listTitle)
      .items.getById(id)
      .select(select)
      .expand(expand)()
      .then((response: T) => {
        return response;
      });
  }

  public static async checkIfExistFile(fileRelativeUrl: string): Promise<boolean> {
    if (this.isMock()) return false;
    try {
      await this.sp.web.getFileByServerRelativePath(fileRelativeUrl)();
      return true;
    } catch (error) {
      return false;
    }
  }

  public static async getFieldChoices(
    listTitle: string,
    fieldName: string,
  ): Promise<string[]> {
    if (this.isMock()) {
      // Devolver opciones mock según el campo
      const mockChoices: { [key: string]: string[] } = {
        'TipoAlerta': ['Alerta de Control', 'Alerta de Incidente', 'Alerta de Prevención'],
        'Estado': ['Ingresada', 'Asignada', 'Derivada a Aprobador', 'Finalizado', 'Concretado', 'Frustrado'],
        'HuellasEncontradas': ['Huellas dactilares', 'Huellas de calzado', 'Huellas de neumáticos', 'Sin huellas'],
        'RelacionConIncidente': ['Sospechoso', 'Testigo', 'Víctima', 'Denunciante'],
        'RelacionConEmpresa': ['Personal Empresa', 'Contratista', 'Tercero', 'Desconocido'],
      };
      return mockChoices[fieldName] || ['Opción 1', 'Opción 2'];
    }
    const field = await this.sp.web.lists
      .getByTitle(listTitle)
      .fields.getByInternalNameOrTitle(fieldName)();
    return field.Choices || [];
  }

  public static async getUserId(loginName: string): Promise<number | null> {
    if (this.isMock()) return 1;
    try {
      const user: ISiteUserInfo = await this.sp.web.ensureUser(loginName);
      return user.Id;
    } catch (error) {
      console.error('Error al obtener el Id del usuario:', error);
      return null;
    }
  }

  public static async getListFields(listTitle: string): Promise<IFieldInfo[]> {
    if (this.isMock()) {
      // Retornar campos mock para Impactos con opciones de choice
      if (listTitle === 'Impactos') {
        return [
          { InternalName: 'ImpactoPersonas', FieldTypeKind: 6, Choices: ['Nulo', 'Bajo', 'Medio', 'Alto'] },
          { InternalName: 'ImpactoInfraestructura', FieldTypeKind: 6, Choices: ['Nulo', 'Bajo', 'Medio', 'Alto'] },
          { InternalName: 'ImpactoOperaciones', FieldTypeKind: 6, Choices: ['Nulo', 'Bajo', 'Medio', 'Alto'] },
          { InternalName: 'ImpactoMedioambiente', FieldTypeKind: 6, Choices: ['Nulo', 'Bajo', 'Medio', 'Alto'] },
          { InternalName: 'ImpactoImagen', FieldTypeKind: 6, Choices: ['Nulo', 'Bajo', 'Medio', 'Alto'] },
          { InternalName: 'ImpactoInformacion', FieldTypeKind: 6, Choices: ['Nulo', 'Bajo', 'Medio', 'Alto'] },
          { InternalName: 'UnidadDeMedida', FieldTypeKind: 6, Choices: ['Pesos', 'Dólares', 'Litros', 'Metros', 'Unidades'] },
        ] as IFieldInfo[];
      }
      if (listTitle === 'DatosComplementarios') {
        return [
          { InternalName: 'HuellasEncontradas', FieldTypeKind: 6, Choices: ['Huellas dactilares', 'Huellas de calzado', 'Huellas de neumáticos', 'Sin huellas'] },
        ] as IFieldInfo[];
      }
      if (listTitle === 'Involucrados') {
        return [
          { InternalName: 'RelacionConIncidente', FieldTypeKind: 6, Choices: ['Sospechoso', 'Testigo', 'Víctima', 'Denunciante'] },
          { InternalName: 'RelacionConEmpresa', FieldTypeKind: 6, Choices: ['Personal Empresa', 'Contratista', 'Tercero', 'Desconocido'] },
        ] as IFieldInfo[];
      }
      if (listTitle === 'Alertas') {
        return [
          { InternalName: 'TipoAlerta', FieldTypeKind: 6, Choices: ['Alerta de Incidente', 'Alerta de Control', 'Alerta de Prevención'] },
          { InternalName: 'Estado', FieldTypeKind: 6, Choices: ['Ingresada', 'Asignada', 'DevueltaCOS', 'DerivadaAprobador', 'En investigación', 'Bloqueo de proceso', 'Finalizado', 'Concretado', 'Frustrado'] },
        ] as IFieldInfo[];
      }
      return [];
    }
    return await this.sp.web.lists.getByTitle(listTitle).fields();
  }

  public static async addImagenVideo<T>(
    listTitle: string,
    file: File,
    item: T,
  ): Promise<void> {
    let Nombre = encodeURI(file.name);
    if (file.size <= 10485760) {
      // small upload
      const resultado = await this.sp.web
        .getFolderByServerRelativePath(listTitle)
        .files.addUsingPath(Nombre, file, { Overwrite: true });
      const item2 = await this.sp.web
        .getFileByServerRelativePath(resultado.ServerRelativeUrl)
        .getItem<{ Id: number; Title: string }>('Id', 'Title');
      await SPODataProvider.update(listTitle, item2.Id, item);
    } else {
      // large upload
      const resultado = await this.sp.web
        .getFolderByServerRelativePath(listTitle)
        .files.addChunked(Nombre, file, {
          progress: (data) => {
            console.log('progress');
          },
          Overwrite: true,
        });
      const item2 = await this.sp.web
        .getFileByServerRelativePath(resultado.ServerRelativeUrl)
        .getItem<{ Id: number; Title: string }>('Id', 'Title');
      await SPODataProvider.update(listTitle, item2.Id, item);
    }
  }

  public static async getImagenVideo<T>(guidFile: string): Promise<IFile> {
    const file: IFile = await this.sp.web.getFileById(guidFile);
    return file;
  }

  public static async EnviarEmail(
    TOs: string[],
    CCs: string[],
    SUBJECT: string,
    Body: string,
  ): Promise<void> {
    let IDReq: number = 0;
    if (TOs.length > 0) {
      const email = new Email();
      email.To = TOs;
      email.CC = CCs;
      email.Subject = SUBJECT;
      let newstr: string = Body;
      //-----------------//
      email.Body = newstr;
      await SPODataProvider.send(email);
    }
  }

  public static async send(email: Email): Promise<void> {
    try {
      const emailData = {
        to: email.To,
        cc: email.CC,
        subject: email.Subject,
        body: email.Body,
        isHtml: true
      };
      const response = await fetch(`${this._sendEmailUrl}/api/Graph/sendMail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this._sendEmailKey
        },
        body: JSON.stringify(emailData)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      const result = await response.json();
      console.log('Email enviado exitosamente via Azure Function:', result);
    } catch (error) {
      console.error('Error al enviar email via Azure Function:', error);
      throw error;
    }
  }

  public static async GetUserEmail(name: string): Promise<string[]> {
    if (this.isMock()) return ['mock@email.com'];
    // get all users of group
    let usersEmails: string[] = [];
    const users = await this.sp.web.siteGroups.getByName(name).users();
    console.log(users);
    users.forEach((res) => {
      usersEmails.push(res.Email);
    });
    return usersEmails;
  }

  public static async GetCurrentUser(): Promise<ISiteUserInfo> {
    if (this.isMock()) return { Id: 1, Title: 'Mock User', Email: 'mock@email.com' } as ISiteUserInfo;
    let user = await this.sp.web.currentUser();
    return user;
  }

  public static GetGisURL(): string {
    return this._GisMapUrl;
  }

  public static async PushConexionGIS(alertDataId: number): Promise<string> {
    let resultado = '';
    try {
      let urlAF = `${SPODataProvider._ServiceApiUrlAF}/SendNotificacion/Alerta/${alertDataId}`;
      let response = await fetch(urlAF, {
        method: 'GET',
      });
      let result = await response.json();
      resultado = result;
      console.log('AF GIS:', resultado);
    } catch (error) {
      console.log('AF GIS error:', error);
      resultado = error;
    }
    return resultado;
  }
  public static async PushConexionMobile(
    alertDataId: number,
    comentario?: string,
  ): Promise<string> {
    let resultado = '';
    try {
      let urlAF = `${SPODataProvider._ServiceApiUrlAF}/SendNotificacionMobile/Alerta/${alertDataId}`;
      if (comentario !== undefined) {
        urlAF = urlAF + `?comentario=${comentario}`;
      }
      let response = await fetch(urlAF, {
        method: 'GET',
      });
      let result = await response.json();
      console.log('AF Mobile:', result);
      resultado = result;
    } catch (error) {
      console.log('Error AF Mobile:', error);
      resultado = error;
    }
    return resultado;
  }

  private static formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  public static async ExportaraExcel(Items: IAlerta[]): Promise<void> {
    const exportarColumns = [
      {
        name: 'Tipo de alerta',
        key: 'TipoAlerta',
        totalsRowLabel: '',
        totalsRowFunction: 'none' as 'none',
      },
      {
        name: 'Categoría principal',
        key: 'CategoriaPrincipal',
        totalsRowLabel: '',
        totalsRowFunction: 'none' as 'none',
      },
      {
        name: 'Categoría secundaria',
        key: 'CategoriaSecundaria',
        totalsRowLabel: '',
        totalsRowFunction: 'none' as 'none',
      },
      {
        name: 'Región',
        key: 'Region',
        totalsRowLabel: '',
        totalsRowFunction: 'none' as 'none',
      },
      {
        name: 'Instalación',
        key: 'Instalacion',
        totalsRowLabel: '',
        totalsRowFunction: 'none' as 'none',
      },
      {
        name: 'Fecha',
        key: 'FechaHoraIncidente',
        totalsRowLabel: '',
        totalsRowFunction: 'none' as 'none',
      },
      {
        name: 'Turno',
        key: 'Turno',
        totalsRowLabel: '',
        totalsRowFunction: 'none' as 'none',
      },
      {
        name: 'Estado',
        key: 'Estado',
        totalsRowLabel: '',
        totalsRowFunction: 'none' as 'none',
      },
    ];

    const AlertasDatos = [];

    Items.forEach((item) => {
      const fila = [
        item.TipoAlerta || '',
        item.CategoriaPrincipal?.Title || '',
        item.CategoriaSecundaria?.Title || '',
        item.Region || '',
        item.Instalacion || '',
        item.FechaHoraIncidente ? this.formatDate(item.FechaHoraIncidente) : '',
        item.Turno || '',
        item.Estado || '',
      ];

      AlertasDatos.push(fila);
    });

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Alertas');
    worksheet.addTable({
      name: 'Alertas',
      ref: 'A1',
      headerRow: true,
      totalsRow: false,
      style: {
        theme: 'TableStyleMedium2',
        showRowStripes: true,
      },
      columns: exportarColumns,
      rows: AlertasDatos,
    });

    exportarColumns.forEach((col, index) => {
      const header = col.name as string;
      worksheet.getColumn(index + 1).width = Math.max(header.length, 15);
    });
    let file = await workbook.xlsx.writeBuffer();
    const downloadLink = document.createElement('a');
    downloadLink.download = `${Date.now()}_Alertas.xlsx`;
    downloadLink.href = window.URL.createObjectURL(
      new Blob([file], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
    );
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  }
  public static async isConnected(): Promise<boolean> {
    if (this.isMock()) return true;
    const rootwebData = await this.sp.site.rootWeb();
    const urlCheck =
      SPODataProvider._HealthcheckApiUrl !== undefined
        ? SPODataProvider._HealthcheckApiUrl
        : rootwebData.ResourcePath.DecodedUrl;
    let connected = true;
    try {
      await axios.get(urlCheck);
      console.log('Conectado vpn');
    } catch (error) {
      connected = false;
      console.log('No conectado vpn');
    }
    return connected;
  }
  public static async getDocumentsFromLibrary(libraryUrl: string): Promise<IFileInfo[]> {
    if (this.isMock()) return [];
    try {
      const files = await this.sp.web.getFolderByServerRelativePath(libraryUrl).files();
      return files;
    } catch (error) {
      console.error('Error getting documents:', error);
      return [];
    }
  }
}
