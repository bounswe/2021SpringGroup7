import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import EmailConfirmation from "./pages/EmailConfirmationPage";
import Home from "./pages/Home";
import CreatePostPage from "./pages/CreatePostPage";
import {Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

function App() {
  const [Authenticated, setAuthenticated] = useState(false)
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = React.useState("");

  console.log(!!localStorage.getItem("jwtToken"))

  useEffect(() => {
    setAuthenticated(!!localStorage.getItem("jwtToken"));
    document.title="Columbus"
  }, [])

  const handleCloseSnackBar = () => {
    setSnackBarMessage("");
    setOpenSnackBar(false);
  };

  return (
    <div className="App">
      <Router>
        <Routes>
        <Route
            path="/login"
            element={Authenticated ? <Navigate replace to = "/Home" /> : <Login setAuthenticated={setAuthenticated} />}
          />
          <Route
            exact
            path="/"
            element={<Navigate replace to="/Home" />}
          />
           <Route
            exact
            path="/home"
            element={<Home/>}
          />
          <Route
            path="/email-confirmation"
            element={<EmailConfirmation />}
          />
          <Route
            path="/Home/Story/Create"
            element={<CreatePostPage setSnackBarMessage={setSnackBarMessage} setOpenSnackBar={setOpenSnackBar}/>}
          />
        </Routes>
      </Router>
      <Snackbar
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    open={openSnackBar}
    autoHideDuration={6000}
    onClose={handleCloseSnackBar}
    message={snackBarMessage}
    action={
      <React.Fragment>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleCloseSnackBar}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    }
  />
    </div>
  );
}

export default App;


/*
  <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {item['return']}
           
          </p>
        </header>
      </div>
*/
