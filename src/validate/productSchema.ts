import * as yup from 'yup';

export const productSchema = yup.object({
  name: yup.string().required('Vui lòng nhập tên sản phẩm').trim(),
  productCategoryId: yup.string().required('Vui lòng chọn danh mục'),
  unit: yup.string().required('Vui lòng chọn tên đơn vị'),
  price: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Vui lòng nhập giá trị sản phẩm')
    .min(0, 'Giá trị sản phẩm không được nhỏ hơn 0'),
  description: yup.string().optional(), 
});
export type ProductPayload = yup.InferType<typeof productSchema>