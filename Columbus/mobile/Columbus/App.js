import React from 'react';
import {NativeBaseProvider} from 'native-base';

import Navigation from './src/navigation';
import {NavigationContainer} from '@react-navigation/native';
import AppProviders from './src/context/AppProviders';

const App = () => {
  return (
    <NativeBaseProvider>
      <AppProviders>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </AppProviders>
    </NativeBaseProvider>
  );
};

export default App;
