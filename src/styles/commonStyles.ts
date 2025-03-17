import {
  widthPercentageToDP as w_p,
  heightPercentageToDP as h_p,
} from 'react-native-responsive-screen'

// Hàm để kiểm tra hướng của màn hình và trả về wp hoặc hp tương ứng

const getResponsiveDimensionForWidth = () => {
  if (w_p('100%') > h_p('100%')) {
    return w_p
  } else {
    return h_p
  }
}

const getResponsiveDimensionForHeight = () => {
  if (w_p('100%') > h_p('100%')) {
    return h_p
  } else {
    return w_p
  }
}

// Sử dụng hàm getResponsiveDimension để lấy wp hoặc hp tùy thuộc vào hướng của màn hình
const wp = getResponsiveDimensionForWidth()
const hp = getResponsiveDimensionForHeight()
export {wp, hp}

export const fontSize = {
  font6: wp(0.6),
  font8: wp(0.8),
  font10: wp(1),
  font12: wp(1.1),
  font13: wp(1.2),
  font14: wp(1.3),
  font15: wp(1.4),
  font16: wp(1.5),
  font18: wp(1.7),
  font20: wp(1.9),
  font22: wp(2.1),
  font24: wp(2.3),
  font26: wp(2.5),
  font30: wp(2.7),
}

export const radius = {
  radius5: wp(0.5),
  radius10: wp(0.8),
  radius15: wp(1.1),
  radius20: wp(1.4),
  radius25: wp(1.7),
  radius30: wp(2),
  radius35: wp(2.3),
  radius40: wp(2.6),
  radius45: wp(2.9),
  radius50: wp(3.2),
}

export const iconSize = {
  icon15: wp(1.5),
  icon20: wp(2),
  icon25: wp(2.5),
  icon30: wp(3),
  icon35: wp(3.5),
  icon40: wp(4),
  icon45: wp(4.5),
  icon50: wp(5),
}

export const space = {
  space5: wp(0.3),
  space10: wp(0.6),
  space15: wp(0.9),
  space20: wp(1.2),
  space25: wp(1.5),
  space30: wp(1.8),
  space35: wp(2.1),
  space40: wp(2.4),
  space45: wp(2.7),
  space50: wp(3),
  space55: wp(3.3),
  space60: wp(3.6),
  space65: wp(3.9),
  space70: wp(4.2),
  space75: wp(4.5),
  space80: wp(4.8),
  space85: wp(5.1),
  space90: wp(5.4),
  space95: wp(5.7),
  space100: wp(6),
  space105: wp(6.3),
  space110: wp(6.6),
  space115: wp(6.9),
  space120: wp(7.2),
  space125: wp(7.5),
  space130: wp(7.8),
  space135: wp(8.1),
  space140: wp(8.4),
  space145: wp(8.7),
  space150: wp(9),
}
