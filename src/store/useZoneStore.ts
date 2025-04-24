import { create } from 'zustand';
import { Params } from '../types/params.type';
import { Zone } from '../types/table.type';
import http from '../utils/http';
import { showError } from '../utils/error';

export interface FilterZones extends Params {
  status?: string | string[];
}
interface ZoneStore {
  zones: Zone[];
  isLoading: boolean;
  fetchZones: (params?: FilterZones) => Promise<void>;

}

const useZoneStore = create<ZoneStore>((set) => ({
  zones: [],
  isLoading: false,

  fetchZones: async (params?: FilterZones) => {
    set({ isLoading: true });
    try {
      const response = await http.get('/zone', { params });
      set({ zones: response.data, isLoading: false });
    } catch (error) {
      showError({ error, title: 'Lấy thông tin khu vực thất bại' });
      set({ isLoading: false });
    }
  },


}));

export default useZoneStore;
