export default interface IHealthcheckDatasource {
	isConnected(): Promise<boolean>;
}
