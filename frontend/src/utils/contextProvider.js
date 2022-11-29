/* eslint-disable react/forbid-prop-types */
import React, { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";

const initialState = {
  loggedUser: {},
  loggedIn: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        loggedUser: action.user,
        loggedIn: true
      };
    case "LOGOUT":
      return {
        ...state,
        loggedUser: {},
        loggedIn: false,
      };
    default:
      return state;
  }
};

const UserStateContext = createContext(null);
const UserDispatchContext = createContext(null);

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>{children}</UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

export const useUserState = () => {
  const state = useContext(UserStateContext);
  if (!state) throw new Error("Cannot find UserProvider");
  return state;
};

export const useUserDispatch = () => {
  const dispatch = useContext(UserDispatchContext);
  if (!dispatch) throw new Error("Cannot find UserProvider");
  return dispatch;
};

UserProvider.propTypes = {
  children: PropTypes.any.isRequired,
};
