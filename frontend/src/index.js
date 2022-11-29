import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import App from "./pages/App";
import Home from "./pages/Home";
import { UserProvider } from "./utils/contextProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="test/:id" element={<App />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </UserProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
