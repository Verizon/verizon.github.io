import React, { Component } from "react";
import {DropdownSelect} from "@vds/selects"; 
import history from './history'; 

class NavSelect extends Component {
    ddVal = ""; 
  
    _onChange = (e) => {
        console.log(e.target); 
      let val = e.target.value; 
      console.log("val  " + val); 
      switch(val) {
        case 'Home':
            history.push("/home");
            console.log("push home");
            this.ddVal="Home";
            break; 
  
        case 'Projects':
            history.push("/projects"); 
            console.log("push projects");
            this.ddVal="Projects";
            break; 
  
        case 'Community': 
            history.push("/community");
            console.log("push community");
            this.ddVal="Community";
            break; 

        case 'Attributions':
            // window.open("https://www.verizon.com/support/residential/internet/equipment/open-source-software", "_blank");
            break; 
  
        default: 
            console.log("I MADE IT HERE")
            break;  
      }
    }
  
    render() {
      return ( //use onChange for dropdownSelect
          <DropdownSelect value = {this.ddVal} onChange={this._onChange}  >
            <option>Home</option>
            <option>Community</option>
            <option>Projects</option>
            <option>Attributions</option>
          </DropdownSelect>
        );
    }
  }

  export default NavSelect; 