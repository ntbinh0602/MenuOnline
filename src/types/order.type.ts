import { Product } from './product.type';
import { Request } from './request.type';
import { Session } from './session.type';
import { Table } from './table.type';
export interface OrderProduct {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  note: string;
  orderId: string;
  order: Order;
  productId: string;
  product: Product;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface Order {
  id: string;
  code: string;
  tableName: string;
  zoneName: string;
  customerName: string;
  customerPhone: string;
  status: string;
  paymentMethod: string;
  staffName: string;
  staffUsername: string;
  totalAmount: number;
  paidAt: string;
  tableId: string;
  requestIds: string;
  table: Table;
  products: OrderProduct[];
  requests: Request[];
  session: Session;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateOrderPayload {
  tableId: string;
  sessionId: string;
  tableName: string;
  zoneName: string;
}

export interface UpdateOrderPayload {
  products: OrderProduct[];
}

export interface PayOrderPayload {
  status: string;
  paymentMethod: string;
}
