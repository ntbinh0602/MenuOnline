import { AuthStackScreens, MainStackScreens, NavigationStackScreens } from "../common/enum";

export type RootStackParamList = {
  [NavigationStackScreens.SplashScreen]: undefined;
  [NavigationStackScreens.AuthNavigation]: undefined;
  [NavigationStackScreens.MainNavigation]: undefined;
  [AuthStackScreens.Login]: undefined;
  [MainStackScreens.RequestTransferred]: undefined;
};