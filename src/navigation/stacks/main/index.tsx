import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/rootParam.type';
import {MainStackScreens} from '../../../common/enum';
import KitchenInProgress from '../../../screens/KitchenInProgress';
import History from '../../../screens/KitchenInProgress/History';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigationRoutes = () => {
  return (
    <Stack.Navigator initialRouteName={MainStackScreens.KitchenInProgress}>
      <Stack.Screen
        name={MainStackScreens.KitchenInProgress}
        component={KitchenInProgress}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name={MainStackScreens.History}
        component={History}
        options={{headerShown: true, gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
};

export default MainNavigationRoutes;
