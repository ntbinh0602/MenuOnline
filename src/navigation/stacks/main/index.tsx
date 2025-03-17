import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/rootParam.type';
import {MainStackScreens} from '../../../common/enum';
import RequestTransferred from '../../../screens/RequestTransferred';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigationRoutes = () => {
  return (
    <Stack.Navigator
      initialRouteName={MainStackScreens.RequestTransferred}
      screenOptions={{
        gestureEnabled: false,
      }}>
      <Stack.Screen
        name={MainStackScreens.RequestTransferred}
        component={RequestTransferred}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default MainNavigationRoutes;
