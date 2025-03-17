import { User, UserStore } from './user.type';

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};
export type RefreshTokenReponse = { accessToken: string };

export type LoginPayLoad = {
  username: string;
  password: string;
};

export type LoginResponse = {
  userStores: Array<UserStore>;
  verifyToken: string;
};

export type ChooseStorePayLoad = {
  storeId: string;
  token: string;
};

export type ChooseStoreResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
