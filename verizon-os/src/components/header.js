import { Link } from "gatsby";
import React from "react";
import logo from "../images/vz_300_rgb_p.jpg";
import { Title, Body } from '@vds/typography';

const Header = () => (
  <header>
    <div className="container">
      <div className="inner-header">
        <div className="logo">
          <img src={logo} alt="VzLogo"></img> 
        </div>
        <div className="OsText">
          <Title size="large">Open Source</Title>
        </div>
        <div className="navigation">
          <nav>
            <Link to="/home" activeStyle={{color: '#D52B1E'}}><Body size="medium" bold={true}>Home</Body></Link>

            {/* Deprecating Blog Tab Until We Have A Blog Ready */}

            {/* <Link to="/blog"><Body size="large">Blog</Body></Link> */}
            
            <Link to="/projects" activeStyle={{color: '#D52B1E'}} ><Body size="medium" bold={true}>Projects</Body></Link>
            <Link to="/community" activeStyle={{color: '#D52B1E'}} ><Body size="medium" bold={true}>Community</Body></Link>
            <a href="https://www.verizon.com/support/residential/internet/equipment/open-source-software" target="_blank" rel="noreferrer"><Body size="medium" bold={true}>Attributions</Body></a>
          </nav>
        </div>
      </div>  
    </div>
  </header>
);

export default Header;