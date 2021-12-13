import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {Button, Modal, FormControl, Input, Select, Slider} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateFormModal = props => {
  const [dateType, setDateType] = useState('');
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [onChangeValue, setOnChangeValue] = useState(22);
  const [onChangeEndValue, setOnChangeEndValue] = useState(22);

  const onChange = (event, selectedDate) => {};

  const handleSelectDateType = itemValue => {
    setDateType(itemValue);
  };

  return (
    <View>
      <Modal isOpen={props.showModal} onClose={props.onClose}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Choose date</Modal.Header>
          <Modal.Body>
            <Text>*Date Type</Text>
            <Select
              selectedValue={dateType}
              placeholder="Choose a date type"
              borderColor="#4aa9ff"
              onValueChange={handleSelectDateType}>
              <Select.Item label="Century" value="century" />
              <Select.Item label="Decade" value="decade" />
              <Select.Item label="Between two year" value="rangeYear" />
              <Select.Item label="Specific Date" value="specificDate" />
            </Select>
            {dateType === 'specificDate' && (
              <View style={{width: '100%'}}>
                <DateTimePicker
                  display="default"
                  value={date}
                  mode={mode}
                  onChange={onChange}
                />
              </View>
            )}
            {dateType === 'century' && (
              <>
                <Text textAlign="center">{onChangeValue}. centuary</Text>

                <Slider
                  minValue={0}
                  maxValue={22}
                  defaultValue={22}
                  colorScheme="cyan"
                  onChange={v => {
                    setOnChangeValue(Math.floor(v));
                  }}
                  onChangeEnd={v => {
                    v && setOnChangeEndValue(Math.floor(v));
                  }}>
                  <Slider.Track>
                    <Slider.FilledTrack />
                  </Slider.Track>
                  <Slider.Thumb />
                </Slider>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={props.onClose}>
                Cancel
              </Button>
              <Button onPress={props.onClose}>Save</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
};

export default DateFormModal;
