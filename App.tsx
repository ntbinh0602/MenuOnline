/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';

import MainNavigator from './src/navigation';
import FlashMessage from 'react-native-flash-message';
import Colors from './src/utils/colors';
import DeviceInfo from 'react-native-device-info';
import RequestTransferred from './src/screens/RequestTransferred';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';

function App(): JSX.Element {
  const IS_TABLET: boolean = DeviceInfo.isTablet();
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'light-content'} />
      <RequestTransferred />
      <FlashMessage
        position="top"
        style={[
          {
            shadowColor: Colors.danger,
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
    </SafeAreaProvider>
  );
}

export default App;
