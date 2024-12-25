import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {} from "react-router-dom";
import { StrictMode } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <PayPalScriptProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </PayPalScriptProvider>
);
