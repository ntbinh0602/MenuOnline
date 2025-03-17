import axios, { AxiosError, HttpStatusCode, type AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BASE_URL,
  clearLS,
  setAccessTokenToLS,
  setCustomerInfo,
  setVerifyTokenToLS,
  URL_CHOOSE_STORE,
  URL_CUSTOMER,
  URL_JOINORDER,
  URL_LOGIN,
  URL_REFRESH_TOKEN
} from './auth';
import { CustomerInfo } from '../types/customer.type';
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils';
import { ErrorResponse } from '../types/utils.type';
import { AuthResponse, RefreshTokenReponse } from '../types/auth.type';

export class Http {
  instance: AxiosInstance;
  private refreshTokenRequest: Promise<string> | null;
  
  constructor() {
    this.refreshTokenRequest = null;
    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: 120000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.instance.interceptors.request.use(
      async (config) => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const verifyToken = await AsyncStorage.getItem('verifyToken');

        if (accessToken && config.headers) {
          config.headers.authorization = `Bearer ${accessToken}`;
        }
        if (verifyToken && config.headers) {
          config.headers['order-info'] = verifyToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    this.instance.interceptors.response.use(
      async (response) => {
        const { url } = response.config;
        if (url === URL_CHOOSE_STORE) {
          const data = response.data as AuthResponse;
          await setAccessTokenToLS(data.accessToken);
        }
        if (url?.includes(URL_CUSTOMER) || url?.includes(URL_JOINORDER)) {
          const customerInfo = response.data as CustomerInfo;
          const { verifyToken } = customerInfo;
          await setVerifyTokenToLS(verifyToken);
          setCustomerInfo(customerInfo);
        }
        return response;
      },
      async (error: AxiosError) => {
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          const data: any | undefined = error.response?.data;
          const message = data?.message || error.message;
          console.log(message);
        }

        if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
          const config = error.response?.config || { headers: {}, url: '' };
          const { url } = config;

          if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  setTimeout(() => {
                    this.refreshTokenRequest = null;
                  }, 10000);
                });
            return this.refreshTokenRequest.then(async (accessToken) => {
              return this.instance({
                ...config,
                headers: { ...config.headers, authorization: `Bearer ${accessToken}` }
              });
            });
          }

          await clearLS();
        }
        return Promise.reject(error);
      }
    );
  }
  
  private async handleRefreshToken() {
    return this.instance
      .get<RefreshTokenReponse>(URL_REFRESH_TOKEN, {
        withCredentials: true
      })
      .then(async (res) => {
        const { accessToken } = res.data;
        await setAccessTokenToLS(accessToken);
        return accessToken;
      })
      .catch(async (error) => {
        await clearLS();
        throw error;
      });
  }
}
const http = new Http().instance;
export default http;
