import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/Splash';
import {NavigationStackScreens} from '../common/enum';
import AuthNavigationRoutes from './stacks/auth';
import {RootStackParamList} from '../types/rootParam.type';
import MainNavigationRoutes from './stacks/main';

const MainNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={NavigationStackScreens.SplashScreen}
        screenOptions={{
          gestureEnabled: false,
        }}>
        <Stack.Screen
          name={NavigationStackScreens.SplashScreen}
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={NavigationStackScreens.AuthNavigation}
          component={AuthNavigationRoutes}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={NavigationStackScreens.MainNavigation}
          component={MainNavigationRoutes}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
