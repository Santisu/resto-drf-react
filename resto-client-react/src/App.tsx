// import { useState } from 'react'
import {
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { UserProvider } from "./context/useAuth";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/RegisterPage";
import AuthVerify from "./components/AuthVerify";

function App() {
  return (
      <BrowserRouter>
      <UserProvider>
          
            <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />}></Route>
            </Routes>
          
            <Toaster />
            <AuthVerify/>
        </UserProvider> 
      </BrowserRouter>
  );
}

export default App;
