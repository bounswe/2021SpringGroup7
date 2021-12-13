import React, {Component,useState,useEffect} from 'react';
import {Text} from 'native-base';

function PostingTime(props) {
  const [timeDiff, setTimeDiff] = useState('')
  useEffect(() => {
    if(timeDiff==''){
      getTimeDiff()

    }
  }, [props.data])
  
 
  const getTimeDiff=()=>{
     var moment = require('moment');
    var now  = moment(new Date());
    var then = moment(props.data, "YYYY-MM-DDTHH:mm:ssZ");


    if(now.diff(then,'seconds')<60){
      setTimeDiff(now.diff(then,'seconds')+' seconds ago')
    }
    if(0<now.diff(then,'hours') && now.diff(then,'hours') <24){
      setTimeDiff(now.diff(then,'hours')+' hours ago')
    }
    if(0<now.diff(then,'days') && now.diff(then,'days')<30){
      setTimeDiff(now.diff(then,'days')+' days ago')
    }
   


    
  }

  return (
    <Text
      color="coolGray.600"
      _dark={{
        color: 'warmGray.200',
      }}
      fontWeight="400">
      {timeDiff}
    </Text>
  );
}

export default PostingTime;
