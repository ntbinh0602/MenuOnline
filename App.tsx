import React from 'react';
import MainNavigator from './src/navigation';
import FlashMessage from 'react-native-flash-message';
import DeviceInfo from 'react-native-device-info';
import {ThemeProvider, useTheme} from './src/provider/ThemeContext'; // Change the import to use your custom ThemeProvider

function App(): JSX.Element {
  const IS_TABLET: boolean = DeviceInfo.isTablet();
  const {theme} = useTheme();

  return (
    <ThemeProvider>
      <MainNavigator />
      <FlashMessage
        position="top"
        style={[
          {
            shadowColor: theme.colors.danger,
            shadowOffset: {
              width: 0,
              height: 11,
            },
            shadowOpacity: 0.23,
            shadowRadius: 11.78,
            elevation: 15,
            alignItems: 'center',
          },
          IS_TABLET && {
            width: 'auto',
            alignSelf: 'center',
          },
        ]}
        titleStyle={{
          fontSize: 16,
          opacity: 1,
        }}
        textStyle={{
          fontSize: 14,
          opacity: 1,
        }}
        textProps={{
          numberOfLines: 2,
        }}
        titleProps={{
          numberOfLines: 1,
        }}
        duration={6000}
        floating={true}
      />
    </ThemeProvider>
  );
}

export default App;
