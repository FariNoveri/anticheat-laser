import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleReCaptchaProvider reCaptchaKey="6Le710gtAAAAAHFGnt1roQWWbnVlt2BS32q3S5Sg">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleReCaptchaProvider>
  </React.StrictMode>
);