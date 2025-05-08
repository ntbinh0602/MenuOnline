import { create } from 'zustand';
import { HistoryRequest, RequestAllData, RequestProduct, TRequestAllTable } from '../types/request.type';
import { Dayjs } from 'dayjs';
import http from '../utils/http';
import { showError } from '../utils/error';
import { Params } from '../types/params.type';
import { RequestProductStatus } from '../common/enum';
import { showMessage } from 'react-native-flash-message';

export interface FilterKitchen extends Params {
  search?: string;
  tableId?: string | null;
  status?: string | string[] | null;
  zoneId?: string | null;
  role?: string | null;
  startDate?: Dayjs | string;
  endDate?: Dayjs | string;
}

type ConfirmOrRejectBody = {
  quantity: number;
  reason?: string;
  id: string;
}[];

interface RequestProductCount {
  status: RequestProductStatus;
  count: string;
}

interface RequestProductStore {
  requestsProductInProgress: RequestProduct[];
  requestsProductComplete: RequestProduct[];
  requestsProductHistory: HistoryRequest[];
  dataTableInProgress: TRequestAllTable[];
  dataAllInProgress: RequestAllData[];
  dataTableComplete: TRequestAllTable[];
  isLoading: boolean;
  error: string | null;
  total: number;
  requestProductCounts: RequestProductCount[];
  setRequestProductInprogress: (
    updater: (prev: RequestProduct[], total?: number) => { data: RequestProduct[]; total: number }
  ) => void;
  setTableInprogress: (
    updater: (prev: TRequestAllTable[], total?: number) => { data: TRequestAllTable[]; total: number }
  ) => void;
  setAllInprogress: (
    updater: (prev: RequestAllData[], total?: number) => { data: RequestAllData[]; total: number }
  ) => void;
  setTableComplete: (
    updater: (prev: TRequestAllTable[], total?: number) => { data: TRequestAllTable[]; total: number }
  ) => void;
  setRequestProductComplete: (
    updater: (prev: RequestProduct[], total?: number) => { data: RequestProduct[]; total: number }
  ) => void;

  fetchRequestInProgress: (params: FilterKitchen) => Promise<void>;
  fetchRequestComplete: (params: FilterKitchen) => Promise<void>;
  fetchRequestHistory: (params: FilterKitchen) => Promise<void>;
  updateCompleteOrCancel: (data: ConfirmOrRejectBody, isComplete: boolean) => Promise<void>;
  updateServeOrRemade: (data: ConfirmOrRejectBody, isServe: boolean) => Promise<void>;
  fetchTableInProgress: (params: FilterKitchen) => Promise<void>;
  fetchAllInProgress: (params: FilterKitchen) => Promise<void>;
  fetchRequestProductCounts: () => Promise<void>;
  fetchTableComplete: (params: FilterKitchen) => Promise<void>;
}

