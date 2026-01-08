import axios from 'axios';

import IHealthcheckDatasource from './IHealthcheckDatasource';

export default class HealthcheckDatasource implements IHealthcheckDatasource {

	private healthcheckApiUrl: string;

	constructor(healtcheckApiUrl: string) {
		this.healthcheckApiUrl = healtcheckApiUrl;
	}

	public async isConnected(): Promise<boolean> {
		const response = await axios.get(this.healthcheckApiUrl);
		return response && response.data && response.data.connected;
	}
}
