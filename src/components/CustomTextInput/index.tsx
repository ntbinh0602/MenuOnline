import React, {useState} from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  useController,
  useFormContext,
  UseControllerProps,
} from 'react-hook-form';
import Icon from '../../common/icons';
type InputType = 'text' | 'password' | 'number' | 'textarea';

interface CustomTextInputProps extends RNTextInputProps, UseControllerProps {
  label: string;
  defaultValue?: string;
  inputType?: InputType;
  inputContainerStyle?: object; // Custom style for input container
  inputStyle?: object; // Custom style for input
}

const ControlledInput: React.FC<CustomTextInputProps> = props => {
  const {
    label,
    name,
    rules,
    defaultValue,
    inputType = 'text',
    inputContainerStyle,
    inputStyle,
    ...inputProps
  } = props;

  const {
    field,
    fieldState: {error},
  } = useController({name, rules, defaultValue});
  const [security, setSecurity] = useState(true);
  const getKeyboardType = () => {
    switch (inputType) {
      case 'number':
        return 'numeric';
      case 'password':
        return 'default';
      case 'textarea':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          {borderColor: error ? 'red' : '#D9D9D9'},
          inputType === 'textarea' && {height: 100},
          inputType === 'password' && styles.password,
          inputContainerStyle, // Apply custom style
        ]}>
        <RNTextInput
          style={[
            styles.input,
            inputStyle,
            inputType === 'textarea' && styles.textarea,
          ]}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          secureTextEntry={inputType === 'password' && security}
          keyboardType={getKeyboardType()}
          multiline={inputType === 'textarea'}
          {...inputProps}
        />
        {inputType === 'password' && (
          <Pressable onPress={() => setSecurity(!security)}>
            <Icon
              type="Ionicons"
              name={security ? 'eye-outline' : 'eye-off-outline'}
              color="#D9D9D9"
              style={styles.icon}
            />
          </Pressable>
        )}
      </View>
      <View style={styles.errContainer}>
        {error && <Text style={styles.errorText}>{error.message}</Text>}
      </View>
    </View>
  );
};

export const CustomTextInput: React.FC<CustomTextInputProps> = props => {
  const {name} = props;
  const formContext = useFormContext();

  if (!formContext || !name) {
    const msg = !formContext
      ? 'CustomTextInput must be wrapped by the FormProvider'
      : 'Name must be defined';
    console.error(msg);
    return null;
  }

  return <ControlledInput {...props} />;
};

const styles = StyleSheet.create({
  label: {
    color: '#333',
    marginBottom: 8,
    fontWeight: '700',
  },
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  inputContainer: {
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#D9D9D9',
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 4,
    flexShrink: 1,
    flexGrow: 1,
  },
  textarea: {
    textAlignVertical: 'top',
  },
  password: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errContainer: {
    height: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  icon: {
    paddingRight: 16,
  },
});
