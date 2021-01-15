import { Link, Redirect } from "react-router-dom";
import React, { Component } from "react";
import logo from "../images/vz_300_rgb_p.jpg";
import { Title, Subtitle } from '@vds/typography'; 
import { DropdownSelect } from '@vds/selects'; 

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

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state
    this.state = {
      selectedValue: props.selectedValue,
      redirect: null
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.target.value !== "Attributions" && event.target.value !== null) {
      //navigate('/' + event.target.value.charAt(0).toLowerCase() + event.target.value.slice(1));
      this.setState({ redirect: '/' + event.target.value.charAt(0).toLowerCase() + event.target.value.slice(1) });
    }
    else {
      if (typeof window !== `undefined`) {
        window.open("https://www.verizon.com/support/residential/internet/equipment/open-source-software", "_blank");
      }
    }
  }

  handleClick(selectedPath) {
    this.setState({selectedValue: selectedPath});
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
        <header>
            <div className="container">
              <div className="inner-header">
                  <div className="logo">
                    <Link to="/home" onClick={() => this.handleClick("Home")}><img src={logo} alt="VzLogo"></img></Link>
                  </div>
                  <div className="navigation">
                    <nav>
                      {routePaths.map((item, index) => <Link style={{ textDecoration: 'underline', textDecorationColor: 'black'}} to={item.val} key={index} onClick={(e) => this.handleClick(item.name,e)}><Subtitle viewport="mobile" size="large" bold={true}>{item.name} </Subtitle></Link> )}
                      <a href="https://www.verizon.com/support/residential/internet/equipment/open-source-software" style={{ textDecoration: 'underline', textDecorationColor: 'black'}} target="_blank" rel="noreferrer"><Subtitle viewport="mobile" size="large" bold={true}>Attributions</Subtitle></a>
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


