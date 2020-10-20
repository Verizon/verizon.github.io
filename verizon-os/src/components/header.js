import { Link } from "gatsby";
import React, { Component } from "react";
import logo from "../images/vz_300_rgb_p.jpg";
import { Title, Subtitle } from '@vds/typography';
import { DropdownSelectMarketing, DropdownMarketingOption } from '@vds/selects';

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
            <NavSelect></NavSelect>
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

export class NavSelect extends Component {
  render() {
    return (
      <DropdownSelectMarketing
        placeholder="Menu"
        errorText="Please select"
        size="small"
        viewport="mobile"
        width="100px"
      >
        <DropdownMarketingOption children = {null}>
         <Link to="/home">Home</Link>
        </DropdownMarketingOption>
        <DropdownMarketingOption>
         <Link to="/projects">Projects</Link>
        </DropdownMarketingOption>
        <DropdownMarketingOption>
         <Link to="/community">Community</Link>
        </DropdownMarketingOption>
        <DropdownMarketingOption>
        <a href="https://www.verizon.com/support/residential/internet/equipment/open-source-software" target="_blank" rel="noreferrer">Attributions</a>
        </DropdownMarketingOption>
      </DropdownSelectMarketing>
    );
  }
}