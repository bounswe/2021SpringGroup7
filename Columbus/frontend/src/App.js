import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import EmailConfirmation from "./pages/EmailConfirmationPage";
import Home from "./pages/Home";

function App() {
  const [Authenticated, setAuthenticated] = useState(false)
  console.log(!!localStorage.getItem("jwtToken"))

  useEffect(() => {
    setAuthenticated(!!localStorage.getItem("jwtToken"));
    document.title="Columbus"
  }, [])

  
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route
            path="/"
            element={Authenticated ? <Navigate replace to="/Home" /> : <Login setAuthenticated={setAuthenticated} />}
          />
          <Route
            exact
            path="/Home"
            element={Authenticated ?  <Home /> : <Navigate replace to="/" />}
          />
          <Route
            path="/email-confirmation"
            element={<EmailConfirmation />}
          />
        </Routes>
      </Router>
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
