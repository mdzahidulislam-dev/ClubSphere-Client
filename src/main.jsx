import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import bgImage from "./assets/bg.png";
import "./index.css";
import AuthProvider from "./Context/AuthProvider.jsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Router.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <div
        style={{
          height: "full",
          width: "full",
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}>
        <RouterProvider router={router}></RouterProvider>
        <ToastContainer></ToastContainer>
      </div>
    </AuthProvider>
  </StrictMode>
);
