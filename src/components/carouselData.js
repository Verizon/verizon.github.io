import React, { Component } from 'react';
import { Link } from "react-router-dom";
import os1 from "../images/open-source-1.jpg";
import os2 from "../images/open-source-2.jpg";
import os3 from "../images/open-source-3.jpg"; 
import os4 from "../images/open-source-4.jpg"; 
import { Title } from '@vds/typography'; 
import { Button } from '@vds/buttons'; 

class Slide1 extends Component {
    render() {
      return (
      <div className="slideData">
        <img src={ os1 } alt="os1"></img>
        <div className="slide">
          <div className="slideTitle">
            <Title size="large" viewport="mobile" color="#FFFFFF"> Welcome to Verizon Open Source. <br></br> </Title>
            <br></br>
            <Title size="small" color="#FFFFFF"> We welcome and encourage contributions. </Title>
            <br></br>
            <Title size="small" viewport="mobile" color="#FFFFFF">Innovate. Collaborate. Learn. </Title>
          </div>
          <div className="slideButton">
            <Link to="/community"> <Button viewport="mobile">Learn More</Button></Link>
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
          <Title size="large" viewport="mobile" color="#000000">5G Edge Tutorials</Title>
          <br></br>
          <Title size="small" viewport="mobile" bold={true} color="#000000">Launch your first application at the network edge.</Title>
        </div>
        <div className="slideButton">
          <a href="https://github.com/Verizon/5GEdgeTutorials" target="_blank" rel="noreferrer"><Button viewport="mobile">Project Info</Button></a>
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
          <Title size="large" viewport="mobile" color="#FFFFFF">YANG Validator</Title>
          <br></br>
          <Title size="small" viewport="mobile" bold={true} color="#FFFFFF">A project to help equipment vendors validate against OpenConfig YANG.</Title>
        </div>
        <div className="slideButton">
          <a href="https://github.com/Verizon/YANG-validator" target="_blank" rel="noreferrer"> <Button viewport="mobile">Project Info</Button></a>
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
            <Title size="large" viewport="mobile" color="#FFFFFF"> Safecache </Title>
            <br></br>
            <Title size="small" viewport="mobile" bold={true} color="#FFFFFF">Thread-safe. Mutation-safe.</Title>
          </div>
          <div className="slideButton">
            <a href ="https://github.com/Verizon/safecache" target="_blank" rel="noreferrer"> <Button viewport="mobile">Project Info</Button></a>
          </div>
        </div>
      </div>);
    }
  }


  
  export { Slide1, Slide2, Slide3, Slide4}