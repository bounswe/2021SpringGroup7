import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Form from '../../../pages/Login/Login';

const LoginDialog = ({ open, handleClose}) => {
    return ( 
        <Dialog 
            open = { open }
            onClose = { handleClose } 
        >
            <Form handleClose = { handleClose }/> 
        </Dialog>
    );
};

export default LoginDialog;