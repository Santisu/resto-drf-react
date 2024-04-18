import axios from "axios";
import { AuthTokens, RefreshToken } from "../models";
import { CustomError } from "../errors/CustomError";

const api = "http://localhost:8000/api/";

const authApi = axios.create({
  baseURL: api,
});

const restrictedApi = axios.create({
  baseURL: api,
});

authApi.interceptors.request.use(
  config => {
    if (config.headers.Authorization) {
      delete config.headers.Authorization;
    }
    return config;
  }
)

restrictedApi.interceptors.request.use(
  config => {
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${localStorage.getItem(
        "accessToken"
      )}`;
    }
    return config;
  }
)

// restrictedApi.interceptors.request.use(
  
//     async config => {
//     const accessToken = localStorage.getItem('accessToken');
//     if (accessToken) {
//       const isExpired = JwtAdapter.isTokenExpired(accessToken);
//       if (isExpired) {
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (JwtAdapter.isTokenExpired(refreshToken!)) {
//           console.log("TOKEN EXXPI")
//         }
//         const { access_token: newAccessToken } = await getNewAccessToken(refreshToken!)
//                                                 .then((res) => { 
//                                                   const newAccessToken: AccessToken = res?.data
//                                                   return newAccessToken
//                                                 });
//         if (newAccessToken) {
//           config.headers['Authorization'] = `Bearer ${newAccessToken}`;
//           return config;
//         }
//       }
//     }
//     config.headers['Authorization'] = `Bearer ${accessToken}`;
//     return config;
//     },
//     error => {
//       return Promise.reject(error);
//     }
// );

export const registerAPI = async (email: string, password: string) => {
  try {
    const data = await authApi.post(`register/`, {
      email: email,
      password: password,
    });
    return data;
  } catch (error: any) {
    throw new CustomError(error.response.status, error.response.data);
  }
};

export const loginAPI = async (email: string, password: string) => {
  try {
    const data = await authApi.post<AuthTokens>(`login/`, {
      email: email,
      password: password,
    });
    return data;
  } catch (error: any) {
    throw new CustomError(error.response.status, error.response.data);
  }
};

export const getNewAccessToken = async (refreshToken: RefreshToken) => {
  try {
    const data = await authApi.post<AuthTokens>(`refresh/`, {
      refresh_token: refreshToken,
    });
    return data;
  } catch (error: any) {
    throw new CustomError(error.response.status, error.response.data);
  }
};


export const restrictedView = async() => {
  try {
    const data = await restrictedApi.get(`restricted/`);
    console.log(data)
    return data;
  } catch (error: any) {
    throw new CustomError(error.response.status, error.response.data);
  }
}