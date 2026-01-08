import { WebPartContext } from '@microsoft/sp-webpart-base';
import { formatDateFromString } from '../../../webparts/seguridadFisica/common/helpers';
import SPODataProvider from '../../pnp/sp/SharePointDataProvider';
import Correos, { ICorreos } from '../../entities/Correos';
import { AlertTypes, Estados, LIST_NAMES, CodigosCorreos } from '../../utils/Constants';
import { IAlerta } from '../../interfaces/IAlerta';

const GestionSeguridadFisica = 'Gestión de Seguridad Física';
let TituloAlertaConCambios = 'Aprobación de la alerta con cambios solicitados';
const NotificacionTexto = 'Este email es una notificación. No responder a este correo.';

const LogoEmpresa = `
<div style="font-size: 24px; font-weight: bold; color: #0078d4;">
  Seguridad Física
</div>
`;

const avisoLegalTemplate = (avisoLegal: {
  titulo: string;
  contenido: string;
}): string => {
  return `
      <div style="background-color: #ffffff; margin: 0; padding: 0">
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="600"
          style="
            border-collapse: collapse;
            background-color: #ffffff;
            margin-top: 10px;
          "
        >
          <tr>
            <td
              align="left"
              style="padding: 20px 10px; font-size: 12px; color: #888888"
            >
              <p style="margin: 0; line-height: 1.5">
                <strong>${avisoLegal.titulo}:</strong> ${avisoLegal.contenido}
              </p>
            </td>
          </tr>
        </table>
      </div>
    `;
};

const generateListItems = async (formValues: any, campos: any[]): Promise<string> => {
  const listItems = await Promise.all(
    campos.map(async (campo) => {
      const key = campo.key.replace(/[[\]]/g, '');
      let value;
      if (key === 'FechaHoraIncidente') {
        value = formatDateFromString(formValues[key]);
      } else if (key.includes('.Title')) {
        value = formValues[key.split('.')[0]]?.Title;
      } else if (key == LIST_NAMES.LOG_ALERTAS) {
        const comment = await SPODataProvider.getLastComment(
          LIST_NAMES.LOG_ALERTAS,
          formValues.Id,
        );
        if (comment) value = comment;
      } else {
        value = formValues[key];
      }

      return value
        ? `<li style="margin-bottom: 10px;">
            <span style="
              display: inline-block;
              width: 12px;
              height: 12px;
              background-color: #000000;
              border-radius: 50%;
              margin-right: 10px;
            "></span>
            <strong>${campo.label}:</strong> ${value}
          </li>`
        : '';
    }),
  );

  return listItems.join('');
};

export const formatearEmailBody = async (
  template: any,
  formValues: any,
  context: WebPartContext,
): Promise<string> => {
  const { BODY, AvisoLegal } = template;
  const bodyParsed = JSON.parse(BODY);
  const AvisoLegalParsed = JSON.parse(AvisoLegal);
  const listItems = await generateListItems(formValues, bodyParsed.campos);
  const alertLink = `${context.pageContext.web.absoluteUrl}/SitePages/Home.aspx#/alerta/${formValues.Id}`;

  return `
    <body
      style="
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      "
    >
      <table
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="100%"
        style="border-collapse: collapse; background-color: #ffffff"
      >
        <tr>
          <td
            style="
              padding: 20px 40px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border: none;
            "
          >
            ${LogoEmpresa} 

            <span
              style="
                color: #0078d4;
                font-weight: bold;
                font-size: 18px;
                display: inline-block;
              "
            >
              ${GestionSeguridadFisica}
            </span>
          </td>
        </tr>
      </table> 
      <table
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="600"
        style="border-collapse: collapse; margin: 1.5rem auto"
      >
        <tr>
          <td style="width: 8px; background-color: #0078d4">&nbsp;</td>
          <td
            style="
              padding: 4px 15px;
              font-size: 20px;
              font-weight: bold;
              color: #333333;
            "
          >
            ${TituloAlertaConCambios}
          </td>
        </tr>
      </table>

      <table
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="600"
        style="border-collapse: collapse; background-color: #ffffff"
      >
        <tr>
          <td align="left" style="padding: 20px; font-size: 16px; color: #333333">
            <p style="margin: 0 0 30px 0">
              ${bodyParsed.saludo}
            </p>

            <ul style="list-style-type: none; padding-left: 0">
              ${listItems}
            </ul>

            <p style="margin: 0 0 15px 0">
              <a
                href="${alertLink}"
                style="color: #0078d4; text-decoration: none; font-weight: bold"
              >
                ${bodyParsed.mensajeFinal.link}
              </a>
            </p>

            <p style="margin: 0">${bodyParsed.mensajeFinal.saludo}</p>
          </td>
        </tr>

        <tr>
          <td
            align="center"
            bgcolor="#f7f7f7"
            style="
              padding: 20px;
              font-size: 12px;
              color: #888888;
              background-color: #f4f4f4;
            "
          >
            ${NotificacionTexto}
          </td>
        </tr>
      </table>

      ${avisoLegalTemplate(AvisoLegalParsed)}
    </body>
  `;
};

const obtenerTitleId = async (
  listTitle: string,
  itemId: number,
): Promise<string | null> => {
  try {
    const item = await SPODataProvider.getItemById<{ Title: string }>(
      listTitle,
      itemId,
      'Title',
    );
    return item?.Title || null;
  } catch (error) {
    console.error(`Error al obtener el título del ítem en la lista ${listTitle}:`, error);
    return null;
  }
};

