import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import EmailConfirmation from "./pages/EmailConfirmationPage";
import Home from "./pages/Home";
import Explore from "./pages/Explore/Explore"
import CreatePostPage from "./pages/CreatePostPage";
import {Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Profile from "./pages/Profile"
import Admin from "./pages/Admin/Admin"
import AdminLogin from "./pages/Admin/AdminLogin"
import {API_INSTANCE} from './config/api';
import PostSearchPage from "./pages/Search/PostSearchPage";
import UserSearchPage from "./pages/Search/UserSearchPage";
import {LoadScript} from '@react-google-maps/api';
import "react-datetime/css/react-datetime.css";

function App() {
  const [Authenticated, setAuthenticated] = useState(!!localStorage.getItem("jwtToken"))
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = React.useState("");

  const [adminAuthenticated, setAdminAuthenticated] = useState(!!localStorage.getItem("login_hash"))

  if(!!localStorage.getItem("jwtToken")){
      API_INSTANCE.defaults.headers.common['Authorization'] = localStorage.getItem("jwtToken");
    }
  document.title="Columbus"


  const handleCloseSnackBar = () => {
    setSnackBarMessage("");
    setOpenSnackBar(false);
  };

  return (
    <div className="App">
      <LoadScript
          googleMapsApiKey="AIzaSyBKOGKEqH_j_aKxoUE46yhNx8XLOFEczaQ"
        >
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
            element={<Home isAuthenticatedx={Authenticated}/>}
          />
          <Route
            path="/email-confirmation"
            element={<EmailConfirmation />}
          />
           <Route
            path="/Profile"
            element={<Profile/>}
          />
          <Route
            path="/Profile/:userId"
            element={<Profile/>}
          />
          <Route
            path="/Search"
            element={<PostSearchPage/>}
          />
          <Route
            path="/UserSearch"
            element={<UserSearchPage/>}
          />
          <Route
            path="/Home/Story/Create"
            element={<CreatePostPage setSnackBarMessage={setSnackBarMessage} setOpenSnackBar={setOpenSnackBar}/>}
          />
          <Route
            exact
            path="/Explore"
            element={<Explore/>}
          />
           <Route
            path="/admin/login"
            element={adminAuthenticated ?  <Navigate replace to = "/admin" /> : <AdminLogin setAuthenticated={setAdminAuthenticated} />}
          />
           <Route
            path="/admin"
            element={ adminAuthenticated ? <Admin></Admin> : <Navigate replace to = "/admin/login" />}
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
  </LoadScript>
    </div>
  );
}

export default App;