export default interface IEmailManager<Email> {
	send(email: Email): Promise<void>;
}