import * as React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import HomePage from '../views/HomePage';
import Profile from '../views/Profile';
import Login from '../views/Login';
import Register from '../views/Register';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthNavigation = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
  </Stack.Navigator>
);

const BottomTabNavigation = () => (
  <Tab.Navigator
    screenOptions={() => ({
      tabBarIcon: () => {
        return <View />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}>
    <Tab.Screen name="Home" component={HomePage} />
    <Tab.Screen name="Profile" component={Profile} />
  </Tab.Navigator>
);

export default function Navigation() {
  const isLoggedIn = false;
  return (
    <NavigationContainer>
      {isLoggedIn ? <BottomTabNavigation /> : <AuthNavigation />}
    </NavigationContainer>
  );
}
