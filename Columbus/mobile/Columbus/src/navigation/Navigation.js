import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import HomePage from '../views/HomePage';
import Profile from '../views/Profile';
import Login from '../views/Login';
import Register from '../views/Register';
import {useAuth} from '../context/AuthContext';
import {CircleIcon, HamburgerIcon} from 'native-base';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const pageSettings = {
  Home: <HamburgerIcon size="5" />,
  Profile: <CircleIcon size="5" />,
};

const screenOptions = ({route}) => ({
  tabBarIcon() {
    return pageSettings[route.name];
  },
});

const BottomTabNavigation = () => (
  <Tab.Navigator initialRouteName={'Home'} screenOptions={screenOptions}>
    <Tab.Screen name="Home" component={HomePage} />
    <Tab.Screen name="Profile" component={Profile} />
  </Tab.Navigator>
);

const AuthNavigation = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
  </Stack.Navigator>
);

export default function Navigation() {
  const {user} = useAuth();
  return user?.isAuthenticated ? <BottomTabNavigation /> : <AuthNavigation />;
}
