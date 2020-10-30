import React, { Component} from "react";
import {DropdownSelect} from "@vds/selects"; 
import { withRouter } from "react-router-dom"; 
import history from "../components/history"; 


const ddVals = [
  { val: 'home', name: 'Home' },
  { val: 'community', name: 'Community' },
  { val: 'projects', name: 'Projects'  },
  { val: 'attributions', name: 'Attributions' }
]

class NavSelect extends Component {
  constructor() {
    super()
    this.state = {
      selectedValue: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event) {
    event.preventDefault();
    if (event.target.value !== "Attributions") {
      history.push({ pathname: `/${event.target.value.charAt(0).toLowerCase() + event.target.value.slice(1)}`});
      this.setState({selectedValue: event.target.value}, ()=>console.log("post history state update:   ", this.state.selectedValue));
    }
    
    else
      window.open("https://www.verizon.com/support/residential/internet/equipment/open-source-software", "_blank");
  }

  componentDidMount() {
     console.log("Did Mount"); 
     console.log("Mount Component Props:   ", this.props); 
    // if(this.props.location.state){
    //   this.setState({selectedValue:this.props.location.state.selectedValue}, ()=> console.log(this.state.selectedValue + "    updated selected state")); 
    // }

    // else  
      // this.setState({selectedValue: this.props.selectedValue}, () => console.log("update after mount:   ", this.state.selectedValue));
}

  componentDidUpdate(prevProps){
    console.log("PREV PROPS:   ", prevProps); 
    console.log("Props:   ", this.props); 
    if (this.props.selectedValue !== prevProps.selectedValue) {
      this.setState({selectedValue: this.props.selectedValue}, () => console.log("did update:   ", this.state.selectedValue)); 
    }
  }

  render() {
    console.log("selected val   " + this.state.selectedValue); 
    return ( //use onChange for dropdownSelect
      
        <DropdownSelect onChange={(e)=> this.handleChange(e)} value={this.state.selectedValue}>  
          {ddVals.map((item, index)=> <option key={index}>{item.name}</option>)}
        </DropdownSelect>
      );
    }
  }

  export default withRouter(NavSelect); 