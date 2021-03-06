import React from "react";
import { Link } from "react-router-dom";
import { Body, Micro } from '@vds/typography';

const Footer = () => (
  <footer>
    <div className="inner-footer">
      <div className="navigation">
        <nav>
          <Link to="/projects" style={{ textDecoration: 'underline', textDecorationColor: 'white' }}><Body size="large" bold={true} color="#FFFFFF">Projects</Body></Link>
          <Link to="/community" style={{ textDecoration: 'underline', textDecorationColor: 'white' }}><Body size="large" bold={true} color="#FFFFFF">Community</Body></Link>
          <a href="https://github.com/Verizon" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', textDecorationColor: 'white' }}><Body size="large" bold={true} color="#FFFFFF">Github</Body></a>
        </nav>
      </div>
       <div className="logos">
        <Micro viewport="mobile" color="#FFFFFF">&#169;	 2020 Verizon</Micro>
      </div> 
    </div>
  </footer>
)

export default Footer;