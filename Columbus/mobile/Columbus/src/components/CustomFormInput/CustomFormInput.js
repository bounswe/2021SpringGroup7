import React from 'react';
import {Input, FormControl, WarningOutlineIcon} from 'native-base';

const CustomFormInput = props => {
  return (
    <>
      <FormControl.Label>{props.label}</FormControl.Label>
      <Input
        borderColor="#4aa9ff"
        placeholder={props.placeholder}
        defaultValue={props.value}
        onChangeText={props.onChange}
      />
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {props.warningMessage}
      </FormControl.ErrorMessage>
    </>
  );
};

export default CustomFormInput;
