import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Keyboard,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {LoginBackground} from '../../assets';
import {useForm, FormProvider, SubmitHandler} from 'react-hook-form';
import {CustomTextInput} from '../../components/CustomTextInput';
import {CustomButton} from '../../components/CustomButton';
import Colors from '../../utils/colors';
import useAuthStore from '../../store/authStore';
import {LoginPayLoad} from '../../types/auth.type';
import {UserStore} from '../../types/user.type';
import {roleTypes} from '../../common/constant';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/rootParam.type';
import {AuthStackScreens, NavigationStackScreens} from '../../common/enum';
import {showMessage} from 'react-native-flash-message';

type Props = NativeStackScreenProps<RootStackParamList, AuthStackScreens.Login>;

const Login: React.FC<Props> = ({navigation}) => {
  const {isLoading, login, chooseStore} = useAuthStore();
  const methods = useForm<LoginPayLoad>();
  const height = Dimensions.get('window').height;
  const getUserStores = (userStores: Array<UserStore>) => {
    return userStores.map(currentUserStore => ({
      value: currentUserStore.storeId,
      label: `${
        roleTypes.find(roleType => roleType.value === currentUserStore.role)
          ?.label || ''
      } ${currentUserStore.store.name}`,
    }));
  };

  const onSubmit: SubmitHandler<LoginPayLoad> = async data => {
    try {
      const response = await login(data);
      const userStoreOptions = getUserStores(response?.userStores || []) || [];
      await chooseStore({
        token: response?.verifyToken || '',
        storeId: userStoreOptions[1].value || '',
      });
      showMessage({
        message: 'Đăng nhập thành công',
        description: 'Chào mừng bạn đến với order tại bàn!',
        type: 'success',
      });
      navigation.replace(NavigationStackScreens.MainNavigation);
    } catch (error) {
      console.error(error);
    }
  };

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event: any) => {
        Animated.timing(translateY, {
          toValue: -event.endCoordinates.height / 2,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        Animated.timing(translateY, {
          toValue: 0, // Trả về vị trí cũ
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ImageBackground
        style={[styles.container, {height: height}]}
        source={LoginBackground}>
        <Animated.View
          style={[styles.formWrapper, {transform: [{translateY}]}]}>
          <Text style={styles.textHeader}>Đăng nhập</Text>
          <FormProvider {...methods}>
            <CustomTextInput
              name="username"
              label="Tài khoản"
              placeholder="name@email.com"
              keyboardType="email-address"
              rules={{required: 'Tài khoản là bắt buộc!'}}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputStyle}
            />
            <CustomTextInput
              name="password"
              label="Mật khẩu"
              inputType="password"
              placeholder="Password"
              rules={{required: 'Mật khẩu là bắt buộc!'}}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputStyle}
            />
          </FormProvider>
          <View style={styles.actionWrapper}>
            <CustomButton
              loading={isLoading}
              buttonStyle={styles.loginButton}
              type="primary"
              onPress={methods.handleSubmit(onSubmit)}>
              Đăng nhập
            </CustomButton>
          </View>
        </Animated.View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHeader: {
    textAlign: 'center',
    textTransform: 'uppercase',
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 28,
    marginBottom: 30,
  },
  formWrapper: {
    paddingVertical: 45,
    paddingHorizontal: 50,
    borderRadius: 30,
    backgroundColor: '#fff',
    width: 500,
    shadowColor: '#ccc',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 13,
  },
  forgotButton: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#5E677C',
  },
  actionWrapper: {
    paddingHorizontal: 10,
  },
  loginButton: {
    borderRadius: 28,
    height: 56,
    marginTop: 30,
  },
  checkbox: {
    marginVertical: 15,
  },
  inputContainer: {
    borderRadius: 28,
  },
  inputStyle: {
    paddingHorizontal: 16,
    height: 50,
  },
});
