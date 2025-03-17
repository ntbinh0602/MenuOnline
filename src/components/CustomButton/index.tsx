import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  GestureResponderEvent,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Colors from '../../utils/colors';

interface CustomButtonProps {
  type?: 'primary' | 'default' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
  buttonStyle?: ViewStyle; // Custom button style
  color?: string; // Custom text color
  backgroundColor?: string; // Custom background color
  textStyle?: TextStyle; // Custom text style
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  type = 'default',
  disabled = false,
  loading = false,
  onPress,
  children,
  buttonStyle,
  textStyle,
  color,
  backgroundColor,
}) => {
  const combinedButtonStyle: ViewStyle[] = [
    styles.button,
    type === 'primary' && {
      backgroundColor: backgroundColor || Colors.primary,
      borderColor: backgroundColor || Colors.primary,
    },
    type === 'danger' && {
      backgroundColor: backgroundColor || 'red',
      borderColor: backgroundColor || 'red',
    },
    disabled && styles.disabledButton,
    buttonStyle, // Allow custom styles
  ].filter(Boolean) as ViewStyle[];

  const combinedTextStyle: TextStyle[] = [
    styles.text,
    (type === 'primary' || type === 'danger') && {color: '#fff'},
    disabled && styles.disabledText,
    color && {color}, // Apply custom color
    textStyle, // Allow custom text styles
  ].filter(Boolean) as TextStyle[];

  return (
    <TouchableOpacity
      style={combinedButtonStyle}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator
          color={
            type === 'primary' || type === 'danger'
              ? '#fff'
              : color || Colors.primary
          }
        />
      ) : (
        <Text style={combinedTextStyle}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
    borderColor: '#d9d9d9',
  },
  text: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledText: {
    color: '#bfbfbf',
  },
});
