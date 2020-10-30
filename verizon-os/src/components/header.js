import { Link } from "gatsby";
import React, { Component } from "react";
import logo from "../images/vz_300_rgb_p.jpg";
import { Title, Subtitle } from '@vds/typography';
import NavSelect from '../components/headerNav'; 
import { Router } from 'react-router-dom';
import history from '../components/history'; 


const routePaths = [
  { val: '/home', name: 'Home' },
  { val: '/community', name: 'Community' },
  { val: '/projects', name: 'Projects'  }
]

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: '',
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(selectedPath, event, pathname) {
    event.preventDefault(); 
    //history.push(pathname); 
    console.log("IM HERE!!!    ", selectedPath ); 
    this.setState({selectedValue: selectedPath}, () => console.log("handle Click HEADER sel value:  ", this.state.selectedValue)); 
    console.log("NOW IM HERE!!!" ); 
  }

  render() {
    return (
        <header>
          <div className="container">
            <div className="inner-header">
                <div className="logo">
                  <Link to="/"><img src={logo} alt="VzLogo"></img></Link>
                </div>
                <div className="navigation">
                  <nav>
                    {routePaths.map((item, index) => <Link to={item.val} key={index} onClick={(e) => this.handleClick(item.name,e, item.val)}><Subtitle viewport="mobile" size="large" bold={true}>{item.name}</Subtitle></Link> )}
                    <a href="https://www.verizon.com/support/residential/internet/equipment/open-source-software" target="_blank" rel="noreferrer"><Subtitle viewport="mobile" size="large" bold={true}>Attributions</Subtitle></a>
                  </nav>
                </div> 
                <div className="navMobile">
                  <Router history={history}>
                    <NavSelect selectedValue={this.state.selectedValue}></NavSelect>
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
    }
  }

export default Header;

