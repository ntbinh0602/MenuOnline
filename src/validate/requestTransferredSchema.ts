import * as yup from 'yup';

export const requestTransferredSchema = yup.object({
  count: yup.number().optional(),
  reason: yup.string().trim().required('Vui lòng nhập lý do')
});

export type RequestTransferredPayload = yup.InferType<typeof requestTransferredSchema>