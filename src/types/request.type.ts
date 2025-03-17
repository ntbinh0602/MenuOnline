import { RequestStatus } from '../common/enum';
import { Session } from './session.type';
import { Table, Zone } from './table.type';
import { User } from './user.type';

export interface RequestProduct {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  returnedQuantity: number;
  price: number;
  note: string | null;
  servedQuantity: number | 0;
  createdAt?: string;
  status: string;
  type?: string;
  
}

export interface RequestBody {
  type: string;
  problems: string | string[];
  note: string;
  requestProducts?: RequestProduct[];
}
export interface Request {
  id: string;
  type: string;
  status: string;
  requestProducts: RequestProduct[] | [];
  sessionCustomer: SessionCustomer;
  createdAt?: string;
  updatedAt?: string;
  note?: string | null;
  problems?: string[] | null;
  table?: Table;
  user?: User;
  rejectReason?: string
}

export interface RequestCounts {
  [RequestStatus.CANCELED]: number;
  [RequestStatus.CONFIRMED]: number;
  [RequestStatus.PENDING]: number;
  [RequestStatus.REJECTED]: number;
  [RequestStatus.SERVED]: number;
  [RequestStatus.INPROGRESS]: number;
  [RequestStatus.READY_TO_SERVE]: number;
}

export interface SessionCustomer {
  id: string;
  customer: Customer;
  sessionId: string;
  Session: Session;
}

export interface Customer {
  name?: string;
}

export type SimplifiedZone = Pick<Zone, 'id' | 'name'>;

export type SimplifiedTable = Pick<Table, 'id' | 'name' | 'status' | 'zone'> & {
  zone: SimplifiedZone; // Kết nối Zone đã đơn giản hóa
};
