import React, {useEffect} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {NavigationStackScreens} from '../../common/enum';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/rootParam.type';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<
  RootStackParamList,
  NavigationStackScreens.SplashScreen
>;

const SplashScreen: React.FC<Props> = ({navigation}) => {
  useEffect(() => {
    const checkAccessToken = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      setTimeout(() => {
        if (accessToken) {
          navigation.replace(NavigationStackScreens.MainNavigation);
        } else {
          navigation.replace(NavigationStackScreens.AuthNavigation);
        }
      }, 2000);
    };

    checkAccessToken();
  }, [navigation]);

  return (
    <View style={styles.viewStyles}>
      <Text style={styles.textStyles}>Welcome</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  viewStyles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
  },
  textStyles: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
});
