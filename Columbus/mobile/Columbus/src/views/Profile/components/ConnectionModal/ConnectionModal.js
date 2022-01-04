import React, {useEffect} from 'react';
import {Modal, Text} from 'native-base';
import CustomAvatar from '../CustomAvatar';
import getInitials from '../../../../utils/getInitial';
import {TouchableOpacity, View} from 'react-native';
import {styles} from './ConnectionModal.style';
import {useAuth} from '../../../../context/AuthContext';

const ConnectionModal = props => {
  const {user} = useAuth();
  let token = '';

  useEffect(() => {
    if (user) {
      token = user.userInfo.token;
    }
  }, [user]);

  const handleOpenProfile = (user_id, username) => {
    props.closeModal();
    if (user && user.userInfo.user_id === user_id) {
      return props.navigation.push('Profile');
    } else {
      return props.navigation.push('OtherProfiles', {
        userId: user_id,
        username,
        token,
      });
    }
  };

  return (
    <Modal isOpen={props.showModal} onClose={props.closeModal}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>{props.header}</Modal.Header>
        <Modal.Body>
          {props.data.length !== 0 ? (
            props.data.map(userInfo => {
              return (
                <TouchableOpacity
                  style={styles.container}
                  onPress={() =>
                    handleOpenProfile(userInfo.user_id, userInfo.username)
                  }>
                  <CustomAvatar
                    imageUrl={userInfo?.photo_url}
                    initials={`${getInitials(userInfo.username)}`}
                  />
                  <Text>{userInfo.username}</Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text>{`${
              props.username ? `${props.username} doesnt` : 'You dont'
            } have any ${props.header}!`}</Text>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default ConnectionModal;
