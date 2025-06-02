import React, {useRef} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import KeepAwake from '@sayem314/react-native-keep-awake';
import WebView from 'react-native-webview';
import RNFetchBlob from 'rn-fetch-blob';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LIVE_URL, TEST_URL, UAT_URL} from '../../utils/auth';
import RNFS from 'react-native-fs';
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

  const handleDownloadFileXlsx = async (
    url: string,
    filename: string,
    mimeType: string,
  ): Promise<void> => {
    try {
      // Định nghĩa đường dẫn lưu file
      const downloadPath =
        Platform.OS === 'ios'
          ? RNFS.DocumentDirectoryPath // Lưu vào Documents trên iOS
          : RNFS.DownloadDirectoryPath; // Lưu vào Downloads trên Android
      const filePath = `${downloadPath}/${filename}`;

      // Kiểm tra và xin quyền lưu trữ trên Android
      if (Platform.OS === 'android') {
        // Kiểm tra phiên bản Android
        const androidVersion = parseInt(Platform.Version.toString(), 10);
        if (androidVersion < 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Cần quyền truy cập bộ nhớ',
              message: 'Ứng dụng cần quyền truy cập bộ nhớ để lưu file',
              buttonPositive: 'OK',
              buttonNegative: 'Hủy',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Không có quyền', 'Ứng dụng không thể lưu file');
            return;
          }
        }
        // Thêm kiểm tra quyền đọc nếu cần mở file sau này
        const readGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Cần quyền đọc bộ nhớ',
            message: 'Ứng dụng cần quyền đọc bộ nhớ để truy cập file',
            buttonPositive: 'OK',
            buttonNegative: 'Hủy',
          },
        );
        if (readGranted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Không có quyền', 'Ứng dụng không thể đọc file');
          return;
        }
      }

      // Kiểm tra xem url có phải base64 không
      if (url.startsWith('data:')) {
        const base64Data = url.split(',')[1]; // Lấy phần base64 sau "data:application/...;base64,"
        await RNFS.writeFile(filePath, base64Data, 'base64');
        Alert.alert('Thông báo', 'Tải file thành công');
        return;
      }

      Alert.alert('Lỗi', 'Định dạng dữ liệu không hợp lệ: Cần chuỗi base64');
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Lỗi', 'Không thể lưu file: ' + (error as Error).message);
    }
  };

  return (
    <View
      style={[
        styles.container,
        styles.bg_black,
        {
          paddingTop: inset.top,
          paddingBottom: inset.bottom,
        },
      ]}>
      <WebView
        ref={webViewRef}
        useWebView2={true}
        mixedContentMode="always"
        originWhitelist={['https://*', 'wss://*', 'http://*', 'blob:']}
        source={{uri: UAT_URL}}
        onMessage={event => {
          const msg = JSON.parse(event.nativeEvent.data);
          const {url, filename, mimeType} = msg.payload;
          if (msg.type === 'DOWNLOAD_FILE') {
            handleDownloadFile(url, filename, mimeType);
          }
          if (msg.type === 'DOWNLOAD_XLSX') {
            handleDownloadFileXlsx(url, filename, mimeType);
          }
        }}
        style={styles.bg_black}
      />
      <KeepAwake />
    </View>
  );
};

export default KitchenInProgress;

const styles = StyleSheet.create({
  bg_black: {
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
  },
});
