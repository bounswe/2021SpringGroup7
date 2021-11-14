import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Form from './Register';

const ModalDialog = ({ open, handleClose }) => {
	return (
		// props received from App.js
		<Dialog open={open} onClose={handleClose}>
			// form to be created
			<Form handleClose={handleClose} />{' '}
		</Dialog>
	);
};

export default ModalDialog;
