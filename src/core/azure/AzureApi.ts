import { Observable, InvokeShowError } from '..';
import AzureResponse from './AzureResponse';
import { AZURE_URL, AZURE_ERROR, AZURE_API } from '../utils/Constants';

export default class AzureApi {
  public async CheckConnectivity(op: string): Promise<boolean> {
    try {
      let headers = new Headers();
      headers.append('accept', 'application/json;odata.metadata=none');

      let params: RequestInit;
      params = {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'default',
      };

      let url = `${AZURE_URL}/${AZURE_API}/${op}`;
      let info: RequestInfo = new Request(url);
      let request: Request = new Request(info, params);
      let resOk = false;
      return fetch(request)
        .then(async (res) => {
          let cResponse = res.clone();
          switch (cResponse.status) {
            case 200:
              let jsonOk = await cResponse.json();
              let azureResultOk: AzureResponse = jsonOk as AzureResponse;
              console.log(JSON.stringify(azureResultOk));
              resOk = true;
              break;
            case 400:
              let json = await cResponse.json();
              let azureResult: AzureResponse = json as AzureResponse;
              let errMsg = `${AZURE_ERROR} - > ${azureResult.Status}: ${azureResult.Message}, ${azureResult.Value}`;
              console.log('Error 400 details: ', errMsg);
              break;
            default:
              let errText = await cResponse.text();
              errText = !errText
                ? `Status: ${cResponse.status} - StatusText: ${cResponse.statusText}`
                : `${AZURE_ERROR}  -> ${errText}`;
              console.log('Error details: ', errText);
              break;
          }
          return resOk;
        })
        .catch((error) => {
          console.log(JSON.stringify(error.toString()));
          if (error.message == 'Failed to fetch') {
            let azRes = new AzureResponse();
            azRes.Status = 'ERROR';
            azRes.Message = error.message;
            azRes.Value = error;
            console.log(error.toString());
          } else {
            console.log(error.toString());
          }
          return false;
        });
    } catch (error) {
      console.log(error.toString());
      return false;
    }
  }

  public async Get(
    op: string,
    data: any = null,
    isGet: boolean = true,
    isJson: boolean = true
  ): Promise<AzureResponse> {
    try {
      let headers = new Headers();
      headers.append('accept', 'application/json;odata.metadata=none');
      let params: RequestInit;
      let url = `${AZURE_URL}/${AZURE_API}/${op}`;

      if (isGet) {
        params = {
          method: 'GET',
          headers: headers,
          mode: 'cors',
          cache: 'default',
        };
        if (data) {
          let query = '';
          for (var d in data) {
            if (query.length > 0) {
              query = query + '&';
            }
            query = query + `${d}=${data[d]}`;
          }
          url = `${url}?${query}`;
        }
      } else {
        headers.append('Content-Type', 'application/json');

        params = {
          method: 'POST',
          headers: headers,
          mode: 'cors',
          cache: 'default',
          body: isJson ? JSON.stringify(data) : data,
        };
      }

      let info: RequestInfo = new Request(url);
      let request: Request = new Request(info, params);
      let response = await fetch(request);
      let cResponse = response.clone();
      let resOk: AzureResponse = null;
      switch (cResponse.status) {
        case 200:
          let jsonOk = await cResponse.json();
          let azureResultOk: AzureResponse = jsonOk as AzureResponse;
          resOk = azureResultOk;
          break;
        case 400:
          let json = await cResponse.json();
          let azureResult: AzureResponse = json as AzureResponse;
          resOk = azureResult;

          let errMsg = `${AZURE_ERROR} - > ${azureResult.Status}: ${azureResult.Message}, ${azureResult.Value}`;
          Observable.Instance().Invoke(InvokeShowError({ value: errMsg, Msg: errMsg }));
          break;
        default:
          let errText = await cResponse.text();
          errText = `${AZURE_ERROR}  -> ${errText}`;
          Observable.Instance().Invoke(InvokeShowError({ value: errText, Msg: errText }));
          break;
      }
      return resOk;
    } catch (error) {
      Observable.Instance().Invoke(
        InvokeShowError({
          value: `Error de red: ${AZURE_ERROR} ->  ${error.message}`,
          Msg: error,
        })
      );
      return null;
    }
  }
}
