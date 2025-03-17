import { Dimensions, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

// Define types for the window dimensions
const { width, height }: { width: number, height: number } = Dimensions.get('window');

// IS_TABLET will be a boolean, as DeviceInfo.isTablet() returns a boolean value
export const IS_TABLET: boolean = DeviceInfo.isTablet();

// IS_IOS and IS_ANDROID are booleans as well, based on platform checks
export const IS_IOS: boolean = Platform.OS === 'ios';
export const IS_ANDROID: boolean = Platform.OS === 'android';
