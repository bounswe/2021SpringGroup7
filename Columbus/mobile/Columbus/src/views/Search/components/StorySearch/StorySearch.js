import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {
  Avatar,
  Button,
  FormControl,
  ScrollView,
  Actionsheet,
  useDisclose,
  Heading,
  HStack,
  VStack,
  Badge,
} from 'native-base';
import PostCard from "../../../../components/PostCard";
import CustomFormInput from '../../../../components/CustomFormInput';
import {SERVICE} from '../../../../services/services';
import {useAuth} from '../../../../context/AuthContext';
import {useMutation} from 'react-query';
import getInitials from '../../../../utils/getInitial';
import {styles} from './StorySearch.style';
import PageSpinner from '../../../../components/PageSpinner/PageSpinner';
import TagInput from 'react-native-tags-input';
import DatePicker from 'react-native-datepicker';

const StorySearch = props => {
  const {user} = useAuth();
  const {isOpen, onOpen, onClose} = useDisclose();
  const [text, setText] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [showTagFilterMenu, setShowTagFilterMenu] = useState(false);
  const [showDateFilterMenu, setShowDateFilterMenu] = useState(false);
  const [showUsernameFilterMenu, setShowUsernameFilterMenu] = useState(false);
  

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [tags, setTags] = useState({
    tag: '',
    tagsArray: [],
  });
  const getPosts = useMutation(
    params => SERVICE.getSearch(params, user.userInfo.token),
    {
      onSuccess(response) {
        setSearchResult(response.data.return);
        console.log(`response.data.return`, response.data.return)
        setIsLoading(false);
      },
      onError({response}) {
        setIsLoading(false);
        console.log('res error res12: ', response);
      },
    },
  );

  const handleDateChange = selectedDate => {
    const currentDate = selectedDate || date;
    setShow(false);
    setShowDateFilterMenu(false);
    setDate(currentDate);
  };

  const searchPosts = async () => {
    setIsLoading(true);
    const data ={
      search_text: text,
      page_number: 1,
      page_size: 100,
    }
    if(fromDate!=null){
    data['search_year_start']=fromDate.substring(0,4)
    data['search_month_start']=parseInt(fromDate.substring(5,7))
    data['search_day_start']=parseInt(fromDate.substring(8,10))
    } 
    if(toDate!=null){
    data['search_year_end']=toDate.substring(0,4)
    data['search_month_end']=parseInt(toDate.substring(5,7))
    data['search_day_end']=parseInt(toDate.substring(8,10))
    }
    if(username!==''){
      data['username']=username
    }
    if(tags?.tagsArray.length>0){
      data['tags']=tags.tagsArray
    }
    console.log(`data`, data)
    
    JSON.stringify(data);

    try {
      await getPosts.mutateAsync(data);
    } catch (e) {
      setIsLoading(false);
      console.log('err: ', e);
    }
  };

  

  return (
    <View style={{flex: 1, padding: 12}}>
      <FormControl>
        <CustomFormInput
          label="Text"
          placeholder="Enter keyword"
          value={text}
          onChange={value => setText(value)}
          width="100%"
        />

        <Button
          style={{marginTop: 16}}
          isLoading={isLoading}
          isDisabled={text === ''}
          onPress={searchPosts}>
          {isLoading ? (
            <Text style={{fontWeight: '500', color: 'black'}}>Search</Text>
          ) : (
            <Text style={{fontWeight: '500', color: 'white'}}>Search</Text>
          )}
        </Button>
        <Button style={{marginTop: 16}} onPress={onOpen} colorScheme="green">
          <Text style={{fontWeight: '500', color: 'white'}}>
            Add Search Filter
          </Text>
        </Button>
        <HStack
          style={{
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 10,
          }}>
          {username !== '' && (
            <Button onPress={() => setUsername('')} colorScheme="red">
              USERNAME={username}
            </Button>
          )}
          {fromDate !== null && (
            <Button onPress={() => setFromDate(null)} colorScheme="purple">
              Date From={fromDate}
            </Button>
          )}
          {toDate !== null && (
            <Button onPress={() => setToDate(null)} colorScheme="blue">
              Date To={toDate}
            </Button>
          )}
          {tags?.tagsArray.length>0 && (
            <Button
              onPress={() =>
                setTags({
                  tag: '',
                  tagsArray: [],
                })
              }
              colorScheme="green">
              Tags={tags.tagsArray}
            </Button>
          )}
        </HStack>
      </FormControl>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>

          {showTagFilterMenu && (
            <>
              <TagInput
                placeholder="Tags"
                label="Tags"
                containerStyle={styles.tagContainer}
                inputStyle={styles.tagInput}
                tagStyle={styles.tag}
                tagTextStyle={styles.tagText}
                updateState={state => setTags(state)}
                tags={tags}
                keyboardShouldPersistTaps={true}
              />
              <Button
                style={{marginTop: 16}}
                onPress={() => setShowTagFilterMenu(false)}
                colorScheme="green">
                <Text style={{fontWeight: '500', color: 'white'}}>Apply</Text>
              </Button>
            </>
          )}
          {showDateFilterMenu && (
            <>
              <Text>From</Text>
              <DatePicker
                style={{width: 200}}
                date={fromDate}
                mode="date"
                label="From"
                placeholder="Select Starting Date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: 'red',
                  },
                }}
                onDateChange={date => {
                  setFromDate(date);
                }}
              />
              <Text style={{marginTop: 10}}>To</Text>
              <DatePicker
                style={{width: 200, marginBottom: 15}}
                date={toDate}
                mode="date"
                label="From"
                placeholder="Select Ending Date"
                format="YYYY-MM-DD"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: 'red',
                  },
                }}
                onDateChange={date => {
                  setToDate(date);
                }}
              />
              <Button
                style={{marginTop: 16, width: 200}}
                onPress={() => {
                  setFromDate(null);
                  setToDate(null);
                }}
                colorScheme="red">
                <Text style={{fontWeight: '500', color: 'white'}}>Discard</Text>
              </Button>

              <Button
                style={{marginTop: 16, width: 200, marginBottom: 40}}
                onPress={() => setShowDateFilterMenu(false)}
                colorScheme="green">
                <Text style={{fontWeight: '500', color: 'white'}}>Apply</Text>
              </Button>
            </>
          )}
          {showUsernameFilterMenu && (
            <>
              <FormControl>
                <CustomFormInput
                  label="Username"
                  placeholder="Username"
                  value={username}
                  onChange={value => setUsername(value)}
                  width="100%"
                  style={{marginBottom: 20}}
                />
              </FormControl>
              <Button
                style={{marginTop: 16, width: 200}}
                onPress={() => {
                  setUsername('');
                }}
                colorScheme="red">
                <Text style={{fontWeight: '500', color: 'white'}}>Discard</Text>
              </Button>

              <Button
                style={{marginTop: 16, width: 200, marginBottom: 40}}
                onPress={() => setShowUsernameFilterMenu(false)}
                colorScheme="green">
                <Text style={{fontWeight: '500', color: 'white'}}>Apply</Text>
              </Button>
            </>
          )}

          {!showTagFilterMenu &&
            !showDateFilterMenu &&
            !showUsernameFilterMenu && (
              <>
                <Actionsheet.Item onPress={() => setShowTagFilterMenu(true)}>
                  Tag
                </Actionsheet.Item>
                <Actionsheet.Item onPress={() => setShowDateFilterMenu(true)}>
                  Date Interval
                </Actionsheet.Item>
                {/* <Actionsheet.Item
                  onPress={() => setShowUsernameFilterMenu(true)}>
                  Username
                </Actionsheet.Item> */}
                {/* <Actionsheet.Item>Location</Actionsheet.Item> */}
              </>
            )}
        </Actionsheet.Content>
      </Actionsheet>
      <ScrollView>
        <VStack flex={1} px="3" space={10} alignItems="center" pb={10} mt={5}>
          {searchResult!==null && searchResult.map(item => {
            return <PostCard data={item} key={item.story_id} />;
          }) }
          {searchResult!==null && searchResult.length==0 && <Text>No Result</Text>}
        </VStack>
      </ScrollView>
    </View>
  );
};

export default StorySearch;
