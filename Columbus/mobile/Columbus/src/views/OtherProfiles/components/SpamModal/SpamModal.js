import React, {useState} from 'react';
import {Button, Modal, Switch, TextArea} from 'native-base';

import {useAuth} from '../../../../context/AuthContext';
import {Text, View} from 'react-native';
import {useMutation} from 'react-query';
import {SERVICE} from '../../../../services/services';

const SpamModal = props => {
  const [isReport, setIsReport] = useState(true);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const reportUser = useMutation(
    params => SERVICE.postReportUser(params, props.token),
    {
      onSuccess(response) {
        setIsLoading(false);
        props.closeModal();
      },
      onError({response}) {
        setIsLoading(false);
        console.log('error report user: ', response);
      },
    },
  );

  const blockUser = useMutation(
    params => SERVICE.postBlockUser(params, props.token),
    {
      onSuccess(response) {
        setIsLoading(false);
        props.closeModal();
      },
      onError({response}) {
        setIsLoading(false);
        console.log('error block user: ', response);
      },
    },
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    if (isReport) {
      const data = JSON.stringify({
        reported_username: props.reportedUsername,
        reporter_username: props.reporterUsername,
        report: message,
      });
      try {
        await reportUser.mutateAsync(data);
      } catch (e) {
        console.log('catch error report: ', e);
      }
    } else {
      const data = JSON.stringify({
        blocker: props.blocker,
        blocked: props.blocked,
        action_block: true,
      });
      try {
        await blockUser.mutateAsync(data);
      } catch (e) {
        console.log('catch error block: ', e);
      }
    }
  };

  return (
    <Modal isOpen={props.showModal} onClose={props.closeModal}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Block or Report User</Modal.Header>
        <Modal.Body>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <Button
                width={'45%'}
                onPress={() => setIsReport(true)}
                variant={isReport ? 'solid' : 'outline'}
                style={{marginTop: 8}}>
                <Text style={{fontWeight: '500'}}>Report</Text>
              </Button>
              <Button
                width={'45%'}
                onPress={() => setIsReport(false)}
                variant={!isReport ? 'solid' : 'outline'}
                style={{marginTop: 8}}>
                <Text style={{fontWeight: '500'}}>Block</Text>
              </Button>
            </View>
            {isReport && (
              <TextArea
                style={{margin: 8}}
                aria-label="t1"
                numberOfLines={4}
                value={message}
                onChangeText={value => setMessage(value)}
                placeholder="Enter Report Message"
                borderColor="#4aa9ff"
                mb="5"
              />
            )}
            <Button
              isLoading={isLoading}
              onPress={handleSubmit}
              isDisabled={isReport && message === ''}
              style={{marginTop: 8}}>
              <Text style={{fontWeight: '500', color: 'white'}}>Submit</Text>
            </Button>
          </View>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default SpamModal;
