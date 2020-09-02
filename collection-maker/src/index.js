import React from "react";
import ReactDOM, { render } from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import app, { FirebaseContext } from './Firebase';

ReactDOM.render(
  <BrowserRouter>
    <FirebaseContext.Provider value={app}>
      <App/>
    </FirebaseContext.Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
