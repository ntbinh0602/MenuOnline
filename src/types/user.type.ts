import { Store } from './store.type';

export type Role = 'STORE_OWNER' | 'STAFF';

export interface UserStore {
  storeId: string;
  store: Store;
  userId: string;
  role: Role;
}
export interface Bank {
 id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name: string;
  support: number;
  isTransfer: number;
  swift_code: string;

}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  isActive: boolean;
  tokenVersion: number;
  isSystemAdmin: string;
  address: string;
  currentUserStore: UserStore;
  avatar: string;
  store: Store;
  userStores: UserStore[];
}
