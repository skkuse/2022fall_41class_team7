/* eslint-disable react/forbid-prop-types */
import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

const Context = createContext({
  loggedUser: {
    id: "",
    name: "",
    student_id: "",
  },
  loggedIn: false,
  setLoggedUser: () => {},
  setLoggedIn: () => {}
});

export default Context;

export const function ContextProvider({ children }) {
  const setLoggedUser = (data) => {
    setState((prevState) => (
      {
        ...prevState,
        loggedUser: data
      }
    ));
  };

  const setLoggedIn = () => {
    setState((prevState) => (
      {
        ...prevState,
        loggedIn: !prevState.loggedIn
      }
    ));
  };

  const initialState = {
    loggedUser: {},
    loggedIn: false,
    setLoggedUser,
    setLoggedIn
  };

  const [state, setState] = useState(initialState);

  return (
    <Context.Provider value={state}>
      {children}
    </Context.Provider>
  );
}

ContextProvider.propTypes = {
  children: PropTypes.any.isRequired,
};

export default ContextProvider;