import React, {Component} from 'react';
import {Text, View} from 'native-base';

function PostTimeInfo(props) {
  const data=props.data[0]
  let dateToShow=''
  if(data.type=='specific'){
    if(data.day!=null){
      dateToShow+=data.day+' '
    }
    if(data.month!=null){
      if(data.month==1){
        dateToShow+='Jan '
      }else if(data.month==2){
        dateToShow+='Feb '
      }else if(data.month==3){
        dateToShow+='Mar '
      }else if(data.month==4){
        dateToShow+='Apr '
      }else if(data.month==5){
        dateToShow+='May '
      }else if(data.month==6){
        dateToShow+='Jun '
      }else if(data.month==7){
        dateToShow+='Jul '
      }else if(data.month==8){
        dateToShow+='Aug '
      }else if(data.month==9){
        dateToShow+='Sep '
      }else if(data.month==10){
        dateToShow+='Oct '
      } else if(data.month==11){
        dateToShow+='Nov '
      } else if(data.month==12){
        dateToShow+='Dec '
      }
      
    }
    if(data.year!=null){
      dateToShow+=data.year
    }

  } else if (data.type=='decade'){
    dateToShow+=data.year+" \'s"
  }

  return (
    <Text
        fontSize="xs"
        _light={{
          color: 'green.500',
        }}
        _dark={{
          color: 'green.400',
        }}
        fontWeight="500"
        ml="-0.5"
        mt="-1">
        {dateToShow}
      </Text>
  );
}

export default PostTimeInfo;
