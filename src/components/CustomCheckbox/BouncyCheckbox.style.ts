import {StyleSheet} from 'react-native';

export default StyleSheet.create<any>({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconImageStyle: {
    width: 10,
    height: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  iconContainer: (
    size: number,
    checked: boolean,
    fillColor: string,
    unFillColor: string,
  ) => ({
    width: size,
    height: size,
    borderRadius: 4,
    backgroundColor: checked ? fillColor : unFillColor,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  innerIconContainer: (size: number, checked: boolean, fillColor: string) => ({
    width: size,
    height: size,
    borderWidth: 1,
    borderColor: checked ? fillColor : 'gray',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  textStyle: () => ({
    fontSize: 14,
    color: '#757575',
  }),
});
