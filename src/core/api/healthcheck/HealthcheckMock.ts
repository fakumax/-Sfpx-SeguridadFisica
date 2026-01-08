import IHealthcheckDatasource from './IHealthcheckDatasource';

export default class HealthcheckMock implements IHealthcheckDatasource {
	public async isConnected(): Promise<boolean> {
		return Promise.resolve(true);
	}
}
