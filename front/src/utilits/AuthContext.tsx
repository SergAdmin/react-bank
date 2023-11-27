import { createContext, useContext } from "react";

interface User {
  email: string | null;
  password: string | null;
  isConfirmed: boolean;
}

interface AuthState {
  token: string | null;
  user: User;
}

type Action = {
  type: "LOGIN" | "LOGOUT";
  email?: string;
  password?: string;
  token?: string;
  isConfirm?: boolean;
};

export const AuthReducer = (state: AuthState, action: Action) => {
  switch (action.type) {
    case "LOGIN":
      const token = window.localStorage.getItem("token");
      if (token) {
        state.token = token;
      }
      if (action.token) {
        window.localStorage.removeItem("token");
        window.localStorage.setItem("token", action.token);
        state.token = action.token;
      }
      if (action.email) {
        state.user.email = action.email;
      }
      if (action.password) {
        state.user.password = action.password;
      }

      if (action.isConfirm) {
        state.user.isConfirmed = action.isConfirm;
      } else {
        state.user.isConfirmed = false;
      }
      return state;
    case "LOGOUT":
      state.token = null;
      state.user = {
        email: null,
        password: null,
        isConfirmed: false,
      };
      return state;

    default:
      return state;
  }
};

export const AuthContext = createContext<
  | {
      state: AuthState;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Error with AuthContext");
  }

  return context;
};
