export interface ErrorResponse<Data> {
  message: string;
  data?: Data;
}

export interface Option {
  label: string;
  value: string;
}

export interface TablePaginationProps {
  current: number;
  pageSize: number;
  total: number;
}
