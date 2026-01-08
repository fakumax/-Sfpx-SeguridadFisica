import ErrorMsg from '../entities/ErrorMsg';

export enum ActionTypes {
  SHOW_ERROR, //Para mostrar cualquier error
  SHOW_MESSAGE, //Para mostrar cualquier mensaje
  SHOW_SUCCESS, //Para mostrar una accion que salio bien
  SHOW_WARNING, //Para mostrar una accion que salio bien
  SHOW_MESSAGE_DELAY, //Mensaje que se muestra luego de un delay
  SHOW_SUCCESS_DELAY, //Mensaje que se muestra luego de un delay
}

export type Action =
  | { type: ActionTypes.SHOW_ERROR; payload: any }
  | { type: ActionTypes.SHOW_SUCCESS; payload: any }
  | { type: ActionTypes.SHOW_MESSAGE; payload: any }
  | { type: ActionTypes.SHOW_WARNING; payload: any }
  | { type: ActionTypes.SHOW_SUCCESS_DELAY; payload: any }
  | { type: ActionTypes.SHOW_MESSAGE_DELAY; payload: any };

export const InvokeShowError = (error: ErrorMsg): Action => ({
  type: ActionTypes.SHOW_ERROR,
  payload: error,
});
export const InvokeShowMessage = (message: ErrorMsg): Action => ({
  type: ActionTypes.SHOW_MESSAGE,
  payload: message,
});
export const InvokeShowSuccess = (message: ErrorMsg): Action => ({
  type: ActionTypes.SHOW_SUCCESS,
  payload: message,
});

export const InvokeShowWarninG = (message: ErrorMsg): Action => ({
  type: ActionTypes.SHOW_WARNING,
  payload: message,
});

export const InvokeShowDelayMessage = (message: ErrorMsg): Action => ({
  type: ActionTypes.SHOW_MESSAGE_DELAY,
  payload: message,
});

export const InvokeShowDelaySuccess = (message: ErrorMsg): Action => ({
  type: ActionTypes.SHOW_SUCCESS_DELAY,
  payload: message,
});
