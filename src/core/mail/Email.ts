import { IEmailProperties } from '@pnp/sp/sputilities';

export default class Email implements IEmailProperties{
    public Body: string;
    public Subject: string;
    public To: string[];
    public CC: string[];
}