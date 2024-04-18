import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { JwtAdapter } from "../config/jwt.adapter";
import toast from "react-hot-toast";

export default function AuthVerify() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken, updateAccessToken, logout } = useAuth();

  useEffect(() => {
    const verifyToken = async () => {
      if (accessToken) {
        if (JwtAdapter.isTokenExpired(accessToken)) {
          try {
            await updateAccessToken();
          } catch (error) {
            toast.error("Sesión expirada reinicie sesión");
            logout()
            navigate("/login");
          }
        }
      }
    };

    verifyToken();
  }, [location]);

  return null
};


