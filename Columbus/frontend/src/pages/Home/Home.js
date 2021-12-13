import React, { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom'

import Wrapper from "../../components/Wrapper/Wrapper";

import HomePostScroll from '../../components/PostScroll/HomePostScroll'


function Home({isAuthenticated}) {
  const curUser = localStorage.getItem('username')

  console.log('is auth from home', isAuthenticated)
  return (
    <Wrapper>
        <HomePostScroll isAuthenticated={isAuthenticated} curUser={curUser}></HomePostScroll>
    </Wrapper>
);
}

export default Home;
