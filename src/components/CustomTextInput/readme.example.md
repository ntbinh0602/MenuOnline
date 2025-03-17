## Example Usage of `CustomTextInput` with `react-hook-form`

### Description

This example demonstrates how to integrate the `CustomTextInput` component with `react-hook-form` in a React Native application.

### `App.tsx`

```tsx
import React from 'react';
import {TextInput} from './components/CustomTextInput';
import {Text, View, StyleSheet, Button} from 'react-native';
import {
  useForm,
  FormProvider,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form';

// Define form value types
interface FormValues {
  email: string;
  password: string;
}

const App: React.FC = () => {
  // Initialize useForm hook
  const methods = useForm<FormValues>();

  // Form submit handler
  const onSubmit: SubmitHandler<FormValues> = data =>
    console.log('Form Data:', data);

  // Form error handler
  const onError: SubmitErrorHandler<FormValues> = errors =>
    console.log('Form Errors:', errors);

  return (
    <View style={styles.container}>
      {/* Wrap the form with FormProvider and pass form methods */}
      <FormProvider {...methods}>
        {/* Controlled CustomTextInput components */}
        <TextInput
          name="email"
          label="Email"
          placeholder="jon.doe@email.com"
          keyboardType="email-address"
          rules={{required: 'Email is required!'}}
        />
        <TextInput
          name="password"
          label="Password"
          secureTextEntry
          placeholder="Enter your password"
          rules={{required: 'Password is required!'}}
        />
      </FormProvider>

      {/* Submit Button */}
      <View style={styles.button}>
        <Button
          title="Login"
          color="white"
          onPress={methods.handleSubmit(onSubmit, onError)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#0e101c',
  },
  button: {
    marginTop: 20,
  },
});

export default App;
```

### Instructions

1. Ensure `CustomTextInput` is properly imported from your components directory.
2. Wrap all form inputs within the `FormProvider` and pass methods from `useForm()`.
3. Use `handleSubmit` to manage both `onSubmit` and `onError` functions.

### Output

A simple login form with:

- Email and password fields
- Validation messages if required fields are missing
- Form submission with data output to the console

### Dependencies

Ensure the following packages are installed in your project:

```bash
npm install react-hook-form react-native
```

### CustomTextInput Component

Ensure you have the `CustomTextInput` component correctly implemented with `useController` from `react-hook-form` for controlled input management.
