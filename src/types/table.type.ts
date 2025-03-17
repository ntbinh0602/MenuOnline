import { Store } from './store.type';
import { Session } from './session.type';
import { TableStatus } from '../common/enum';

export interface Zone {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  storeId: string;
  store: Store;
  tables: Table[];
}

export interface Table {
  id: string;
  name: string;
  status: TableStatus;
  productCategoryId: string;
  zoneId: string;
  zone: Zone;
  storeId: string;
  store: Store;
  pendingRequestsCount?: number;
  sessions: Array<Session>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type TableResponse = {
  data: string;
};
