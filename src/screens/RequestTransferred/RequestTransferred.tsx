import KeepAwake from '@sayem314/react-native-keep-awake';
import React, {useRef, useState} from 'react';
import {
  View,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

const RequestTransferred = () => {
  return (
    <>
      <KeepAwake />
      <WebView
        useWebView2={true}
        mixedContentMode={'always'}
        originWhitelist={['https://*', 'wss://*']}
        source={{uri: 'https://ctynamviet.1erp.vn/'}}
      />
    </>
  );
};

export default RequestTransferred;
