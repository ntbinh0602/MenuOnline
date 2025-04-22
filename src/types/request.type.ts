import { RequestStatus } from '../common/enum';
import { Session } from './session.type';
import { Table, Zone } from './table.type';
import { User } from './user.type';

export interface RequestProduct {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  completedQuantity: number;
  price: number;
  note: string | null;
  reason: string | null;
  servedQuantity: number | 0;
  status: string;
  type: string;
  request: Request;
  createdAt: string;
  updatedAt: string;
  requestProductHistories?: HistoryRequest[];
  product?: {
    thumbnail: string;
  };
}
export interface HistoryRequest {
  id: string;
  createdAt: string;
  quantity: number;
  reason: string | null;
  status: string;
  requestProduct: RequestProduct;
  user: {
    name: string;
  };
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
  rejectReason?: string;
  paymentAmount?: number;
  confirmedAt?: string;
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

export type TRequestAllTable = {
  id: string;
  name: string;
  zone: TZone;
  requests: TRequest[];
};

export type TRequest = {
  id: string;
  requestProducts: TRequestProduct[] | [];
  sessionCustomer: SessionCustomer;
  note?: string | null;
  confirmedAt?: string;
};

export type TRequestProduct = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  completedQuantity: number;
  price: number;
  note: string | null;
  reason: string | null;
  servedQuantity: number | 0;
  createdAt?: string;
  status: string;
  requestProductHistories?: HistoryRequest[];
  product: {
    thumbnail: string;
  };
};
type TZone = {
  id: string;
  name: string;
};
export interface RequestProductInfo {
  id: string;
  note: string | null;
  reason: string | null;
  price: number;
  status: string;
  request: Request;
  quantity: number;
  createdAt: string;
  servedQuantity: number;
  completedQuantity: number;
  confirmedAt: string;
  requestProductHistories?: HistoryRequest[];
  product: {
    thumbnail: string;
  };
}

export interface RequestAllData {
  productId: string;
  productName: string;
  minCreatedAt: string;
  totalQuantity: string;
  requestProducts: RequestProductInfo[];
  product: {
    thumbnail: string;
  };
}
