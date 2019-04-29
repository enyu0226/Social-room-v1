import React from "react";
import Posts from "../post/Posts";

const Home = () => (
  <div>
    <div className="jumbotron">
      <h2 className="lead text-center">Welcome to Social Room</h2>
    </div>
    <div className="container">
      <Posts />
    </div>
  </div>
);

export default Home;
