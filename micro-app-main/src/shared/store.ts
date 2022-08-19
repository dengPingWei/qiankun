import { createStore } from "redux";

export type State = {
  token?: string;
  headerNavList?: any;
  global?: any;
  user?: any
};

type Action = {
  type: string;
  payload: any;
};

const reducer = (state: State = {}, action: Action): State => {
  switch (action.type) {
    default:
      return state;
    // 设置 Token
    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload,
      };
    // 设置global
    case "SET_GLOBAL":
      return {
        ...state,
        global: action.payload,
      };
    // 设置user
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_HEADER_NAV":
      return {
        ...state,
        headerNavList: action.payload,
      };
      
  }
};

const store = createStore<State, Action, unknown, unknown>(reducer);

export default store;
