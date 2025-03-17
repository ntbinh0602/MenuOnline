export interface CustomerInfo {
  customerId: string;
  customerName: string | null;
  tableName: string;
  zoneName: string;
  storeName: string;
  verifyToken: string;
  tableId: string;
  storeId?: string;
}
export interface Customers {
  id: string;
  createdAt: string;
  name: string;
  phone: string | null;
  accessTime: string;
}

export type PickExistCustomerId = Pick<CustomerInfo, 'customerId'>;
