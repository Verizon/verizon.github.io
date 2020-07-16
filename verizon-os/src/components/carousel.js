import React, {Component} from "react";
import styled from 'styled-components';
import "../styles/styles.scss";
//import { Title, Body, Subtitle } from '@vds/typography';
import { CarouselBars } from '@vds/carousels';
import os1 from "../images/open-source-1.png";
import os2 from "../images/open-source-2.png";
import os3 from "../images/open-source-3.jpeg";
import os4 from "../images/open-source-4.png"; 

var idx = 0; 
const Container = styled.div`
    display: flex; 
    padding-top: 100px;
    padding-left: 235px; 
 `;

export default class Carousel extends Component {
  state = {
    selectedSlide: 1,
    images: [os1, os2, os3, os4],
    index: 0
  };

  /* Setting a timer of 5 seconds to auto rotate through each image and updating the states accordingly */
  componentDidMount () {
    idx = 0; 
    this.startCarousel(); 
    
    }

  startCarousel() {
    this.timer = setInterval(() => {
      if (idx < 3) {
        this.setState({ index: idx, selectedSlide: idx+1});
        idx = (idx+1)%(this.state.images.length); 
      }

        else {
          this.setState({index: 3, selectedSlide: 4})
          idx = 0;
        
        } 
      }, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    idx = 0; 
  }


  /*goToSlide sets the state object with the correct active slide when one of the carousel bars is clicked so that bar is highlighted and the right image is rendered */
  goToSlide = slide => {
    this.setState(() => (
        { selectedSlide: slide, index: slide-1}
         ));
         idx = slide-1; 
  };
  render() {
    const { selectedSlide } = this.state; 
    return (
        
      <Container style={{display: 'inline-block'}}>
        <img src= { this.state.images[this.state.index] } alt="" style={{ height:'250px', width: '1200px', left: '45%'}} ></img>
        <CarouselBars style={{ position: 'relative', left: '45%', width: '10%'}}
          uniqueId="carousel-bars-default-example-id"
          activeSlide={selectedSlide}
          slideCount={4}
          goToSlide={this.goToSlide}
        />
      </Container>
    );
  }
}



