import AzureResponse from './AzureResponse';
import AzureApi from './AzureApi';
import Email from '../entities/Email';
import { Item } from '../entities';

export class AzureFunction {
  public static async GetVersion(): Promise<AzureResponse> {
    let response: AzureResponse = null;

    let az = new AzureApi();
    response = await az.Get('GetVersion');

    return response;
  }

  public static async SendEmail(email: Email): Promise<AzureResponse> {
    let response: AzureResponse = null;

    let az = new AzureApi();
    response = await az.Get('email', email, false);

    return response;
  }

  public static async CreatePrueba(itemPrueba: Item): Promise<AzureResponse> {
    let response: AzureResponse = null;

    let az = new AzureApi();
    response = await az.Get('crearprueba', itemPrueba, false);

    return response;
  }
}
