import axios, { AxiosError, HttpStatusCode } from 'axios';
import dayjs from 'dayjs';
import { ErrorResponse } from '../types/utils.type';
import { RequestCounts } from '../types/request.type';
import { UserStore } from '../types/user.type';
import { roleTypes } from '../common/constant';


export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error);
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity;
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized;
}

export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error) &&
    error.response?.data?.data?.name === 'EXPIRED_TOKEN'
  );
}

export const formatDate = (date: string | undefined, withTime?: boolean) => {
  if (!date) return '';
  let format = 'DD/MM/YYYY';
  if (withTime) format += ' HH:mm:ss';
  return dayjs(date).format(format);
};

export const formatTime = (date: string | undefined) => {
  if (!date) return '';
  return dayjs(date).format('HH:mm:ss');
};

export const formatCurrency = (value: number | undefined) => (value ? new Intl.NumberFormat().format(value) : '');

export const getConfirmMessage = ({ SERVED, PENDING, INPROGRESS }: RequestCounts) => {
  if (!SERVED && !INPROGRESS && !SERVED) {
    return 'Phiên này không có yêu cầu gọi món hoặc chưa được xác nhận, bạn có muốn đóng phiên đặt món của khách không?';
  }
  if (PENDING && INPROGRESS) {
    return 'Còn yêu cầu món chưa xác nhận phục vụ và đang thực hiện. Bạn có chắc muốn tiếp tục hoàn tất để thanh toán đơn hàng không?';
  }
  if (PENDING) {
    return 'Còn yêu cầu chưa phục vụ, vui lòng kiểm tra trước khi thực hiện thanh toán. Bạn có muốn bỏ qua các yêu cầu chưa xác nhận?';
  }
  if (INPROGRESS) {
    return 'Còn yêu cầu đang thực hiện. Bạn có muốn tiếp tục không?';
  }
  return '';
};
