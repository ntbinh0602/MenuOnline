import { passwordRegex } from 'src/shared/utils/regex';
import * as yup from 'yup';

export const changePasswordSchema = yup.object({
    currentPassword: yup.string()
        .required("Vui lòng nhập mật khẩu"),
    newPassword: yup.string()
        .required('Vui lòng nhập mật khẩu')
        .matches(
            passwordRegex,
            'Mật khẩu phải có ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt'
        ),
    confirmNewPassword: yup.string()
        .required('Vui lòng nhập mật khẩu')
        .oneOf([yup.ref('newPassword')], 'Vui lòng nhập đúng với mật khẩu mới')
        .matches(
            passwordRegex,
            'Mật khẩu phải có ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt'
        ),
});
export const changePasswordSchemaWithOutConfirmNewPassword = changePasswordSchema.omit(["confirmNewPassword"]);
export type ChangePasswordPayload = yup.InferType<typeof changePasswordSchema>;
export type ChangePasswordPayloadWithOutConfirmNewPassword = yup.InferType<typeof changePasswordSchemaWithOutConfirmNewPassword>;
