import { Link } from "gatsby";
import React, { Component } from "react";
import logo from "../images/vz_300_rgb_p.jpg";
import { Title, Subtitle } from '@vds/typography';
import {DropdownSelect} from "@vds/selects"; 
import history from "../components/history"; 

const ddVals = [
  { val: 'home', name: 'Home' },
  { val: 'community', name: 'Community' },
  { val: 'projects', name: 'Projects'  },
  { val: 'attributions', name: 'Attributions' }
]

const routePaths = [
  { val: '/home', name: 'Home' },
  { val: '/community', name: 'Community' },
  { val: '/projects', name: 'Projects'  }
]

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: this.props.selectedValue,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.target.value !== "Attributions") {
      history.push("/" + event.target.value.charAt(0).toLowerCase() + event.target.value.slice(1));
      //this.setState({selectedValue: event.target.value}, ()=>console.log("handle change (dropdown) state update:   ", this.state.selectedValue));
    }
    
    else
      window.open("https://www.verizon.com/support/residential/internet/equipment/open-source-software", "_blank");
  }

  handleClick(selectedPath, event) {
    this.setState({selectedValue: selectedPath});
  }

  render() {
    return (
        <header>
            <div className="container">
              <div className="inner-header">
                  <div className="logo">
                    <Link to="/home" onClick={(e) => this.handleClick("Home",e)}><img src={logo} alt="VzLogo"></img></Link>
                  </div>
                  <div className="navigation">
                    <nav>
                      {routePaths.map((item, index) => <Link to={item.val} key={index} onClick={(e) => this.handleClick(item.name,e)}><Subtitle viewport="mobile" size="large" bold={true}>{item.name}</Subtitle></Link> )}
                      <a href="https://www.verizon.com/support/residential/internet/equipment/open-source-software" target="_blank" rel="noreferrer"><Subtitle viewport="mobile" size="large" bold={true}>Attributions</Subtitle></a>
                    </nav>
                  </div> 
                  <div className="navMobile">
                      <DropdownSelect onChange={(e)=> this.handleChange(e)} value={this.state.selectedValue}>  
                        {ddVals.map((item, index)=> <option key={index}>{item.name}</option>)}
                      </DropdownSelect>
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

