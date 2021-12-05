import React from "react";
import Dialog from "@material-ui/core/Dialog";
import LoginForm from "../../Forms/LoginForm";
import Logo from "../../Logos/LogoWithText";

const LoginDialog = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <Logo className="App-logo" alt="Logo" />
      <LoginForm handleClose={handleClose} />
    </Dialog>
  );
};

export default LoginDialog;
