import { Route, Routes, BrowserRouter } from "react-router-dom";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { UserProvider } from "./context/useAuth";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/RegisterPage";
import AuthVerify from "./components/AuthVerify";
import PlatosPage from "./pages/PlatosPage";
import { PlatosProvider } from "./context/PlatoProvider";
import { RushProvider } from "./context/RushProvider";
import RushPage from "./pages/RushPage";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="container mx-auto my-28 p-3">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/platos"
              element={
                <PlatosProvider>
                  <PlatosPage />
                </PlatosProvider>
              }
            />
            <Route
              path="/rush"
              element={
                <RushProvider>
                  <RushPage />
                </RushProvider>
              }
            />
          </Routes>
          <Toaster />
          <AuthVerify />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
