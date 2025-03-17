import { UserStore } from "./user.type";


export interface Employee {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  username: string;
  name: string;
  email: string | null;
  phone: string;
  isActive: boolean;
  tokenVersion: number;
  isSystemAdmin: boolean;
  address: string | null;
  userStores: UserStore[];
}

export interface RoleOption {
  value: string; // or number, depending on the type of the value
  label: string;
}
