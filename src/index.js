import React from 'react';
import ReactDOM from 'react-dom'
import {render} from 'react-dom';
import jquery from 'jquery';
import bootstrap from './packages/bootstrap.min.css';
global.jQuery = jquery;

import OpenSourceNavbar from './js/open_source_navbar.js';
import MainNavbar from './js/main_navbar.js';
import HeaderContent from './js/header_content.js';


var App = React.createClass({
  render: function(){
    return (
      <div>
        <MainNavbar />
        <HeaderContent />
        <OpenSourceNavbar />
      </div>
    );
  }
})

ReactDOM.render(<App />, document.getElementById('content'));
