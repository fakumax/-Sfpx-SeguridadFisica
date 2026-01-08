import * as React from 'react';
import { useReducer } from 'react';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { createReducer } from '../../../core/utils';
import HealthcheckDatasource from './HealthcheckDatasource';
import HealthcheckMock from './HealthcheckMock';
import IHealthcheckDatasource from './IHealthcheckDatasource';

const LOAD = 'LOAD';
const ERROR = 'ERROR';
const RECEIVE_CONNECTED = 'RECEIVE_CONNECTED';

export interface IHealthcheckDatasourceOptions {
  healthcheckApiUrl: string;
}

export interface IDatasourceHook {
  isConnected: boolean;
  testConnection(): Promise<void>;
}

export default function useHealthcheck({
  healthcheckApiUrl,
}: IHealthcheckDatasourceOptions): IDatasourceHook {
  const datasource: IHealthcheckDatasource = React.useMemo(
    () =>
      Environment.type === EnvironmentType.Local
        ? new HealthcheckMock()
        : new HealthcheckDatasource(healthcheckApiUrl),
    [healthcheckApiUrl, Environment.type],
  );

  const datasourceReducer = createReducer<boolean>({
    [LOAD]: () => true,
    [ERROR]: () => false,
    [RECEIVE_CONNECTED]: (state, action) => action.payload,
  });

  const [datasourceState, dispatch] = useReducer(datasourceReducer, true);

  const handleAsync =
    (asyncFn: (...args: any[]) => Promise<void>) =>
    async (...args: any[]) => {
      try {
        await asyncFn(...args);
      } catch (error) {
        console.error('healthcheck', error);
        dispatch({ type: ERROR });
      }
    };

  const testConnection = React.useMemo(
    () =>
      handleAsync(async () => {
        dispatch({ type: LOAD });
        const isConnected = await datasource.isConnected();
        dispatch({ type: RECEIVE_CONNECTED, payload: isConnected });
      }),
    [datasource],
  );

  const hookState = React.useMemo<IDatasourceHook>(
    () => ({
      isConnected: datasourceState,
      testConnection,
    }),
    [datasourceState, testConnection],
  );

  return hookState;
}
