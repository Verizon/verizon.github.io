import React from 'react';
import ReactDOM from 'react-dom'
import {render} from 'react-dom';
import jquery from 'jquery';
import bootstrap from './packages/bootstrap.min.css';
import Moment from 'moment';
import { Router, Route, Link } from 'react-router';
global.moment = Moment;
global.jQuery = jquery;
import MainNavbar from './js/main_navbar.js';
import HeaderContent from './js/header_content.js';
import RenderRepos from './js/open_source_content.js';
import RenderTalks from './js/talks_contents.js';

const App = React.createClass({
  render: function(){
    return (
      <div>
        <div id="main-head">
          <MainNavbar />
        </div>

        <div id="main-content">
          <HeaderContent />
          <div className="open-source-content" id="open-source-content"></div>
          <div className="talks-content hidden" id="talks-content"></div>
          <div className="blogs-content hidden" id="blogs-content"></div>
        </div>
      </div>
    );
  }
});
ReactDOM.render(<App />, document.getElementById('content'));

document.addEventListener("DOMContentLoaded", function(event){
  RenderRepos();
  RenderTalks();
});
