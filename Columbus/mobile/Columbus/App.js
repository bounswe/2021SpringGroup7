import React from 'react';
import {NativeBaseProvider, extendTheme} from 'native-base';

import Navigation from './src/navigation';
import {NavigationContainer} from '@react-navigation/native';
import AppProviders from './src/context/AppProviders';

export const theme = extendTheme({
  colors: {
    primary: {
      50: '#dbf4ff',
      100: '#addbff',
      200: '#7cc2ff',
      300: '#4aa9ff',
      400: '#1a91ff',
      500: '#0077e6',
      600: '#005db4',
      700: '#004282',
      800: '#002851',
      900: '#000e21',
    },
    amber: {
      400: '#d97706',
    },
  },
});

const App = () => {
  return (
    <NativeBaseProvider theme={theme}>
      <AppProviders>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </AppProviders>
    </NativeBaseProvider>
  );
};

export default App;
