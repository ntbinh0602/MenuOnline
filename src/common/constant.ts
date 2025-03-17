import DeviceInfo from 'react-native-device-info';
import { OrderStatus, RoleType, TableStatus } from './enum';

export const roleTypes = [
  {
    label: 'Chủ cửa hàng',
    value: RoleType.STORE_OWNER
  },
  {
    label: 'Nhân viên',
    value: RoleType.STAFF
  }
];

export const roleOwnerTypes = [
  {
    label: 'Bếp',
    value: RoleType.CHEF
  },
  {
    label: 'Nhân viên',
    value: RoleType.STAFF
  },
   {
    label: 'Quản lý',
    value: RoleType.MANAGER
  }
];

export const roleManagerTypes = [
  {
    label: 'Bếp',
    value: RoleType.CHEF
  },
  {
    label: 'Nhân viên',
    value: RoleType.STAFF
  }
];


export const tableStatus = [
  {
    label: 'Bàn trống',
    value: TableStatus.EMPTY
  },
  {
    label: 'Đang sử dụng',
    value: TableStatus.OCCUPIED
  }
];

export const problems = [
  { value: 'Món ăn', title: 'Món ăn' },
  { value: 'Không gian', title: 'Không gian' },
  { value: 'Nhân viên', title: 'Nhân viên' },
  { value: 'Chất lượng dịch vụ', title: 'Chất lượng dịch vụ' },
  { value: 'Khác', title: 'Khác' }
];

export const orderStatus = [
  {
    label: 'Đã thanh toán',
    value: OrderStatus.PAID
  },
  {
    label: 'Chưa thanh toán',
    value: OrderStatus.UNPAID
  }
];