import React from "react";
import { Title, Subtitle, Body } from '@vds/typography';
import { Link } from "gatsby";
import fp1 from '../images/laptop-antivirus-blk.png'; 
import fp2 from '../images/hackers-blk.png'; 
import fp3 from '../images/digital-content-blk.png'; 

const FeaturedProjects = () => (
<div className="featuredProjects">
  <div className="ftProjectsTitle">
    <Link to="/projects"><Title size="large">Featured projects</Title></Link>
  </div>
  <div className="innerFeaturedProjects">
      <div className="project">
          <img src={fp1} alt='fp1'/> 
          <Title size="medium">Caching</Title>    
          <Body>
          <ul className="list">
            <li> <a href="https://github.com/Verizon/safecache" target="_blank" rel="noreferrer"><Subtitle size="small">Safecache</Subtitle> </a></li>
          </ul>
          </Body>
      </div>
      <div className="project2">
        <img src={fp2} alt='fp2'/> 
        <Title size="medium">YANG</Title> 
        <Body>
          <ul className="list">
            <li> <a href="https://github.com/Verizon/YANG-validator" target="_blank" rel="noreferrer"><Subtitle size="small">Validator</Subtitle> </a></li>
            <li> <a href="https://github.com/Verizon/YANG-transformer" target="_blank" rel="noreferrer"><Subtitle size="small">Transformer</Subtitle> </a></li>
          </ul>
        </Body>
      </div>
      <div className="project3">
          <img src={fp3} alt='fp3'/>
          <Title size="medium">Proxychains</Title> 
          <Body>
            <ul className="list">
            <li> <a href="https://github.com/Verizon/redshell" target="_blank" rel="noreferrer"><Subtitle size="small">Redshell</Subtitle></a></li>
            </ul>
          </Body>
      </div>
  </div>
</div>
);

export default FeaturedProjects;