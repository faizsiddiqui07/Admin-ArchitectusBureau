import React, { useReducer } from "react";
import storeContext from "./storeContext";
import decode_token from "../utils/index";
import storeReducer from "./storeReducer";

const StoreProvider = ({ children }) => {

  const [store, dispatch] = useReducer(storeReducer, {
    userInfo: decode_token(localStorage.getItem("BureauToken")),
    token: localStorage.getItem("BureauToken") || "",
  });



  return (
    <storeContext.Provider value={{ store, dispatch }}>
      {children}
    </storeContext.Provider>
  );
};

export default StoreProvider
