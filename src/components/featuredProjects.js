import React from "react";
import { Link } from "gatsby"; // TODO: Gatsby link
import fp1 from '../images/laptop-antivirus-blk.png'; // TODO Gatsby Image
import fp2 from '../images/hackers-blk.png'; // TODO gatsby image
import fp3 from '../images/digital-content-blk.png'; // TODO: Probalby gastby image

const FeaturedProjects = () => (
<div className="featuredProjects">
  <div className="ftProjectsTitle">
<Link to="/projects"><h1>Featured projects</h1></Link>
  </div>
  <div className="innerFeaturedProjects">
      <div className="project1">
          <img src={fp1} alt='fp1'/> 
            <h2>Caching</h2>
            <a href="https://github.com/Verizon/safecache" target="_blank" rel="noreferrer">
              <h3>Safecache</h3>
              </a>
      </div>
      <div className="project2">
        <img src={fp2} alt='fp2'/> 
          <h2>YANG</h2>
          <a href="https://github.com/Verizon/YANG-validator" target="_blank" rel="noreferrer">
            <h3>Validator</h3>
          </a>
          <a href="https://github.com/Verizon/YANG-transformer" target="_blank" rel="noreferrer">
            <h3>Transformer</h3>
          </a>          
      </div>
      <div className="project3">
          <img src={fp3} alt='fp3'/>
            <h2>AWS</h2>
            <a href="https://github.com/Verizon/5GEdgeTutorials" target="_blank" rel="noreferrer">
              <h3>5G Edge</h3>
            </a>
      </div>
  </div>
</div>
);

export default FeaturedProjects;