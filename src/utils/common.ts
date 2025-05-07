import { Dimensions, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import { RequestProduct } from "../types/request.type";
import { StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';
type Style = StyleProp<ViewStyle | TextStyle | ImageStyle>;
// Define types for the window dimensions
const { width, height }: { width: number, height: number } = Dimensions.get('window');

// IS_TABLET will be a boolean, as DeviceInfo.isTablet() returns a boolean value
export const IS_TABLET: boolean = DeviceInfo.isTablet();

// IS_IOS and IS_ANDROID are booleans as well, based on platform checks
export const IS_IOS: boolean = Platform.OS === 'ios';
export const IS_ANDROID: boolean = Platform.OS === 'android';

export const getUpdateRequestProductQuantity = (requestProduct: RequestProduct) => {
  return {
    quantity: requestProduct.quantity,
    completedQuantity: requestProduct.completedQuantity,
    servedQuantity: requestProduct.servedQuantity,
    status: requestProduct.status,
    requestProductHistories: requestProduct.requestProductHistories
  };
};
export const mergeStyles = (...styles: Style[]): Style => {
  const flattened = styles.flat();

  return flattened.reduce((merged: any, style) => ({
    ...merged,
    ...(style as object),
  }), {});
};

type Item = {
  id: string | number;
  [key: string]: any;
};

export const checkDuplicateId = (source: Item[], target: Item[]): Item[] => {
  for (const srcObj of source) {
    if (!target.find(obj => obj.id === srcObj.id)) {
      target.push(srcObj);
    }
  }
  return target;
};