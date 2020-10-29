import React, { Component} from "react";
import {DropdownSelect} from "@vds/selects"; 
import { withRouter } from "react-router"; 


const ddVals = [
  { val: 'home', name: 'Home' },
  { val: 'community', name: 'Community' },
  { val: 'projects', name: 'Projects'  },
  { val: 'attributions', name: 'Attributions' }
]

class NavSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event) {
    event.preventDefault();
    if (event.target.value !== "Attributions")
      this.props.history.push({ pathname: `/${event.target.value.charAt(0).toLowerCase() + event.target.value.slice(1)}`, state: { selectedValue: event.target.value }});
    
    else
      window.open("https://www.verizon.com/support/residential/internet/equipment/open-source-software", "_blank");
  }

  componentDidMount() {
    if(this.props.location.state){
      this.setState({selectedValue:this.props.location.state.selectedValue}); 
    }

}
  render() {
    return ( //use onChange for dropdownSelect
        <DropdownSelect onChange={(e)=> this.handleChange(e)} value={this.state.selectedValue}>  
          {ddVals.map((item, index)=> <option key={index}>{item.name}</option>)}
        </DropdownSelect>
      );
    }
  }

  export default withRouter(NavSelect); 