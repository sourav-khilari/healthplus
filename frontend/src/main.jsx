import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { StrictMode } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./reducers"; // Assuming you have a rootReducer file

// Create the Redux store
const store = createStore(rootReducer);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <PayPalScriptProvider options={{ "client-id": "your-client-id" }}>
      <Provider store={store}>
        <App />
      </Provider>
    </PayPalScriptProvider>
  </StrictMode>
);
