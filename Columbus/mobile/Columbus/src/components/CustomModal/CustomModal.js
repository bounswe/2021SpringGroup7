import React from 'react';
import {Modal, Text, Button} from 'native-base';

const CustomModal = props => {
  return (
    <Modal isOpen={props.showModal} onClose={props.closeModal}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Info</Modal.Header>
        <Modal.Body>
          <Text style={{textAlign: 'center'}}>{props.message}</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button onPress={props.closeModal}>Ok</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default CustomModal;
