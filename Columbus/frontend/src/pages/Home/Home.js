import React, { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom'

import Wrapper from "../../components/Wrapper/Wrapper";

import HomePostScroll from '../../components/PostScroll/HomePostScroll'


function Home({isAuthenticatedx, ...props}) {
  const curUser = localStorage.getItem('username')


  console.log('is auth from home', isAuthenticatedx)
  return (
    <Wrapper>
        <HomePostScroll 
          isAuthenticatedX={isAuthenticatedx} 
          curUser={curUser}>
        </HomePostScroll>
    </Wrapper>
);
}

export default Home;
