import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div>Columbus home</div>
      <Link to="/profile">Profile </Link>
    </>
  );
}

export default Home;
