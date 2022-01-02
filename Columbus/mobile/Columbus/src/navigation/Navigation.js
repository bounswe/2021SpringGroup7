import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {useAuth} from '../context/AuthContext';

import Login from '../views/Login';
import Register from '../views/Register';

import Home from '../views/Home';
import CreateStory from '../views/CreateStory';
import Search from '../views/Search';
import Profile from '../views/Profile';
import Location from '../views/Location';
import DetailedPost from '../views/DetailedPost';
import EditProfile from '../views/Profile/views/EditProfile';
import OtherProfiles from '../views/OtherProfiles/OtherProfiles';
import Notification from '../views/Home/components/Notification';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const pageSettings = {
  Home: 'home',
  Search: 'search',
  CreateStory: 'plus',
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

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen options={{title: 'Home'}} name="HomePage" component={Home} />
    <Stack.Screen
      options={{title: 'Location'}}
      name="Location"
      component={Location}
    />
    <Stack.Screen
      options={{title: 'Profile'}}
      name="OtherProfile"
      component={OtherProfiles}
    />
      <Stack.Screen
      options={{title: 'Profile'}}
      name="Profile"
      component={Profile}
    />
    <Stack.Screen
      options={{title: 'Notifications'}}
      name="Notification"
      component={Notification}
    />
    <Stack.Screen name="DetailedPost" component={DetailedPost} />
  </Stack.Navigator>
);

const BottomTabNavigation = () => (
  <Tab.Navigator
    initialRouteName={'Home'}
    tabBarActiveTintColor="red"
    screenOptions={screenOptions}>
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Search" component={SearchNavigation} />
    <Tab.Screen name="CreateStory" component={CreateStoryNavigation} />
    <Tab.Screen name="Profile" component={ProfileNavigation} />
  </Tab.Navigator>
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

const CreateStoryNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{title: 'Create Story'}}
      name="CreateStoryPage"
      component={CreateStory}
    />
  </Stack.Navigator>
);

const ProfileNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen name="ProfilePage" component={Profile} />
    <Stack.Screen
      options={{title: 'Edit Profile'}}
      name="EditProfile"
      component={EditProfile}
    />
    <Stack.Screen
      options={{title: 'Other Users Profile'}}
      name="OtherProfiles"
      component={OtherProfiles}
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
  console.log('user: ', user);
  return user?.isAuthenticated ? <BottomTabNavigation /> : <AuthNavigation />;
}
