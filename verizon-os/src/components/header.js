import { Link } from "gatsby";
import React from "react";
import logo from "../images/vz_300_rgb_p.jpg";
import { Title, Subtitle } from '@vds/typography';

const Header = () => (
  <header>
    <div className="container">
      <div className="inner-header">
          <div className="logo">
            <img src={logo} alt="VzLogo"></img> 
          </div>
          <div className="navigation" id="myNav">
            <nav>
              <Link to="/home" activeStyle={{color: '#D52B1E'}}><Subtitle viewport="mobile" size="large" bold={true}>Home</Subtitle></Link>

              {/* Deprecating Blog Tab Until We Have A Blog Ready */}

              {/* <Link to="/blog"><Body size="large">Blog</Body></Link> */}
            
              <Link to="/projects" activeStyle={{color: '#D52B1E'}} ><Subtitle viewport="mobile" size="large" bold={true}>Projects</Subtitle></Link>
              <Link to="/community" activeStyle={{color: '#D52B1E'}} ><Subtitle viewport="mobile" size="large" bold={true}>Community</Subtitle></Link>
              <a href="https://www.verizon.com/support/residential/internet/equipment/open-source-software" target="_blank" rel="noreferrer"><Subtitle viewport="mobile" size="large" bold={true}>Attributions</Subtitle></a>
              {/* <a href="javascript:void(0);" className="icon" onClick={myFunction()}>
                <Icon name="close"></Icon>
              </a> */}
            </nav>
          </div> 
          <div className="OsText">
            <Title primitive="h4" size="medium">Open Source</Title>
          </div> 
        </div>
     </div>
  </header>
  
);

// function myFunction() {
//   var x = document.getElementById("myNav");
//   if (x.className === "navigation") {
//     x.className += " responsive";
//   } else {
//     x.className = "naviagtion";
//   }
// }

export default Header;