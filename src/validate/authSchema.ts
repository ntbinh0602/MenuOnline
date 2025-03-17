import * as yup from 'yup';

const loginSchema = yup.object({
  username: yup.string().required('Vui lòng nhập tên đăng nhập'),
  password: yup.string().required('Vui lòng nhập mật khẩu')
});

const chooseStoreSchema = yup.object({
  storeId: yup.string().required('Vui lòng chọn cửa hàng')
});

export { loginSchema, chooseStoreSchema };
