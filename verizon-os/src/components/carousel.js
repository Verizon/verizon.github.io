import React, {Component} from "react";
import styled from 'styled-components';
import "../styles/styles.scss";
//import { Title, Body, Subtitle } from '@vds/typography';
import { CarouselBars } from '@vds/carousels';
import os1 from "../images/open-source-1.png";
import os2 from "../images/open-source-2.png";
import os3 from "../images/open-source-3.jpeg";
import os4 from "../images/open-source-4.png"; 

var images = []; 
// images = [{image: require("../images/open-source-1.png")}, {image: require("../images/open-source-2.png")}]
images=[os1, os2, os3, os4]; 

const Container = styled.div`
    display: flex; 
    padding-top: 100px;
    padding-left: 235px; 
 `;

export default class Carousel extends Component {
  imageIndex = 0; 
  state = {
    selectedSlide: 1
  };

  rotateActiveSlide = slide => {
    //setTimeout(() => {
      if (this.imageIndex === 3) {
        this.imageIndex = 0; 
        slide = 1; 
      }

      else {
        this.imageIndex++; 
        slide++; 
      }

      this.setState(() => (
      { selectedSlide: slide++ }
      ));
   // }, 5000);
  };


  goToSlide = slide => {
    this.setState(() => (
        { selectedSlide: slide }
         ));
          this.imageIndex=slide-1;
  };
  render() {
    const { selectedSlide } = this.state; 
    return (
        
      <Container>
        <img src= { images[this.imageIndex] } alt="" style={{ height:'250px', width: '1000px', border: 'solid 1px'}} ></img>
        <CarouselBars style={{ position: 'relative', top: '100px', right: '550px'}}
          uniqueId="carousel-bars-default-example-id"
          activeSlide={selectedSlide}
          slideCount={4}
          goToSlide={this.goToSlide}
        />
      </Container>
    );
  }
}



