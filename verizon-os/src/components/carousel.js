import React, {Component} from "react";
import styled from 'styled-components';
import "../styles/styles.scss";
//import { Title, Body, Subtitle } from '@vds/typography';
import { CarouselBars } from '@vds/carousels';
import { Slide1 } from '../components/carouselData';
import { Slide2 } from '../components/carouselData'; 
import { Slide3 } from '../components/carouselData'; 
import { Slide4 } from '../components/carouselData'; 

let idx = 0; 
const Container = styled.div`
    display: flex; 
    padding-top: 100px;
    padding-left: 235px; 
 `;

export default class Carousel extends Component {
  state = {
    selectedSlide: 1,
    showHide1: true, 
    showHide2: false, 
    showHide3: false, 
    showHide4: false, 
    index: 0
  };

  /* Setting a timer of 5 seconds to auto rotate through each image and updating the states accordingly */
  componentDidMount () {
    idx = 0; 
    this.startCarousel(); 
    }

  startCarousel() {
    // this.timer = setInterval(() => {
    //   if (idx < 3) {
    //     this.setState({ index: idx, selectedSlide: idx+1});
    //     idx = (idx+1)%(this.state.images.length); 
    //   } else {
    //     this.setState({index: 3, selectedSlide: 4})
    //     idx = 0;
    //   } 
    // }, 5000)
    this.setState({ index: idx, selectedSlide: idx+1});

  }

  componentWillUnmount() {
    //clearInterval(this.timer);
    idx = 0; 
  }

  /*goToSlide sets the state object with the correct active slide when one of the carousel bars is clicked so that bar is highlighted and the right image is rendered */
  goToSlide = slide => {
    this.setState(() => (
      { selectedSlide: slide, index: slide-1}
    ));
    this.hideComponent(slide);
    idx = slide-1; 
  };

  hideComponent(slide) {
    switch (slide) {
      case 1: 
        this.setState({showHide1: true});
        this.setState({showHide2: false});
        this.setState({showHide3: false});
        this.setState({showHide4: false}); 
        break; 
      case 2: 
        this.setState({showHide1: false});
        this.setState({showHide2: true});
        this.setState({showHide3: false});
        this.setState({showHide4: false}); 
        break; 
      case 3: 
        this.setState({showHide1: false});
        this.setState({showHide2: false});
        this.setState({showHide3: true});
        this.setState({showHide4: false}); 
        break; 
      case 4: 
        this.setState({showHide1: false});
        this.setState({showHide2: false});
        this.setState({showHide3: false});
        this.setState({showHide4: true}); 
        break; 
      default: 
    }
  }

  render() {
    const { selectedSlide, showHide1, showHide2, showHide3, showHide4 } = this.state; 
    return (
     
      <Container style={{display: 'block', paddingBottom: '10px', border: "1px", paddingLeft: '0px', paddingTop: '0px'}}>
        {/* <img src= { this.state.images[0] } alt="" style={{ position: 'relative', paddingTop: '50px', height:'75vh', width: '100%', margin: '0'}} ></img> */}
       
        { showHide1 && <Slide1 /> }
        { showHide2 && <Slide2 /> }
        { showHide3 && <Slide3 /> }
        { showHide4 && <Slide4 /> }

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



