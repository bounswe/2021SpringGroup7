import logo from './logo.svg';

import { Route, Routes } from "react-router-dom";

import './App.css';
import React, { useState, useEffect } from 'react';

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import OtherProfiles from "./pages/OtherProfiles";
import Wrapper from './components/Wrapper/Wrapper'



var API_BASE = 'http://ec2-35-158-103-6.eu-central-1.compute.amazonaws.com:8000/test/hello/';

if (process.env.NODE_ENV === 'development') {
	API_BASE = 'http://localhost:8000/test/hello/';
}

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [item, setItem] = useState([])


  
  useEffect(() => {

    let message = '! FRONT TEAM !'
    fetch(API_BASE + message)
      .then((result) => result.json())
      .then(result => {
        setIsLoaded(true)
        setItem(result)
      })

  }, [])

  if (!isLoaded) {
    return (
      <Wrapper>
        <div>Loading...</div>
      </Wrapper>
    );
  } 
  else {
     return (
        <Home></Home>
    );

  }

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
