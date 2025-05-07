import {Dimensions, StyleProp, ViewStyle} from 'react-native';

const {height} = Dimensions.get('window');
const DROPDOWN_MAX_HEIGHT = height * 0.4;

/**
 * Hàm `calculateDropdownHeight` tính toán chiều cao của dropdown dựa trên các style và số lượng dữ liệu.
 *
 * @param dropdownStyle - Style của dropdown, có thể bao gồm thuộc tính `height`.
 * @param rowStyle - Style của mỗi hàng, có thể bao gồm thuộc tính `height`.
 * @param dataLength - Số lượng dữ liệu trong dropdown.
 * @returns Chiều cao cuối cùng của dropdown, không vượt quá `DROPDOWN_MAX_HEIGHT`.
 */
export const calculateDropdownHeight = (
  dropdownStyle: StyleProp<ViewStyle> | undefined,
  rowStyle: StyleProp<ViewStyle> | undefined,
  dataLength: number,
): number => {
  const dropdownHeight =
    dropdownStyle &&
    typeof dropdownStyle === 'object' &&
    'height' in dropdownStyle
      ? (dropdownStyle as ViewStyle).height
      : undefined;

  if (typeof dropdownHeight === 'number') {
    return dropdownHeight;
  }

  if (dataLength === 0) {
    return 150;
  }

  const count = dataLength;

  const rowHeight =
    rowStyle && typeof rowStyle === 'object' && 'height' in rowStyle
      ? (rowStyle as ViewStyle).height
      : 50;

  const calculatedHeight =
    (typeof rowHeight === 'number' ? rowHeight : 50) * count;
  return calculatedHeight < DROPDOWN_MAX_HEIGHT
    ? calculatedHeight
    : DROPDOWN_MAX_HEIGHT;
};
