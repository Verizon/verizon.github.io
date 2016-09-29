import React from 'react';
import {render} from 'react-dom';
class test extends React.Component{
  render(){
    return <p>test</p>
  }
}

render(<test/>, document.getElementById('content'));
