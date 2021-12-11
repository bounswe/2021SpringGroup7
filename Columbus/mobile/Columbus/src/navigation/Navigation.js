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
import EditProfile from '../views/Profile/views/EditProfile';

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
  headerShown: false,
  tabBarActiveTintColor: '#0077e6',
  tabBarInactiveTintColor: 'gray',
});

const BottomTabNavigation = () => (
  <Tab.Navigator
    initialRouteName={'Home'}
    tabBarActiveTintColor="red"
    screenOptions={screenOptions}>
    <Tab.Screen name="Home" component={HomeNavigation} />
    <Tab.Screen name="Search" component={SearchNavigation} />
    <Tab.Screen name="CreatePost" component={CreatePostNavigation} />
    <Tab.Screen name="Profile" component={ProfileNavigation} />
  </Tab.Navigator>
);

const HomeNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen options={{title: 'Home'}} name="HomePage" component={Home} />
  </Stack.Navigator>
);

const SearchNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{title: 'Search'}}
      name="SearchPage"
      component={Search}
    />
  </Stack.Navigator>
);

const CreatePostNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{title: 'Create Story'}}
      name="CreatePostPage"
      component={CreatePost}
    />
  </Stack.Navigator>
);

const ProfileNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{title: 'Profile'}}
      name="ProfilePage"
      component={Profile}
    />
    <Stack.Screen
      options={{title: 'Edit Profile'}}
      name="EditProfile"
      component={EditProfile}
    />
  </Stack.Navigator>
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
