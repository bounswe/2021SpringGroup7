import React, {useState} from 'react';
import {View} from 'react-native';
import {Button, FormControl, Modal} from 'native-base';
import CustomFormInput from '../CustomFormInput';

const DateFormModal = props => {
  const [firstDate, setFirstDate] = useState('');
  const [secondDate, setSecondDate] = useState('');

  return (
    <View>
      <Modal isOpen={props.showModal} onClose={props.onClose}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Choose date</Modal.Header>
          <Modal.Body>
            <View style={{width: '100%'}}>
              <FormControl>
                <CustomFormInput
                  label="*First Date"
                  placeholder="YYYY-MM-DD"
                  value={firstDate}
                  warningMessage="Date is not valid"
                  onChange={value => setFirstDate(value)}
                />
                <CustomFormInput
                  label="*Second Date"
                  placeholder="YYYY-MM-DD"
                  value={secondDate}
                  warningMessage="Date is not valid"
                  onChange={value => setSecondDate(value)}
                />
              </FormControl>
            </View>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={props.onClose}>
                Cancel
              </Button>
              <Button
                onPress={() => props.handleSaveDate(firstDate, secondDate)}>
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
};

export default DateFormModal;
