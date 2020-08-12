import React from "react";
import { Title } from '@vds/typography';
import placeholder from '../images/placeholder-image.png';

const FeaturedProjects = () => (
<div className="featuredProjects">
  <Title>Featured Projects</Title>
  <div className="innerFeaturedProjects">
      <div className="project">
        <img src={placeholder} alt='placeholder'/>         
      </div>
      <div className="project">
        <img src={placeholder} alt='placeholder'/> 
      </div>
      <div className="project">
        <img src={placeholder} alt='placeholder'/>
      </div>
  </div>
</div>
);

export default FeaturedProjects;