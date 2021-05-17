import React from "react";
import { Link } from "react-router-dom";
import fp1 from '../images/laptop-antivirus-blk.png'; 
import fp2 from '../images/hackers-blk.png'; 
import fp3 from '../images/digital-content-blk.png'; 
import { Title, Subtitle } from '@vds/typography'; 

const FeaturedProjects = () => (
<div className="featuredProjects">
  <div className="ftProjectsTitle">
<Link to="/projects"><Title size="large">Featured projects</Title></Link>
  </div>
  <div className="innerFeaturedProjects">
      <div className="project1">
          <img src={fp1} alt='fp1'/> 
            <Title viewport="mobile" size="large">Caching</Title>
            <a href="https://github.com/Verizon/safecache" target="_blank" rel="noreferrer"><Subtitle viewport="mobile" size="large">Safecache</Subtitle></a>    
      </div>
      <div className="project2">
        <img src={fp2} alt='fp2'/> 
          <Title viewport="mobile" size="large">YANG</Title>
          <a href="https://github.com/Verizon/YANG-validator" target="_blank" rel="noreferrer"><Subtitle viewport="mobile" size="large">Validator</Subtitle></a>
          <a href="https://github.com/Verizon/YANG-transformer" target="_blank" rel="noreferrer"><Subtitle viewport="mobile" size="large">Transformer</Subtitle></a>
          
      </div>
      <div className="project3">
          <img src={fp3} alt='fp3'/>
            <Title viewport="mobile" size="large">AWS</Title>
            <a href="https://github.com/Verizon/5GEdgeTutorials" target="_blank" rel="noreferrer"><Subtitle viewport="mobile" size="large">5G Edge</Subtitle></a>        
      </div>
  </div>
</div>
);

export default FeaturedProjects;