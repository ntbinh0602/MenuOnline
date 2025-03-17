import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

interface ShowErrorArgument {
  error: unknown;
  title: string;
  message?: string;
  hideNotification?: boolean;
}
type ShowErrorWithoutTitle = Omit<ShowErrorArgument, 'title'>;

export const showError = ({
  error,
  title = '',
  message = 'Lỗi không xác định',
  hideNotification = false
}: ShowErrorArgument) => {
  if (axios.isAxiosError(error)) {
    message = error?.response?.data?.message || error?.response?.data || error?.message || message;
  }
  if (!hideNotification)
    showMessage({
          message: title,
          description: message,
          type: 'warning',
        })
   
};
export const showErrorMessage = ({
  error,
  message: defaultMessage = 'Lỗi không xác định',
  hideNotification = false
}: ShowErrorWithoutTitle) => {
  let errorMessage = defaultMessage;
  if (axios.isAxiosError(error)) {
    errorMessage = error?.response?.data?.message || error?.message || defaultMessage;
  }
  if (!hideNotification) {
       showMessage({
          message: 'Thông báo',
          description: errorMessage,
          type: 'warning',
        })
  }
};
