import React from 'react';
import ReactDOM from 'react-dom'
import {render} from 'react-dom';
import jquery from 'jquery';
import bootstrap from './packages/bootstrap.min.css';
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
    divs.push(
      <div key={i} className="panel panel-default repo-unit">
        <div className="panel-heading repo-unit">
          <a href={e.homepage}>
            <h2>{e.name}</h2>
          </a>
        </div>
        <div className="panel-body repo-unit">
          <p>{e.description}</p>
        </div>
        <div className="panel-footer repo-unit">
        </div>
      </div>
    );
  });
  console.log(divs);
  var RepoElement = React.createClass({
    render: function(){
      return (
        <div className="content">
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
