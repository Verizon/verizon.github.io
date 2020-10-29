import { Link } from "gatsby";
import React from "react";
import logo from "../images/vz_300_rgb_p.jpg";
import { Title, Subtitle } from '@vds/typography';
import NavSelect from '../components/headerNav'; 
import { Router } from 'react-router-dom';
import history from '../components/history'; 


const Header = () => (
  <header>
    <div className="container">
      <div className="inner-header">
          <div className="logo">
            <Link to="/home"><img src={logo} alt="VzLogo"></img></Link>
          </div>
          <div className="navigation">
            <nav>
              <Link to="/home" activeStyle={{color: '#D52B1E'}}><Subtitle viewport="mobile" size="large" bold={true}>Home</Subtitle></Link>

              {/* Deprecating Blog Tab Until We Have A Blog Ready */}

              {/* <Link to="/blog"><Body size="large">Blog</Body></Link> */}
            
              <Link to="/projects" activeStyle={{color: '#D52B1E'}} ><Subtitle viewport="mobile" size="large" bold={true}>Projects</Subtitle></Link>
              <Link to="/community" activeStyle={{color: '#D52B1E'}} ><Subtitle viewport="mobile" size="large" bold={true}>Community</Subtitle></Link>
              <a href="https://www.verizon.com/support/residential/internet/equipment/open-source-software" target="_blank" rel="noreferrer"><Subtitle viewport="mobile" size="large" bold={true}>Attributions</Subtitle></a>
           
            </nav>
          </div> 
          <div className="navMobile">
            <Router history={history}>
              <NavSelect></NavSelect>
            </Router>
            {/* <nav>
              <Link to="/home" activeStyle={{color: '#D52B1E'}}><Subtitle viewport="mobile" size="large" bold={true}>Home</Subtitle></Link>
              <Link to="/projects" activeStyle={{color: '#D52B1E'}} ><Subtitle viewport="mobile" size="large" bold={true}>Projects</Subtitle></Link>
              <Link to="/community" activeStyle={{color: '#D52B1E'}} ><Subtitle viewport="mobile" size="large" bold={true}>Community</Subtitle></Link>
              <a href="https://www.verizon.com/support/residential/internet/equipment/open-source-software" target="_blank" rel="noreferrer"><Subtitle viewport="mobile" size="large" bold={true}>Attributions</Subtitle></a>
          
            </nav> */}
          </div> 
          <div className="OsText">
            <Title primitive="h4" viewport="mobile" size="large">Open Source</Title>
          </div> 
        </div>
     </div>
  </header>
);

export default Header;

