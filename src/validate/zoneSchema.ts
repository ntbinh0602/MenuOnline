import * as yup from 'yup';

export const zoneSchema = yup.object({
  name: yup.string().trim().required('Vui lòng nhập tên khu vực')
});

export type ZonePayload = yup.InferType<typeof zoneSchema>;
