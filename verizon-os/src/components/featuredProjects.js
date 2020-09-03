import React from "react";
import { Title, Body } from '@vds/typography';
import { Link } from "gatsby";
import fp1 from '../images/laptop-antivirus-auxiliary.png'; 
import fp2 from '../images/hackers_auxiliary.png'; 
import fp3 from '../images/digital-content_auxiliary.png'; 

const FeaturedProjects = () => (
<div className="featuredProjects">
  <Link to="/projects"><Title>Featured Projects</Title></Link>
  <div className="innerFeaturedProjects">
      <div className="project">
          <img src={fp1} alt='fp1'/> 
          <Title size="small">Caching</Title>    
          <Body>
          <ul className="list">
            <li> <a href="https://github.com/Verizon/safecache" target="_blank" rel="noreferrer">Safecache </a></li>
          </ul>
          </Body>
      </div>
      <div className="project">
        <img src={fp2} alt='fp2'/> 
        <Title size="small">YANG</Title> 
        <Body>
          <ul className="list">
            <li> <a href="https://github.com/Verizon/YANG-validator" target="_blank" rel="noreferrer">Validator </a></li>
            <li> <a href="https://github.com/Verizon/YANG-transformer" target="_blank" rel="noreferrer">Transformer </a></li>
          </ul>
        </Body>
      </div>
      <div className="project">
          <img src={fp3} alt='fp3'/>
          <Title size="small">Proxychains</Title> 
          <Body>
            <ul className="list">
            <li> <a href="https://github.com/Verizon/redshell" target="_blank" rel="noreferrer">Redshell</a></li>
            </ul>
          </Body>
      </div>
  </div>
</div>
);

export default FeaturedProjects;