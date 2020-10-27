import React, { Component } from "react";
import {DropdownSelect} from "@vds/selects"; 
import history from './history'; 

class NavSelect extends Component {
  
    handleChange = e => {
      let val = e.target.value; 
      history.push(`/${val}`); 
    }
  
    render() {
      return ( //use onChange for dropdownSelect
          <DropdownSelect onChange={this.handleChange}  >
            <option >Home</option>
            <option >Community</option>
            <option >Projects</option>
            <option>Attributions</option>
          </DropdownSelect>
        );
    }
  }

  export default NavSelect; 