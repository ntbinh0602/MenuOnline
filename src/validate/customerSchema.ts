import * as yup from 'yup';

export const CustomerSchema = yup.object({
  name: yup.string().required('Vui lòng nhập tên khách hàng'),

  phone: yup
  .string()
  .notRequired() // Không bắt buộc nhập
  .nullable() // Cho phép giá trị null
  // .matches(/^[0-9]+$/, 'Số điện thoại phải chứa chỉ các chữ số') // Chỉ kiểm tra nếu có giá trị
  .test(
    'length',
    'Số điện thoại phải có từ 10 đến 15 chữ số',
    (value) => !value || (value.length >= 10 && value.length <= 15)
  )
});

export type CustomerPayload = yup.InferType<typeof CustomerSchema>;
