import React from 'react';
import {Input, FormControl, WarningOutlineIcon} from 'native-base';
import {View} from 'react-native';

const CustomFormInput = props => {
  return (
    <View style={{width: props.width}}>
      {props.label && <FormControl.Label>{props.label}</FormControl.Label>}
      <Input
        variant={props.variant && props.variant}
        mt={props.mt && props.mt}
        borderColor="#4aa9ff"
        placeholder={props.placeholder}
        defaultValue={props.value}
        onChangeText={props.onChange}
      />
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {props.warningMessage}
      </FormControl.ErrorMessage>
    </View>
  );
};

export default CustomFormInput;
