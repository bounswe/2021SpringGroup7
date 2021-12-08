import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {useAuth} from '../context/AuthContext';

import Login from '../views/Login';
import Register from '../views/Register';

import Home from '../views/Home';
import CreatePost from '../views/CreatePost';
import Search from '../views/Search';
import Profile from '../views/Profile';
import Location from '../views/Location';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const pageSettings = {
  Home: 'home',
  Search: 'search',
  CreatePost: 'plus',
  Profile: 'user',
};

const screenOptions = ({route}) => ({
  tabBarIcon: ({color, size}) => {
    return <Icon name={pageSettings[route.name]} size={size} color={color} />;
  },
  tabBarActiveTintColor: 'tomato',
  tabBarInactiveTintColor: 'gray',
});

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="HomePage" component={Home} />
    <Stack.Screen name="Location" component={Location} />
    <Stack.Screen name="Profile" component={Profile} />
  </Stack.Navigator>
);

const BottomTabNavigation = () => (
  <Tab.Navigator
    initialRouteName={'Home'}
    tabBarActiveTintColor="red"
    screenOptions={screenOptions}>
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Search" component={Search} />
    <Tab.Screen name="CreatePost" component={CreatePost} />
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
