import React from 'react';
import {NativeBaseProvider} from 'native-base';

import Navigation from './src/navigation';

const App = () => {
  return (
    <NativeBaseProvider>
      <Navigation />
    </NativeBaseProvider>
  );
};

export default App;
