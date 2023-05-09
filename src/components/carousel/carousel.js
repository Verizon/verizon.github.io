import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";


const Csl = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selected) => {
    setIndex(selected);
  }

  return (
    <Carousel fade activeIndex={index} onSelect={handleSelect} pause={true}>
      <Carousel.Item>
        <StaticImage 
          loading="eager"
          src="../../images/open-source-1.jpg"
          alt="seaside cliffs with a road extending to the horizon"
          className="carousel-image"
          imgClassName="carousel-inner-image"
          />
        <Carousel.Caption className="carousel-cap">
            <h1> Welcome to Verizon Open Source. <br></br> </h1>
            <h4> We welcome and encourage contributions. </h4>
            <h4>Innovate. Collaborate. Learn. </h4>  
            <Link to="/community">
            <button className="carousel-btn" viewport="mobile">
              <span className="carousel-btn-text">Learn More</span>
            </button>
            </Link>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <StaticImage 
          loading="eager"
          src="../../images/open-source-2.jpg"
          alt="a clear water clean sand beach, boats are in the water"
          className="carousel-image"
          />
        <Carousel.Caption className="carousel-cap">
          <h1>5G Edge Tutorials</h1>
          <h3>Launch your first application at the network edge.</h3>
          <a href="https://github.com/Verizon/5GEdgeTutorials" target="_blank" rel="noreferrer">
          <button className="carousel-btn" viewport="mobile">
              <span className="carousel-btn-text">More Info</span>
            </button>
          </a>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <StaticImage 
          loading="eager"
          src="../../images/open-source-3.jpg"
          alt="a single van driving on a bridge"
          className="carousel-image"
          />
        <Carousel.Caption className="carousel-cap">
          <h1>YANG Validator</h1>
          <h4>A project to help equipment vendors validate against OpenConfig YANG.</h4>
          <a href="https://github.com/Verizon/5GEdgeTutorials" target="_blank" rel="noreferrer">
          <button className="carousel-btn" viewport="mobile">
              <span className="carousel-btn-text">More Info</span>
            </button>
          </a>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <StaticImage 
          loading="eager"
          src="../../images/open-source-4.jpg"
          alt="Top-down picture of a beach with surfboards and people preparing to get in the water"
          className="carousel-image"
        />
        <Carousel.Caption className="carousel-cap">
          <h1>Safecache</h1>
          <h4>Thread-safe. Mutation-safe.</h4>
          <a href ="https://github.com/Verizon/safecache" target="_blank" rel="noreferrer">
            <button className="carousel-btn" viewport="mobile">
              <span className="carousel-btn-text">Project Info</span>
            </button>
          </a>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Csl

// const Container = styled.div`
//     display: flex; 
//     padding-top: 100px;
//     padding-left: 235px; 
//  `;

// export default class Carousel extends Component {
//   state = {
//     selectedSlide: 0,
//     showHide1: true, 
//     showHide2: false, 
//     showHide3: false, 
//     showHide4: false, 
//     index: 0
//   };

//   componentDidMount () {
//     this.setState({index: 0, selectedSlide: 0}); 
//     }


//   /*goToSlide sets the state object with the correct active slide when one of the carousel bars is clicked so that bar is highlighted and the right image is rendered */
//   goToSlide = slide => {
//     this.setState(() => (
//       { selectedSlide: slide, index: slide}
//     ));
//     this.hideComponent(slide+1);
//   };

//   hideComponent(slide) {
//     switch (slide) {
//       case 1: 
//         this.setState({showHide1: true});
//         this.setState({showHide2: false});
//         this.setState({showHide3: false});
//         this.setState({showHide4: false}); 
//         break; 
//       case 2: 
//         this.setState({showHide1: false});
//         this.setState({showHide2: true});
//         this.setState({showHide3: false});
//         this.setState({showHide4: false}); 
//         break; 
//       case 3: 
//         this.setState({showHide1: false});
//         this.setState({showHide2: false});
//         this.setState({showHide3: true});
//         this.setState({showHide4: false}); 
//         break; 
//       case 4: 
//         this.setState({showHide1: false});
//         this.setState({showHide2: false});
//         this.setState({showHide3: false});
//         this.setState({showHide4: true}); 
//         break; 
//       default: 
//     }
//   }

//   render() {
//     const { selectedSlide, showHide1, showHide2, showHide3, showHide4 } = this.state; 
//     return (
//       <Container style={{display: 'block', paddingBottom: '10px', border: "1px", paddingLeft: '0px', paddingTop: '0px'}}>
       
//         { showHide1 && <Slide1 /> }
//         { showHide2 && <Slide2 /> }
//         { showHide3 && <Slide3 /> }
//         { showHide4 && <Slide4 /> }

//           <CarouselBars style={{ position: 'relative', left: '45%', width: '10%'}}
//           uniqueId="carousel-bars-default-example-id"
//           activeSlide={selectedSlide}
//           slideCount={4}
//           goToSlide={this.goToSlide}
//         />

        
//       </Container>
//     );
//   }
// }



