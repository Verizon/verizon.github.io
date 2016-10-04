import React from 'react';
import ReactDOM from 'react-dom'
import {render} from 'react-dom';
import jquery from 'jquery';
import bootstrap from './packages/bootstrap.min.css';
import Moment from 'moment';
global.moment = Moment;
global.jQuery = jquery;
import OpenSourceNavbar from './js/open_source_navbar.js';
import MainNavbar from './js/main_navbar.js';
import HeaderContent from './js/header_content.js';
import OpenSourceContent from './js/open_source_content.js';

var App = React.createClass({
  render: function(){
    return (
      <div>
        <MainNavbar />
        <HeaderContent />
        <OpenSourceNavbar />
        <OpenSourceContent />
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('content'));

var call = new XMLHttpRequest();
var repos;
var divs = [];
call.open("GET", "https://api.github.com/orgs/verizon/repos",true);
call.onload = function(){
  repos = JSON.parse(call.responseText);
  console.log(repos);
  repos.forEach(function(e, i){
    var date = e.updated_at.slice(0, 10);
    divs.push(
      <div key={i} className="panel panel-default repo-unit">
        <div className="panel-heading repo-unit">
          <h3 className="repo-name">{e.name}</h3>
        </div>
        <div className="panel-body repo-unit">
          <p className="zeromargin text-left">Last Updated: {date}</p>
          <p className="text-left">Language: {e.language}</p>
          <p className="zeromargin text-left" className="repo-description">{e.description}</p>
        </div>
        <a href={e.homepage}>
          <div className="panel-footer repo-unit">
            <button className="custom-1">View</button>
          </div>
        </a>
      </div>
    );
  });
  var RepoElement = React.createClass({
    render: function(){
      return (
        <div className="content center limit-width">
          {divs}
        </div>
      );
    }
  });
  ReactDOM.render(<RepoElement />, document.getElementById("open-source-content"));
};

document.addEventListener("DOMContentLoaded", function(event){
  call.send();
});
