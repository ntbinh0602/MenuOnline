import * as yup from 'yup';

export const CompanySchema = yup.object({
  name: yup.string().required('Vui lòng nhập tên công ty'),
  taxCode: yup.string().optional(),
  legalRepresentative: yup.string().optional(),
  address: yup.string().optional(),
});

export type CompanyPayload = yup.InferType<typeof CompanySchema>;
