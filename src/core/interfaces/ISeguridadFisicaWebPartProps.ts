import { ISendEmailConfig } from '../../webparts/seguridadFisica/components/ListaAlerta/ISeguridadFisicaProps';

export interface ISeguridadFisicaWebPartProps {
  description: string;
  ServiceApiUrlAF: string;
  HealthcheckApiUrl: string;
  GisMapUrl: string;
  enlaces: Array<{
    title: string;
    url: string;
  }>;
  sendEmailObj: ISendEmailConfig;
}
