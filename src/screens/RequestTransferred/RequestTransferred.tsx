import React, {useRef} from 'react';
import {
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import KeepAwake from '@sayem314/react-native-keep-awake';
import WebView from 'react-native-webview';
import RNFetchBlob from 'rn-fetch-blob';
import {Alert} from 'react-native';
import {IS_IOS} from '../../utils/common';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const KitchenInProgress = () => {
  const inset = useSafeAreaInsets();
  const webViewRef = useRef(null);
  const handleDownloadFile = async (
    base64Url: string,
    filename: string,
    mimeType: string,
  ) => {
    try {
      // 1. Xin quyền lưu (Android)
      // if (Platform.OS === 'android') {
      //   const granted = await PermissionsAndroid.request(
      //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      //     {
      //       title: 'Cấp quyền lưu file',
      //       message: 'Ứng dụng cần quyền này để lưu file về máy',
      //     },
      //   );
      //   if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      //     Alert.alert('Không có quyền', 'Ứng dụng không thể lưu file');
      //     return;
      //   }
      // }

      // 2. Xác định extension từ mimeType
      const ext = mimeType.split('/')[1] || 'bin';
      const baseName = filename.includes('.') ? filename : `${filename}.${ext}`;

      // 3. Thư mục lưu
      const baseDir = `${RNFetchBlob.fs.dirs?.CacheDir}/MenuOnline`;

      // Check and create directory if not exists
      const exists = await RNFetchBlob.fs.exists(baseDir);
      if (!exists) {
        await RNFetchBlob.fs.mkdir(baseDir);
      }

      // 4. Tách phần base64 và ghi ra file
      //    base64Url dạng "data:application/pdf;base64,JVBERi0xLjcNCi..."
      // Get filename without extension and extension separately
      const fileExt = baseName.includes('.') ? baseName.split('.').pop() : ext;
      const fileNameWithoutExt = baseName.includes('.')
        ? baseName.substring(0, baseName.lastIndexOf('.'))
        : baseName;

      // Find available filename
      let counter = 0;
      let finalPath = `${baseDir}/${baseName}`;

      while (await RNFetchBlob.fs.exists(finalPath)) {
        counter++;
        finalPath = `${baseDir}/${fileNameWithoutExt} (${counter}).${fileExt}`;
      }

      // Use finalPath instead of filePath
      const base64Data = base64Url.split(',')[1];
      await RNFetchBlob.fs.writeFile(finalPath, base64Data, 'base64');

      // Show alert first
      // After saving file
      if (Platform.OS === 'android') {
        RNFetchBlob.android
          .actionViewIntent(finalPath, mimeType)
          .catch(error => {
            Alert.alert('Lỗi', 'Không thể mở file');
          });
      } else {
        RNFetchBlob.ios.openDocument(finalPath).catch(error => {
          Alert.alert('Lỗi', 'Không thể mở file');
        });
      }
      // RNFetchBlob.fs.unlink(finalPath);
    } catch (err) {
      console.error('Lỗi khi lưu file:', err);
      Alert.alert('Lỗi', err.message || 'Không thể lưu file');
    }
  };

  return (
    <View style={{flex: 1, paddingTop: inset.top, paddingBottom: inset.bottom}}>
      <WebView
        ref={webViewRef}
        useWebView2={true}
        mixedContentMode="always"
        originWhitelist={['https://*', 'wss://*', 'http://*', 'blob:']}
        source={{uri: 'http://10.24.191.79:8686/'}}
        onMessage={event => {
          const msg = JSON.parse(event.nativeEvent.data);
          if (msg.type === 'DOWNLOAD_FILE') {
            const {url, filename, mimeType} = msg.payload;
            handleDownloadFile(url, filename, mimeType);
          }
        }}
      />
      <KeepAwake />
    </View>
  );
};

const styles = StyleSheet.create({
  // (giữ nguyên các style bạn đã viết)
});

export default KitchenInProgress;
