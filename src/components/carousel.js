import React, {Component} from "react";
import styled from 'styled-components';
import "../styles.scss";
import { Slide1 } from '../components/carouselData';
import { Slide2 } from '../components/carouselData'; 
import { Slide3 } from '../components/carouselData'; 
import { Slide4 } from '../components/carouselData'; 
import { CarouselBars } from '@vds/carousels'; 

const Container = styled.div`
    display: flex; 
    padding-top: 100px;
    padding-left: 235px; 
 `;

export default class Carousel extends Component {
  state = {
    selectedSlide: 0,
    showHide1: true, 
    showHide2: false, 
    showHide3: false, 
    showHide4: false, 
    index: 0
  };

  componentDidMount () {
    this.setState({index: 0, selectedSlide: 0}); 
    }


  /*goToSlide sets the state object with the correct active slide when one of the carousel bars is clicked so that bar is highlighted and the right image is rendered */
  goToSlide = slide => {
    this.setState(() => (
      { selectedSlide: slide, index: slide}
    ));
    this.hideComponent(slide+1);
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