const useRequestProductStore = create<RequestProductStore>((set) => ({
  requestsProductInProgress: [],
  requestsProductHistory: [],
  requestsProductComplete: [],
  dataTableInProgress: [],
  dataAllInProgress: [],
  dataTableComplete: [],
  isLoading: false,
  error: null,
  total: 0,
  requestProductCounts: [],

  setRequestProductInprogress: (updater) =>
    set((state) => {
      const updated = updater(state.requestsProductInProgress, state.total);
      return {
        requestsProductInProgress: updated.data,
        total: updated.total
      };
    }),
  setTableInprogress: (updater) =>
    set((state) => {
      const updated = updater(state.dataTableInProgress, state.total);
      return {
        dataTableInProgress: updated.data,
        total: updated.total
      };
    }),
  setTableComplete: (updater) =>
    set((state) => {
      const updated = updater(state.dataTableComplete, state.total);
      return {
        dataTableComplete: updated.data,
        total: updated.total
      };
    }),
  setAllInprogress: (updater) =>
    set((state) => {
      const updated = updater(state.dataAllInProgress, state.total);
      return {
        dataAllInProgress: updated.data,
        total: updated.total
      };
    }),
  setRequestProductComplete: (updater) =>
    set((state) => {
      const updated = updater(state.requestsProductComplete, state.total);
      return {
        requestsProductComplete: updated.data,
        total: updated.total
      };
    }),
  fetchRequestInProgress: async (params: FilterKitchen) => {
    set({ isLoading: true, error: null });
    try {
      const response = await http.get('/request-product/in-progress', { params });
      set({
        requestsProductInProgress: response.data,
        total: response.data.length,
        isLoading: false
      });
    } catch (error) {
      showError({ error, title: 'Lấy thông tin yêu cầu thất bại' });
      set({ isLoading: false, error: 'Lấy thông tin yêu cầu thất bại' });
      throw error;
    }
  },
  fetchTableComplete: async (params: FilterKitchen) => {
    set({ isLoading: true, error: null });
    try {
      const response = await http.get('/request-product/complete/table', { params });
      set({
        dataTableComplete: response.data,
        total: response.data.length,
        isLoading: false
      });
    } catch (error) {
      showError({ error, title: 'Lấy thông tin yêu cầu thất bại' });
      set({ isLoading: false, error: 'Lấy thông tin yêu cầu thất bại' });
      throw error;
    }
  },
  fetchTableInProgress: async (params: FilterKitchen) => {
    set({ isLoading: true, error: null });
    try {
      const response = await http.get('/request-product/in-progress/table', { params });
      set({
        dataTableInProgress: response.data,
        total: response.data.length,
        isLoading: false
      });
    } catch (error) {
      showError({ error, title: 'Lấy thông tin yêu cầu thất bại' });
      set({ isLoading: false, error: 'Lấy thông tin yêu cầu thất bại' });
      throw error;
    }
  },
  fetchAllInProgress: async (params: FilterKitchen) => {
    set({ isLoading: true, error: null });
    try {
      const response = await http.get('/request-product/in-progress/product', { params });
      set({
        dataAllInProgress: response.data,
        total: response.data.length,
        isLoading: false
      });
    } catch (error) {
      showError({ error, title: 'Lấy thông tin yêu cầu thất bại' });
      set({ isLoading: false, error: 'Lấy thông tin yêu cầu thất bại' });
      throw error;
    }
  },
  fetchRequestComplete: async (params: FilterKitchen) => {
    set({ isLoading: true, error: null });
    try {
      const response = await http.get('/request-product/complete', { params });
      set({
        requestsProductComplete: response.data,
        total: response.data.length,
        isLoading: false
      });
    } catch (error) {
      showError({ error, title: 'Lấy thông tin yêu cầu thất bại' });
      set({ isLoading: false, error: 'Lấy thông tin yêu cầu thất bại' });
      throw error;
    }
  },
  fetchRequestHistory: async (params: FilterKitchen) => {
    set({ isLoading: true, error: null });
    try {
      const response = await http.get('/request-product/history', { params });
      set({
        requestsProductHistory: response.data.data,
        total: response?.data?.totalItems,
        isLoading: false
      });
      return response.data;
    } catch (error) {
      showError({ error, title: 'Lấy thông tin yêu cầu thất bại' });
      set({ isLoading: false, error: 'Lấy thông tin yêu cầu thất bại' });
      throw error;
    }
  },
  updateServeOrRemade: async (data: ConfirmOrRejectBody, isServe: boolean) => {
    set({ isLoading: true });
    try {
      const response = await http.put(`/request-product/${isServe ? 'serve' : 'remade'}`, {
        data: data
      });
       showMessage({
        message: 'Thành công',
        description: response?.data?.message,
        type: 'success',
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      showError({ error, title: 'Xác nhận phục vụ món thất bại' });
      set({ isLoading: false, error: 'Xác nhận phục vụ món thất bại' });
      throw error;
    }
  },
  updateCompleteOrCancel: async (data: ConfirmOrRejectBody, isComplete: boolean) => {
    set({ isLoading: true });
    try {
      const response = await http.put(`/request-product/${isComplete ? 'complete' : 'cancel'}`, {
        data: data
      });
      // notification.success({
      //   message: response?.data?.message
      // });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      showError({ error, title: 'Xác nhận phục vụ món thất bại' });
      set({ isLoading: false, error: 'Xác nhận phục vụ món thất bại' });
      throw error;
    }
  },

  fetchRequestProductCounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await http.get('/request-product/count');
      set({
        requestProductCounts: response.data,
        isLoading: false
      });
    } catch (error) {
      showError({ error, title: 'Lấy số lượng yêu cầu chờ thất bại' });
      set({ isLoading: false });
      throw error;
    }
  }
}));

export default useRequestProductStore;
