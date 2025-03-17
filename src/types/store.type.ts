import { Company } from "./company.type";

export interface Store {
  id: string;
  name: string;
  address: string;
  thumbnail: string;
  email?: string;
  phone?: string;
  slogan: string;
  bankBin?: string;
  bankNumber?: string;
  accountHolder?: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  company: Company;
}
