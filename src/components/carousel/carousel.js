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
