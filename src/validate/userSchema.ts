import * as yup from 'yup';

export const userFormSchema = yup.object({
  username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),

  email: yup.string().required('Email is required').email('Must be a valid email'),

  age: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Age is required')
    .positive('Age must be a positive number')
    .integer('Age must be an integer')
    .min(18, 'Must be at least 18 years old'),
  description: yup.string().optional()
});

export const editProfileSchema = yup.object({
  name: yup.string().required('Vui lòng nhập tên nhân viên').trim(),
  phone: yup
    .string()
    .matches(/^0\d{9}$/, 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0')
    .required('Vui lòng nhập số điện thoại'),
  address: yup.string().optional(),
});

export const editProfileStoreSchema = yup.object({
  name: yup.string().required('Vui lòng nhập tên công ty/ cửa hàng').trim(),
  email: yup.string()
    .test('is-email-valid', 'Email không hợp lệ', (value) => {
      if (!value || value.trim() === '') {
        return true; // Trả về true nếu email trống, không cần kiểm tra regex
      }
      // Nếu email không phải là chuỗi trống, kiểm tra bằng regex
      const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      return emailRegex.test(value); // Kiểm tra email hợp lệ bằng regex
    }),
  address: yup.string().optional(),
  phone: yup
    .string()
    .nullable() // Cho phép giá trị là null hoặc undefined
    .test('is-valid-phone', 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0', value => {
      if (!value) return true; // Nếu giá trị là null, undefined hoặc trống, không validate
      return /^0\d{9}$/.test(value); // Kiểm tra số điện thoại hợp lệ nếu có giá trị
    })
    .optional(),
  slogan: yup.string().required('Vui lòng nhập slogan').trim(),
  bankNumber: yup.string().matches(/^[a-zA-Z0-9]*$/, 'Số tài khoản chỉ được nhập chữ và số').optional(),
  bankBin: yup.string().optional(),
  accountHolder: yup.string().optional(),
});

export type UserFormData = yup.InferType<typeof userFormSchema>;
export type ProfilePayload = yup.InferType<typeof editProfileSchema>
export type ProfileStorePayload = yup.InferType<typeof editProfileStoreSchema>