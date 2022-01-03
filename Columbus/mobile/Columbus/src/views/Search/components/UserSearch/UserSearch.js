import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Avatar, Button, FormControl, ScrollView} from 'native-base';
import CustomFormInput from '../../../../components/CustomFormInput';
import {SERVICE} from '../../../../services/services';
import {useAuth} from '../../../../context/AuthContext';
import {useMutation} from 'react-query';
import getInitials from '../../../../utils/getInitial';
import {styles} from './UserSearch.style';
import PageSpinner from '../../../../components/PageSpinner/PageSpinner';

const UserSearch = props => {
  const {user} = useAuth();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  const getUsers = useMutation(
    params => SERVICE.getSearchUsers(params, user.userInfo.token),
    {
      onSuccess(response) {
        setSearchResult(response.data.return);
        setIsLoading(false);
      },
      onError({response}) {
        setIsLoading(false);
        console.log('res error res12: ', response);
      },
    },
  );

  const searchUsers = async () => {
    setIsLoading(true);
    const data = JSON.stringify({
      search_text: username,
      page_number: 1,
      page_size: 10,
    });

    try {
      await getUsers.mutateAsync(data);
    } catch (e) {
      setIsLoading(false);
      console.log('err12: ', e);
    }
  };

  const handleOpenProfile = (user_id, username) => {
    if (user && user.userInfo.user_id === user_id) {
      return props.navigation.push('Profile');
    } else {
      return props.navigation.push('OtherProfiles', {
        userId: user_id,
        username,
        token: user.userInfo.token,
      });
    }
  };

  return (
    <View style={{flex: 1, padding: 12}}>
      <FormControl>
        <CustomFormInput
          label="Search"
          placeholder="Enter username"
          value={username}
          onChange={value => setUsername(value)}
          width="100%"
        />
        <Button
          style={{marginTop: 16}}
          isLoading={isLoading}
          isDisabled={username === ''}
          onPress={searchUsers}>
          <Text style={{fontWeight: '500', color: 'white'}}>Search</Text>
        </Button>
      </FormControl>
      <ScrollView style={{marginTop: 16}}>
        {searchResult?.length === 0 && !isLoading && (
          <Text>User is not found!</Text>
        )}
        {searchResult?.length > 0 &&
          !isLoading &&
          searchResult.map(user => {
            return (
              <TouchableOpacity
                style={styles.container}
                onPress={() => handleOpenProfile(user.user_id, user.username)}>
                <Avatar
                  bg="blue.500"
                  alignSelf="center"
                  size="lg"
                  source={{
                    uri: user.photo_url ? user.photo_url : '',
                  }}>
                  {`${getInitials(user.username)}`}
                </Avatar>
                <View style={{flexDirection: 'row'}}>
                  {user.first_name!='' && <Text>{user.first_name + ' '}</Text>}
                  {user.last_name!='' && <Text>{user.last_name}</Text>}
                </View>
                <Text>{user.username}</Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default UserSearch;
