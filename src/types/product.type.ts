import { ProductCategory } from './categoryProduct.type';
import { Store } from './store.type';

export interface Product {
  id: string;
  thumbnail: string;
  name: string;
  price: number;
  description: string;
  unit: string;
  status: string;
  productCategoryId: string;
  storeId: string;
  productCategory: ProductCategory;
  store: Store;
  note: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ProductPublic {
  id: string;
  name: string;
  products: Product[];
}
export interface Unit {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  thumbnail: string;
  name: string;
  price: number;
  description: string;
  unit: string;
  status: string;
  productCategoryId: string;
  storeId: string;
  productCategory: ProductCategory;
  store: Store;
}

export type Products = Pick<Product, 'id' | 'thumbnail' | 'name' | 'price' | 'description'>;

export type ProductResponse = {
  data: string;
};
export interface ListUnit {
  id: string;
  name: string;
}
