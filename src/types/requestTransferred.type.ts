import { Request, RequestProduct, SessionCustomer } from './request.type';
import { Table } from './table.type';

export interface RequestTransferred {
  quantity: number;
  servedQuantity:number;
  id: string;
  createdAt: string;
  type: string;
  status: string;
  confirmedAt?: string ;
  requestProducts: RequestProduct[];
  sessionCustomer: SessionCustomer;
  table: Table;
  user: User;
  note:string;
}
export interface RequestProductRemade {
  id: string;
  createdAt: string;
  productId: string;
  productName: string;
  quantity: number;
  note: string | null;
  price: number;
  reasonRemade: string;
  request: Request;
}
export interface User {
  name: string;
}