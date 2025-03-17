import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'https://ctynamviet.1erp.vn/be-order/api/v1/'
export const URL_LOGIN = '/auth/login';
export const URL_CHOOSE_STORE = '/auth/choose-store';
export const URL_CHANGE_PASSWORD = '/auth/change-password';
export const URL_CURRENT_USER = 'auth/current-user';
export const URL_REFRESH_TOKEN = '/auth/refresh';
export const URL_CUSTOMER = 'start-order/';
export const URL_JOINORDER = 'join-order';

export const setAccessTokenToLS = async (accessToken: string) => {
  await AsyncStorage.setItem('accessToken', accessToken);
};

export const setVerifyTokenToLS = async (verifyToken: string) => {
  await AsyncStorage.setItem('verifyToken', verifyToken);
};

export const setCustomerInfo = async (info: {
  customerId: string;
  customerName: string | null;
  tableName: string;
  zoneName: string;
  storeName: string;
}) => {
  const customerInfo = {
    ...info,
    customerName: info.customerName || 'Khách hàng ẩn danh',
  };
  await AsyncStorage.setItem('customerInfo', JSON.stringify(customerInfo));
};

export const getCustomerInfo = async () => {
  const customerInfo = await AsyncStorage.getItem('customerInfo');
  return customerInfo ? JSON.parse(customerInfo) : null;
};

export const clearLS = async () => {
  await AsyncStorage.removeItem('accessToken');
};

export const getAccessTokenFromLS = async () => {
  return (await AsyncStorage.getItem('accessToken')) || '';
};

export const getVerifyTokenFromLS = async () => {
  return (await AsyncStorage.getItem('verifyToken')) || '';
};
