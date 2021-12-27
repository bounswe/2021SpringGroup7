import React from 'react';
import {Modal, Text, Button, Progress, Heading, Center, Box} from 'native-base';

const CustomModal = props => {
  return (
    <Modal
      isOpen={props.showModal}
      onClose={props.closeModal}
      closeOnOverlayClick={false}>
      <Modal.Content maxWidth="400px">
        {/* <Modal.CloseButton /> */}
        <Modal.Header>
          {props.progress === 100
            ? 'Image uploaded successfully'
            : 'Image Uplaoding...'}
        </Modal.Header>
        <Modal.Body>
          <Box w="100%">
            <Progress value={props.progress} mx="4" />
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              isDisabled={props.progress !== 100}
              onPress={props.closeModal}>
              Ok
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default CustomModal;
