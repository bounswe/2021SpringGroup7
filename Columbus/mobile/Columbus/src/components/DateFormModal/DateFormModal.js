import React, {useState} from 'react';
import {View} from 'react-native';
import {Button, FormControl, Input, Modal, Select} from 'native-base';
import CustomFormInput from '../CustomFormInput';

const DateFormModal = props => {
  const [dateType, setDateType] = useState('');
  const [decade, setDecade] = useState('');
  const [century, setCentury] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [startDay, setStartDay] = useState('');
  const [endDay, setEndDay] = useState('');

  let finalData = {};
  const [isDisabledButton, setIsDisabledButton] = useState(true);

  const handleSaveDate = () => {
    if (dateType === 'Year') {
      finalData = {
        time_start: {
          year,
          type: 'specific',
        },
        time_end: null,
      };
    } else if (dateType === 'Month') {
      finalData = {
        time_start: {
          year,
          month,
          type: 'specific',
        },
        time_end: null,
      };
    } else if (dateType === 'Day') {
      finalData = {
        time_start: {
          year,
          month,
          day,
          type: 'specific',
        },
        time_end: null,
      };
    } else if (dateType === 'Century') {
      finalData = {
        time_start: {
          date: century,
          type: 'century',
        },
        time_end: null,
      };
    } else if (dateType === 'Decade') {
      finalData = {
        time_start: {
          date: decade,
          type: 'decade',
        },
        time_end: null,
      };
    } else if (dateType === 'Start-End Year') {
      finalData = {
        time_start: {
          year: startYear,
          type: 'specific',
        },
        time_end: {
          year: endYear,
          type: 'specific',
        },
      };
    } else if (dateType === 'Start-End Month') {
      finalData = {
        time_start: {
          year: startYear,
          month: startMonth,
          type: 'specific',
        },
        time_end: {
          year: endYear,
          month: endMonth,
          type: 'specific',
        },
      };
    } else if (dateType === 'Start-End Day') {
      finalData = {
        time_start: {
          year: startYear,
          month: startMonth,
          day: startDay,
          type: 'specific',
        },
        time_end: {
          year: endYear,
          month: endMonth,
          day: endDay,
          type: 'specific',
        },
      };
    } else {
    }
    props.handleSaveDate(finalData);
  };

  const clearAllState = () => {
    setDecade('');
    setCentury('');
    setYear('');
    setMonth('');
    setDay('');
    setStartYear('');
    setEndYear('');
    setStartMonth('');
    setEndMonth('');
    setStartDay('');
    setEndDay('');
  };

  return (
    <View>
      <Modal isOpen={props.showModal} onClose={props.onClose}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Choose date</Modal.Header>
          <Modal.Body>
            <View style={{width: '100%'}}>
              <FormControl>
                <Select
                  selectedValue={dateType}
                  placeholder="Choose a date type"
                  borderColor="#4aa9ff"
                  onValueChange={itemValue => {
                    clearAllState();
                    setDateType(itemValue);
                  }}>
                  <Select.Item label="Century" value="Century" />
                  <Select.Item label="Decade" value="Decade" />
                  <Select.Item label="Year" value="Year" />
                  <Select.Item label="Month" value="Month" />
                  <Select.Item label="Day" value="Day" />
                  <Select.Item label="Start-End Year" value="Start-End Year" />
                  <Select.Item
                    label="Start-End Month"
                    value="Start-End Month"
                  />
                  <Select.Item label="Start-End Day" value="Start-End Day" />
                </Select>
                {dateType === 'Century' && (
                  <Select
                    selectedValue={century}
                    placeholder="Century"
                    borderColor="#4aa9ff"
                    onValueChange={itemValue => setCentury(itemValue)}>
                    <Select.Item value={10} label="10." />
                    <Select.Item value={11} label="11." />
                    <Select.Item value={12} label="12." />
                    <Select.Item value={13} label="13." />
                    <Select.Item value={14} label="14." />
                    <Select.Item value={15} label="15." />
                    <Select.Item value={16} label="16." />
                    <Select.Item value={17} label="17." />
                    <Select.Item value={18} label="18." />
                    <Select.Item value={19} label="19." />
                    <Select.Item value={20} label="20." />
                  </Select>
                )}
                {dateType === 'Decade' && (
                  <Select
                    selectedValue={decade}
                    placeholder="Decade"
                    borderColor="#4aa9ff"
                    onValueChange={itemValue => setDecade(itemValue)}>
                    <Select.Item value={180} label="1800s" />
                    <Select.Item value={181} label="1810s" />
                    <Select.Item value={182} label="1820s" />
                    <Select.Item value={183} label="1830s" />
                    <Select.Item value={184} label="1840s" />
                    <Select.Item value={185} label="1850s" />
                    <Select.Item value={186} label="1860s" />
                    <Select.Item value={187} label="1870s" />
                    <Select.Item value={188} label="1880s" />
                    <Select.Item value={189} label="1890s" />
                    <Select.Item value={190} label="1900s" />
                    <Select.Item value={191} label="1910s" />
                    <Select.Item value={192} label="1920s" />
                    <Select.Item value={193} label="1930s" />
                    <Select.Item value={194} label="1940s" />
                    <Select.Item value={195} label="1950s" />
                    <Select.Item value={196} label="1960s" />
                    <Select.Item value={197} label="1970s" />
                    <Select.Item value={198} label="1980s" />
                    <Select.Item value={199} label="1990s" />
                    <Select.Item value={200} label="2000s" />
                    <Select.Item value={201} label="2010s" />
                    <Select.Item value={202} label="2020s" />
                  </Select>
                )}
                {dateType === 'Year' && (
                  <Input
                    placeholder="YYYY"
                    maxLength={4}
                    keyboardType="number-pad"
                    type="number"
                    defaultValue={year}
                    onChangeText={value => setYear(value)}></Input>
                )}
                {dateType === 'Month' && (
                  <View>
                    <Input
                      placeholder="Enter Year"
                      maxLength={4}
                      keyboardType="number-pad"
                      type="number"
                      defaultValue={year}
                      onChangeText={value => setYear(value)}></Input>
                    <Input
                      placeholder="Enter Month"
                      maxLength={2}
                      keyboardType="number-pad"
                      value={month}
                      type="number"
                      onChangeText={value => setMonth(value)}></Input>
                  </View>
                )}
                {dateType === 'Day' && (
                  <View>
                    <Input
                      placeholder="Enter Year"
                      maxLength={4}
                      keyboardType="number-pad"
                      type="number"
                      defaultValue={year}
                      onChangeText={value => setYear(value)}></Input>
                    <Input
                      placeholder="Enter Month"
                      maxLength={2}
                      keyboardType="number-pad"
                      value={month}
                      onChangeText={value => setMonth(value)}></Input>
                    <Input
                      placeholder="Enter Day"
                      maxLength={2}
                      keyboardType="number-pad"
                      value={day}
                      onChangeText={value => setDay(value)}></Input>
                  </View>
                )}
                {dateType === 'Start-End Year' && (
                  <View>
                    <Input
                      placeholder="Start Year"
                      maxLength={4}
                      keyboardType="number-pad"
                      type="number"
                      defaultValue={startYear}
                      onChangeText={value => setStartYear(value)}></Input>
                    <Input
                      placeholder="End Yeard"
                      maxLength={4}
                      keyboardType="number-pad"
                      value={endYear}
                      onChangeText={value => setEndYear(value)}></Input>
                  </View>
                )}
                {dateType === 'Start-End Month' && (
                  <View>
                    <Input
                      placeholder="Start Year"
                      maxLength={4}
                      keyboardType="number-pad"
                      type="number"
                      defaultValue={startYear}
                      onChangeText={value => setStartYear(value)}></Input>
                    <Input
                      placeholder="End Yeard"
                      maxLength={4}
                      keyboardType="number-pad"
                      value={endYear}
                      onChangeText={value => setEndYear(value)}></Input>
                    <Input
                      placeholder="Start Month"
                      maxLength={2}
                      keyboardType="number-pad"
                      type="number"
                      defaultValue={startMonth}
                      onChangeText={value => setStartMonth(value)}></Input>
                    <Input
                      placeholder="End Monthd"
                      maxLength={2}
                      keyboardType="number-pad"
                      value={endMonth}
                      onChangeText={value => setEndMonth(value)}></Input>
                  </View>
                )}
                {dateType === 'Start-End Day' && (
                  <View>
                    <Input
                      placeholder="Start Year"
                      maxLength={4}
                      keyboardType="number-pad"
                      type="number"
                      defaultValue={startYear}
                      onChangeText={value => setStartYear(value)}></Input>
                    <Input
                      placeholder="End Yeard"
                      maxLength={4}
                      keyboardType="number-pad"
                      value={endYear}
                      onChangeText={value => setEndYear(value)}></Input>
                    <Input
                      placeholder="Start Month"
                      maxLength={2}
                      keyboardType="number-pad"
                      type="number"
                      defaultValue={startMonth}
                      onChangeText={value => setStartMonth(value)}></Input>
                    <Input
                      placeholder="End Monthd"
                      maxLength={2}
                      keyboardType="number-pad"
                      value={endMonth}
                      onChangeText={value => setEndMonth(value)}></Input>
                    <Input
                      placeholder="Start Day"
                      maxLength={2}
                      keyboardType="number-pad"
                      type="number"
                      defaultValue={startDay}
                      onChangeText={value => setStartDay(value)}></Input>
                    <Input
                      placeholder="End Dayd"
                      maxLength={2}
                      keyboardType="number-pad"
                      value={endDay}
                      onChangeText={value => setEndDay(value)}></Input>
                  </View>
                )}
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
              <Button onPress={handleSaveDate}>Save</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
};

export default DateFormModal;
