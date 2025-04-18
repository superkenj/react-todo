import React from "react";
import ReactDOM from "react-dom/client"; // make sure it's from 'react-dom/client'
import "./components/Auth.css";
import App from "./App";
import { LanguageProvider } from './context/LanguageContext';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
);
