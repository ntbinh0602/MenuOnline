import * as yup from 'yup';

export const tableSchema = yup.object({
  name: yup.string().trim().required('Vui lòng nhập tên bàn'),
  zoneId: yup.string().required('Vui lòng chọn khu vực')
});

export type TablePayload = yup.InferType<typeof tableSchema>;
