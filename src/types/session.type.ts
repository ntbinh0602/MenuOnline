import { Table } from './table.type';
import { SessionCustomer } from './request.type';
import { SessionStatus } from '../common/enum';

export interface Session {
  id: string;
  status: SessionStatus;
  customerName: string;
  customerPhone: string;
  tableId: string;
  table: Table;
  sessionCustomers: SessionCustomer[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  deletedAt: string | null;
}
