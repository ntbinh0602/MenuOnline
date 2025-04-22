import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/rootParam.type';
import {MainStackScreens} from '../../../common/enum';
import KitchenInProgress from '../../../screens/KitchenInProgress';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigationRoutes = () => {
  return (
    <Stack.Navigator
      initialRouteName={MainStackScreens.KitchenInProgress}
      screenOptions={{
        gestureEnabled: false,
      }}>
      <Stack.Screen
        name={MainStackScreens.KitchenInProgress}
        component={KitchenInProgress}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default MainNavigationRoutes;
