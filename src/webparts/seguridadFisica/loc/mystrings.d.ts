declare interface ISeguridadFisicaWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  ServiceApiUrlAF: string;
  HealthcheckApiUrl: string;
  GisMapUrl: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
  UnknownEnvironment: string;
  SendEmailURL: string;
  SendEmailKey: string;
}

declare module 'SeguridadFisicaWebPartStrings' {
  const strings: ISeguridadFisicaWebPartStrings;
  export = strings;
}
