import React, { Component } from 'react';
import { Link } from "gatsby"; // TODO gatsby link
import os1 from "../../images/open-source-1.jpg"; // TODO gatsby image
import os2 from "../../images/open-source-2.jpg"; // TODO gatsby image
import os3 from "../../images/open-source-3.jpg"; // TODO gatsby image
import os4 from "../../images/open-source-4.jpg"; // TODO gatsby image
import { Button } from 'react-bootstrap'; // TODO button

/*
  It's likely that this could all be JSON
  the slides are overkill here and could easily be accomplished with gatsby / bootstrap.
*/ 

class Slide1 extends Component {
    render() {
      return (
      <div className="slideData">
        <img src={ os1 } alt="os1"></img>
        <div className="slide">
          <div className="slideTitle">
            <h1> Welcome to Verizon Open Source. <br></br> </h1>
            <br></br>
            <h4> We welcome and encourage contributions. </h4>
            <br></br>
            <h4>Innovate. Collaborate. Learn. </h4>
          </div>
          <div className="slideButton">
            <Link to="/community">
              <Button viewport="mobile">Learn More</Button>
            </Link>
          </div>
        </div>
      </div>);
    }
}
class Slide2 extends Component {
  render() {
    return (<div className="slideData">
      <img src={ os4 } alt="os4"></img>
      <div className="slide">
        <div className="slideTitle">
          <h2>5G Edge Tutorials</h2>
          <br></br>
          <h4>Launch your first application at the network edge.</h4>
        </div>
        <div className="slideButton">
          <a href="https://github.com/Verizon/5GEdgeTutorials" target="_blank" rel="noreferrer">
            <Button viewport="mobile">Project Info</Button>
          </a>
        </div>
      </div>
    </div>);
  }
}

class Slide3 extends Component {
  render() {
    return (<div className="slideData">
      <img src={ os2 } alt="os2"></img>
      <div className="slide">
        <div className="slideTitle">
          <h1>YANG Validator</h1>
          <br></br>
          <h4>A project to help equipment vendors validate against OpenConfig YANG.</h4>
        </div>
        <div className="slideButton">
          <a href="https://github.com/Verizon/YANG-validator" target="_blank" rel="noreferrer">
            <Button viewport="mobile">Project Info</Button>
          </a>
        </div>
      </div>
    </div>);
  }
}

class Slide4 extends Component {
    render() {
      return (<div className="slideData">
        <img src={ os3 } alt="os3"></img>
        <div className="slide">
          <div className="slideTitle">
            <h1> Safecache </h1>
            <br></br>
            <h4>Thread-safe. Mutation-safe.</h4>
          </div>
          <div className="slideButton">
            <a href ="https://github.com/Verizon/safecache" target="_blank" rel="noreferrer">
              <Button viewport="mobile">Project Info</Button>
            </a>
          </div>
        </div>
      </div>);
    }
  }


  
  export { Slide1, Slide2, Slide3, Slide4}