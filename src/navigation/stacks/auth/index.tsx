import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/rootParam.type';
import {AuthStackScreens} from '../../../common/enum';
import Login from '../../../screens/Login';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigationRoutes = () => {
  return (
    <Stack.Navigator
      initialRouteName={AuthStackScreens.Login}
      screenOptions={{
        gestureEnabled: false,
      }}>
      <Stack.Screen
        name={AuthStackScreens.Login}
        component={Login}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigationRoutes;
