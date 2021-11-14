import React from 'react';
import {StatusBar, Text, View} from 'react-native';

const App = () => {
  return (
    <View>
      <StatusBar />
      <View style={{padding: 40}}>
        <Text>Main Page</Text>
      </View>
    </View>
  );
};

export default App;
