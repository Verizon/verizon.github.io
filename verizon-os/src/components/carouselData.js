import React, { Component } from 'react';
import { Link } from "gatsby";
import os1 from "../images/open-source-1.jpg";
import os2 from "../images/open-source-2.jpg";
import os3 from "../images/open-source-3.jpg"; 
import os4 from "../images/open-source-4.jpg"; 
import { Body, Title } from '@vds/typography';
import { Button } from '@vds/buttons';

class Slide1 extends Component {
    render() {
      return (<div className="slideData">
        <img src={ os1 } alt="os1"></img>
        <div className="slideTitle1">
            <Title size="large" color="#747676"> Welcome to Verizon Open Source. <br></br> We tolerate open source, reluctantly.</Title>
            <br></br>
            <Title size="large" color="#747676">But we’re coming around to it.</Title>
        </div>
        <div className="slideButton1">
            <Link to="/community"><Button>Learn More</Button></Link>
        </div>
      </div>);
    };
}

class Slide2 extends Component {
    render() {
      return (<div className="slideData">
        <img src={ os2 } alt="os2"></img>
        <div className="slideTitle2">
            <Title size="large" color="#333333"> Safecache </Title>
            <br></br>
            <Body size="large" bold={true} color="#333333">Thread-safe. Mutation-safe.</Body>
        </div>
        <div className="slideButton2">
            <Link to="https://github.com/Verizon/safecache" target="_blank"><Button>Project Details</Button></Link>
        </div>
      </div>);
    };
  }

class Slide3 extends Component {
    render() {
      return (<div className="slideData">
        <img src={ os3 } alt="os3"></img>
        <div className="slideTitle2">
            <Title size="large" color="#747676">YANG-validator</Title>
            <br></br>
            <Body size="large" bold={true} color="#333333">A project to help equipment vendors validate against OpenConfig YANG</Body>
        </div>
        <div className="slideButton2">
            <Link to="https://github.com/Verizon/YANG-validator" target="_blank"><Button>Project Details</Button></Link>
        </div>
      </div>);
    };
  }

class Slide4 extends Component {
    render() {
      return (<div className="slideData">
        <img src={ os4 } alt="os4"></img>
        <div className="slideTitle2">
            <Title size="large" color="#333333">YANG-transformer</Title>
            <br></br>
            <Body size="large" bold={true} color="#333333">Transformer library for OpenConfig YANG JSON</Body>
        </div>
        <div className="slideButton2">
        <Link to="https://github.com/Verizon/YANG-transformer" target="_blank"><Button>Project Details</Button></Link>
        </div>
      </div>);
    };
  }
  
  export { Slide1, Slide2, Slide3, Slide4}