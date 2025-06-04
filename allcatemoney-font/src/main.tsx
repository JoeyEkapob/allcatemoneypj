import React from 'react';
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { LoadingProvider } from "./context/LoadingContext.tsx";
import { AuthProvider } from './components/auth/AuthContext';
import { BrowserRouter } from "react-router";


createRoot(document.getElementById("root")!).render(

    <BrowserRouter>
      <LoadingProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppWrapper>
              <App />
            </AppWrapper>
          </AuthProvider>
        </ThemeProvider>
      </LoadingProvider>
    </BrowserRouter>
 ,
);