export const sendEmail = async (
  emailCode: string,
  alertData: IAlerta,
  context,
): Promise<void> => {
  const categoriaPrincipalTitle = await obtenerTitleId(
    'Categorias Principales',
    alertData.CategoriaPrincipal.Id,
  );
  const categoriaSecundariaTitle = await obtenerTitleId(
    'Categorias secundarias',
    alertData.CategoriaSecundaria.Id,
  );
  const unidadDeNegocioTitle = await obtenerTitleId('UUNN', alertData.UnidadDeNegocio.Id);
  const activoTitle = await obtenerTitleId('Activos', alertData.Activo.Id);
  const formValues = {
    ...alertData,
    Id: alertData.Id,
    CategoriaPrincipal: categoriaPrincipalTitle,
    CategoriaSecundaria: categoriaSecundariaTitle,
    UnidadDeNegocio: unidadDeNegocioTitle,
    Activo: activoTitle,
    Region: alertData.Region,
    Instalacion: alertData.Instalacion,
  };
  const filtro = `Codigo eq '${emailCode}'`;
  const items: ICorreos[] = await SPODataProvider.getListItems<ICorreos>(
    LIST_NAMES.CORREOS,
    '',
    filtro,
    '',
  );

  if (items.length === 0) {
    throw new Error('No se encontraron correos para el código especificado.');
  }

  const itemsCorreos = items.map((item) => new Correos(item));
  if (emailCode === CodigosCorreos.CO006) {
    TituloAlertaConCambios = 'Devolución de la alerta con cambios solicitados';
  }
  const body = await formatearEmailBody(itemsCorreos[0], formValues, context);
  const SUBJECT = itemsCorreos[0].SUBJECT.replace('[ID]', alertData.Id.toString());
  const grupo = itemsCorreos[0].TO.replace('[Region]', alertData.Region.toUpperCase());
  const TOs = await SPODataProvider.GetUserEmail(grupo);

  await SPODataProvider.EnviarEmail(TOs, [], SUBJECT, body);
};

export async function ValidateEmailApprove(
  alertData: any,
  statePermiso: string,
  context: WebPartContext,
  formValues: any,
  updateAlerta: (mensaje: string) => void,
): Promise<void> {
  const categoriaPrincipalTitle = await obtenerTitleId(
    'Categorias Principales',
    formValues.CategoriaPrincipal.Id,
  );
  const categoriaSecundariaTitle = await obtenerTitleId(
    'Categorias secundarias',
    formValues.CategoriaSecundaria,
  );
  const unidadDeNegocioTitle = await obtenerTitleId('UUNN', formValues.UnidadDeNegocio);
  const activoTitle = await obtenerTitleId('Activos', formValues.Activo);

  formValues = {
    ...formValues,
    Id: alertData.Id,
    CategoriaPrincipal: categoriaPrincipalTitle,
    CategoriaSecundaria: categoriaSecundariaTitle,
    UnidadDeNegocio: unidadDeNegocioTitle,
    Activo: activoTitle,
    Region: alertData.Region,
    Instalacion: alertData.Instalacion,
  };

  try {
    if (formValues.AlertaNovedad === 'Alerta SIN NOVEDAD') {
      await SPODataProvider.update(LIST_NAMES.ALERTAS, alertData.Id, {
        Estado: Estados.Finalizado,
      });
      updateAlerta(`La alerta Nro. ${alertData.Id} ha finalizado correctamente.`);
      return;
    }

    let codigo;
    if (formValues.TipoAlerta === AlertTypes.AlertaControl) {
      codigo = CodigosCorreos.CO004;
    } else if (formValues.TipoAlerta === AlertTypes.AlertaPrevencion) {
      codigo = CodigosCorreos.CO007;
    } else if (formValues.TipoAlerta === AlertTypes.AlertaIncidente) {
      codigo = CodigosCorreos.CO001;
    }
    const filtro = `Codigo eq '${codigo}'`;
    const items: ICorreos[] = await SPODataProvider.getListItems<ICorreos>(
      LIST_NAMES.CORREOS,
      '',
      filtro,
      '',
    );

    if (items.length === 0) {
      throw new Error('No se encontraron correos para el código especificado.');
    }

    const itemsCorreos = items.map((item) => new Correos(item));
    const body = await formatearEmailBody(itemsCorreos[0], formValues, context);
    const SUBJECT = itemsCorreos[0].SUBJECT.replace('[ID]', alertData.Id.toString());
    const grupo = itemsCorreos[0].TO.replace('[Region]', statePermiso);
    const TOs = await SPODataProvider.GetUserEmail(grupo);

    if (TOs.length === 0) {
      throw new Error('No se encontraron destinatarios para el grupo especificado.');
    }

    await SPODataProvider.EnviarEmail(TOs, [], SUBJECT, body);
    console.log('Correo de aprobación enviado exitosamente.');

    let newState;
    if (alertData.GerenteRegAsignado) {
      newState = Estados.AsignadaAprobador;
    } else {
      newState = Estados.DerivadaAprobador;
    }
    await SPODataProvider.update(LIST_NAMES.ALERTAS, alertData.Id, {
      Estado: newState,
    });
    updateAlerta(
      `La alerta Nro. ${alertData.Id} fue enviada a los aprobadores correctamente.`,
    );
  } catch (error: any) {
    console.error('EmailManager: Error al enviar mensaje, Message:', error.message);
    throw error;
  }
}
