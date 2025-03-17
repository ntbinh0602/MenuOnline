import * as yup from 'yup';

export const categoryProductSchema = yup.object({
  name: yup.string().required('Vui lòng nhập tên danh mục').trim()

});
export type CategoryPayload = yup.InferType<typeof categoryProductSchema>