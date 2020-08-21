import React, { Component } from 'react';
import os1 from "../images/open-source-1.jpg";
import os2 from "../images/open-source-2.jpg";
import os3 from "../images/open-source-3.jpg"; 
import os4 from "../images/open-source-4.jpg"; 
import { Body, Title } from '@vds/typography';
import { Button } from '@vds/buttons';

class Slide1 extends Component {
    handleClickEvent = () => alert('You clicked the Button example!');
    render() {
      return (<div className="slideData">
        <img src={ os1 } alt="os1"></img>
        <div className="slideTitle1">
            <Title size="large" color="#747676"> Welcome to Verizon Open Source. <br></br> We tolerate open source, reluctantly.</Title>
            <br></br>
            <Title size="large" color="#747676">But we’re coming around to it.</Title>
        </div>
        <div className="slideButton1">
            <Button onClick={this.handleClickEvent}>Learn More</Button>
        </div>
      </div>);
    };
}

class Slide2 extends Component {
    handleClickEvent = () => alert('You clicked the Button example!');
    render() {
      return (<div className="slideData">
        <img src={ os2 } alt="os2"></img>
        <div className="slideTitle2">
            <Title size="large" color="#333333"> Safecache </Title>
            <br></br>
            <Body size="large" bold={true} color="#333333">Thread-safe. Mutation-safe.</Body>
        </div>
        <div className="slideButton2">
            <Button onClick={this.handleClickEvent}>Project Details</Button>
        </div>
      </div>);
    };
  }

class Slide3 extends Component {
    handleClickEvent = () => alert('You clicked the Button example!');
    render() {
      return (<div className="slideData">
        <img src={ os3 } alt="os3"></img>
        <div className="slideTitle2">
            <Title size="large" color="#747676"> Project Project</Title>
        </div>
        <div className="slideButton2">
            <Button onClick={this.handleClickEvent}>Check Me Out</Button>
        </div>
      </div>);
    };
  }

class Slide4 extends Component {
    handleClickEvent = () => alert('You clicked the Button example!');
    render() {
      return (<div className="slideData">
        <img src={ os4 } alt="os4"></img>
        <div className="slideTitle2">
            <Title size="large" color="#333333"> Project Project</Title>
        </div>
        <div className="slideButton2">
            <Button onClick={this.handleClickEvent}>Check Me Out</Button>
        </div>
      </div>);
    };
  }
  
  export { Slide1, Slide2, Slide3, Slide4}