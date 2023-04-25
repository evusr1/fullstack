import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { NotificationContextProvider } from "./NotificationContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <NotificationContextProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </NotificationContextProvider>
  </Router>
);
