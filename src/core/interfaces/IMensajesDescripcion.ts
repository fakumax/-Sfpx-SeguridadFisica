import { IUser } from './IUser';

export interface IMensajesDescripcion {
  Id?: string;
  Title?: string;
  Comentario?: string;
  IDAlerta?: string;
  Created?: string;
  Modified?: string;
  Author?: IUser;
  Editor?: IUser;
  isModified?: boolean;
}
