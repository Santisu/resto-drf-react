import { createContext, useEffect, useState, useContext } from "react";
import { AuthTokens, UserProfile } from "../models";
import axios from "axios";
import toast from "react-hot-toast";
import { getNewAccessToken, loginAPI, registerAPI } from "../api/authService";
import { JwtAdapter } from "../config/jwt.adapter";
import { JwtPayload } from "jsonwebtoken";
import { CustomError } from "../errors/CustomError";


type UserContextType = {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  registerUser: (email: string, password: string) => void;
  loginUser: (email: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  setLocalStorage: (authTokens: AuthTokens) => void;
  updateAccessToken: () => void;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({}  as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (user && accessToken) {
      setUser(JSON.parse(user));
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;	
    }
    setIsReady(true);
  }, []);

  const registerUser = async (
    email: string,
    password: string
  ) => {
    await registerAPI(email, password)
      .then((res) => {
        if (res!.status === 201) {
          toast.success("Register Success! Please Login");
        }
      })
      .catch((error: CustomError) => {
        toast.error(error.message);
        throw error;      
      });
  };
  
  const loginUser = async (email: string, password: string) => {
    await loginAPI(email, password)
      .then((res) => {
        if (res) {
          const authTokens = res?.data;
          setLocalStorage(authTokens);
          toast.success("Login Success!");
        }
      })
      .catch((error: CustomError) => {
        toast.error(error.message);
        throw error;
      });
  };

  const updateAccessToken = async () => {
  const result = await getNewAccessToken(refreshToken!)
    .then((res) => {
      if (res) {
        const authTokens = res?.data;
        setLocalStorage(authTokens);
        setLocalStorage(authTokens);
        return true
      }
    })
    .catch((error: CustomError) => {
      throw error;
    });
    return result
  }


  const setLocalStorage = (authTokens: AuthTokens) => {
    const { access_token, refresh_token } = authTokens;
    const { email } = JwtAdapter.decode(access_token) as JwtPayload;
    const userObj: UserProfile = {
      email: email,
    };
    localStorage.setItem("user", JSON.stringify(userObj));
    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setUser(userObj);
  };

  const isLoggedIn = () => {
    return !!user;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setAccessToken("");
    setRefreshToken("")
  };
  
  return (
    <UserContext.Provider
      value={{ loginUser, user, accessToken, refreshToken, logout, isLoggedIn, registerUser, setLocalStorage, updateAccessToken }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );


}

export const useAuth = () => useContext(UserContext);
 