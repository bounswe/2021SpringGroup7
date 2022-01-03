import React, {useState} from 'react';
import {TabView, SceneMap} from 'react-native-tab-view';
import {View, Text, useWindowDimensions} from 'react-native';
import {ScrollView} from 'native-base';
import UserSearch from './components/UserSearch';
import TagSearch from './components/TagSearch';
import LocationSearch from './components/LocationSearch';

LocationSearch

const Search = ({navigation}) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {key: 'first', title: 'User'},
    {key: 'second', title: 'Tag'},
    {key: 'third', title: 'Map'},
    {key: 'fourth', title: 'Date'},
  ]);

  const FirstRoute = () => <UserSearch navigation={navigation} />;

  const SecondRoute = () => <TagSearch navigation={navigation}/>;
  

  const ThirdRoute = () => <LocationSearch navigation={navigation}/>;

  const FourthRoute = () => (
    <ScrollView style={{flex: 1}}>
      <View>
        <Text>qweqweqwe</Text>
      </View>
    </ScrollView>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute,
  });

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
    />
  );
};

export default Search;
