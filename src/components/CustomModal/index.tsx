import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {CustomButton} from '../CustomButton';
import LoadingLayer from '../Loading/LoadingLayer';
import Colors from '../../utils/colors';

interface CustomModalProps {
  visible?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  modalIcon?: () => void;
  width?: string | number;
  title?: string;
  children?: React.ReactNode;
  modalStyle?: object;
  contentStyle?: object;
  headerStyle?: object;
  closeText?: string;
  confirmText?: string;
  closeVisible?: boolean;
  confirmVisible?: boolean;
  headerVisible?: boolean;
  isLoading?: boolean;
  bgColorConfirm?: string;
  buttonAxis?: 'vertical' | 'horizontal';
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible = false,
  modalIcon,
  onClose,
  onConfirm,
  title = 'Thông báo',
  width = '50%',
  children,
  modalStyle,
  isLoading,
  contentStyle,
  headerStyle,
  closeText = 'Huỷ',
  confirmText = 'Xác nhận',
  closeVisible = true,
  confirmVisible = true,
  headerVisible = true,
  buttonAxis = 'vertical',
  bgColorConfirm = Colors.primary,
}) => {
  const checkButtonAxis = (axis: string) => {
    switch (axis) {
      case 'vertical':
        return 'column-reverse';
      case 'horizontal':
        return 'row';
      default:
        'column';
    }
  };
  return (
    <ReactNativeModal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={[styles.modal, modalStyle]}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.5}>
      <View style={[styles.content, {width: width}, contentStyle]}>
        <View style={styles.icon}>{modalIcon?.() ?? null}</View>
        {isLoading && <LoadingLayer />}
        {headerVisible && title && (
          <Text style={[styles.title, headerStyle]}>{title}</Text>
        )}
        <View style={styles.body}>{children}</View>
        <View
          style={[
            styles.buttonWrapper,
            {flexDirection: checkButtonAxis(buttonAxis)},
            buttonAxis === 'vertical' && {alignSelf: 'stretch'},
          ]}>
          {closeVisible && (
            <CustomButton
              buttonStyle={StyleSheet.flatten([
                styles.button,
                buttonAxis === 'vertical'
                  ? styles.buttonW_full
                  : styles.buttonW_fix,
              ])}
              type="danger"
              onPress={onClose}
              backgroundColor="#E4E4E7"
              color="#52525B">
              {closeText}
            </CustomButton>
          )}
          {confirmVisible && (
            <CustomButton
              buttonStyle={StyleSheet.flatten([
                styles.button,
                buttonAxis === 'vertical'
                  ? styles.buttonW_full
                  : styles.buttonW_fix,
              ])}
              backgroundColor={bgColorConfirm}
              type="primary"
              onPress={onConfirm}>
              {confirmText}
            </CustomButton>
          )}
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {marginBottom: 10},
  content: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  body: {
    marginBottom: 20,
    width: '100%',
  },
  buttonWrapper: {flexDirection: 'row', gap: 10},
  button: {
    height: 40,
  },
  buttonW_full: {
    width: '100%',
  },
  buttonW_fix: {
    width: 120,
  },
});
