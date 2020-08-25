import React from "react";
import { Title} from '@vds/typography';
import { Link } from "gatsby";
import fp1 from '../images/laptop-antivirus-auxiliary.png'; 
import fp2 from '../images/hackers_auxiliary.png'; 
import fp3 from '../images/digital-content_auxiliary.png'; 

const FeaturedProjects = () => (
<div className="featuredProjects">
  <Link to="/projects"><Title>Featured Projects</Title></Link>
  <div className="innerFeaturedProjects">
      <div className="project">
        <a href="https://github.com/Verizon/safecache">
          <img src={fp1} alt='fp1'/> 
          <Title size="small">Safecache</Title>      
        </a> 
      </div>
      <div className="project">
        <a href="https://github.com/Verizon/YANG-validator">
          <img src={fp2} alt='fp2'/> 
          <Title size="small">YANG Validator</Title> 
        </a> 
      </div>
      <div className="project">
        <a href="https://github.com/Verizon/YANG-transformer">
          <img src={fp3} alt='fp3'/>
          <Title size="small">YANG Transformer</Title> 
        </a> 
      </div>
  </div>
</div>
);

export default FeaturedProjects;