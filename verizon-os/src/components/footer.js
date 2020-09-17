import React from "react";
import { Body } from '@vds/typography';
import { Link } from "gatsby";
// import twitterLogo from "../images/social-twitter_auxiliary.png"; 
// import fbLogo from "../images/social-facebook_auxiliary.png"; 

const Footer = () => (
  <footer>
    <div className="inner-footer">
      <div className="navigation">
        <nav>
          <Link to="/projects" style={{ textDecoration: 'none' }}><Body size="medium" bold={true} color="white">Projects</Body></Link>
          <Link to="/community" style={{ textDecoration: 'none' }}><Body size="medium" bold={true} color="white">Community</Body></Link>
          <Link to="https://github.com/Verizon" style={{ textDecoration: 'none' }}><Body size="medium" bold={true} color="white">Github</Body></Link>

        </nav>
      </div>
      { <div className="logos">
          <Body size="small" color="white">&#169;	 2020 Verizon</Body>

          {/* Deprecating Social Media Links Until We Have Something To Link Out To  */}
          
          {/* <img src={twitterLogo} alt="twitterLogo" style={{height: '60px', weight: '60px'}}></img>
          <img src={fbLogo} alt="fbLogo" style={{height: '60px', weight: '60px'}}></img> */}
      </div> }
    </div>
  </footer>
)

export default Footer;