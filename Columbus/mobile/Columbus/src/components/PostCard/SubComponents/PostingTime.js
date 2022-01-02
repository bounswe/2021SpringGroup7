import React, {Component, useState, useEffect} from 'react';
import {Text} from 'native-base';
import moment from "moment";

function PostingTime(props) {
  const [timeDiff, setTimeDiff] = useState('');
  useEffect(() => {
    if (timeDiff == '') {
      getTimeDiff();
    }
  }, [timeDiff, props]);
  console.log(`props`, props)

  const getTimeDiff = () => {
    var now = moment(new Date());
    var then = moment(props.data, 'YYYY-MM-DDTHH:mm:ss.sssZ');
    console.log(`now.diff(then, 'hours')`, now.diff(then, 'hours'))
    if (0 < now.diff(then, 'seconds') && now.diff(then, 'seconds') < 60) {
      setTimeDiff(now.diff(then, 'seconds') + ' second(s) ago');
    }
    else if (0 < now.diff(then, 'hours') && now.diff(then, 'hours') < 24) {
      setTimeDiff(now.diff(then, 'hours') + ' hour(s) ago');
    }
    else if (0 < now.diff(then, 'minutes') && now.diff(then, 'minutes') < 24) {
      setTimeDiff(now.diff(then, 'minutes') + ' minute(s) ago');
    }
    else if (0 < now.diff(then, 'days') && now.diff(then, 'days') < 30) {
      setTimeDiff(now.diff(then, 'days') + ' day(s) ago');
    }else{
      setTimeDiff('posted on '+ props.data?.substring(0, 10));
    }

  };

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
