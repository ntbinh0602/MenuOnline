export interface Metadata {
  id: string;
  type: string;
  status: string;
  tableName: string;
  zoneName: string;
}

export interface Notifications {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  name: string;
  content: string;
  type: string;
  metadata: Metadata;
  storeId: string;
  isRead: boolean;
}
