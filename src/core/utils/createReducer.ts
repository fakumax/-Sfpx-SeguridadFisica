export interface IAction {
  type: string;
  payload?: any;
}

export interface IHandler<StateType> {
  [actionType: string]: (state: StateType, action: IAction) => StateType;
}

function createReducer<StateType>(handlers: IHandler<StateType>) {
  return (state: StateType, action: IAction): StateType =>
    handlers.hasOwnProperty(action.type) ? handlers[action.type](state, action) : state;
}

export default createReducer;
