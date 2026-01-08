import { AzureFunction } from './AzureFunctions';
import AzureResponse from './AzureResponse';
import { Item } from '../entities';
import Email from '../entities/Email';

export default class AFBackend {
  public static async sendEmail(item: Item): Promise<AzureResponse> {
    let result: AzureResponse = null;
    let email = new Email();
    email.To = new Array(item.Creador.Email);
    email.CC = new Array('');
    email.Subject = 'Se agrego un nuevo elemento: ' + item.Titulo;
    email.Body = `<h3>Se agrego un nuevo elemento en la lista de prueba</h3>
					<table class="tftable" border="1">
						<tr><th colspan="2" style="text-align:center;">Nuevo elemento en lista de prueba</th></tr>
						<tr><td>ID: ${item.Id}</td><td>Título: ${item.Titulo}</td></tr>
					</table>`;
    result = await AzureFunction.SendEmail(email);
    return result;
  }

  public static async createPrueba(item: Item): Promise<AzureResponse> {
    let result: AzureResponse = null;
    result = await AzureFunction.CreatePrueba(item);
    return result;
  }
}
