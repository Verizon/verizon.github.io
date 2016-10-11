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
import OpenSourceContent from './js/open_source_content.js';
// import TalksContents from './js/talks_contents.js';
const talkLibrary = [{"name": "Large-scale Infrastructure Automation at Verizon","authorName": "Timothy Perrett, Hashiconf 2016","video": "https://www.youtube.com/watch?list=PL81sUbsFNc5bDS1lH0HPJFyBnAP8Iv4t0&params=OAFIAVgL&v=RzmpW5a1zEI&mode=NORMAL&app=desktop","slides": "http://www.slideshare.net/timperrett/largescale-infrastructure-automation-at-verizon-65797198"}, {"name": "Enterprise Algebras","authorName": "Timothy Perrett, Scala World 2016","slides": "http://www.slideshare.net/timperrett/enterprise-algebras-scala-world-2016"}, {"name": "Scaling Verizon IPTV Recommendations with Scala and Spark","authorName": "Diana Hu and Russ Horten, RecSysLSRS 2016","slides": "https://speakerdeck.com/sdianahu/scaling-verizon-iptv-recommendations-with-scala-and-spark"}, {"name": "Time Series Effects for TV Recommendations" ,"authorName": "Diana Hu and Russ Horten, RecSysTV 2016","slides": "https://speakerdeck.com/sdianahu/recsystv-2016-time-series-effects-for-tv-recommendations"}, {"name": "Roll Your Own Shapeless","authorName": "Daniel Spiewak, Scala Days Berlin 2016","video" : "https://www.youtube.com/watch?v=zKRNMyo3wzg"}, {"name": "Index Your State For Safer Functional APIs" ,"authorName": "Vincent Marquez at Lambda Conf 2016","video": "https://www.youtube.com/watch?v=eO1JLs5FR6k"}, {"name": "Constraints Liberate, Liberties Constrain","authorName": "Runar Bjarnason, Scala World 2015","video": "https://www.youtube.com/watch?v=GqmsQeSzMdw"}, {"name": "Building a Reasonable Expression DSL with Kleisli","authorName": "Ryan Delucci, Scala By the Bay 2015","video": "https://www.youtube.com/watch?v=SXmKA1rNAgk"}];

const App = React.createClass({
  render: function(){
    return (
      <div>
        <div id="main-head">
          <MainNavbar />
        </div>
        <div id="main-content">
          <HeaderContent />
          <OpenSourceContent />
        </div>
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('content'));

// const Blog = React.createClass({
//   render: function(){
//     return (
//       <div>
//       </div>
//     );
//   }
// });

const Talks = React.createClass({
  render: function(){
    return (
      <div>
      </div>
    );
  }
});

var library = {
  "sbt-blockade": "./img/blockade.png",
  "delorean": "./img/delorean.png",
  "knobs": "./img/knobs.png",
  "journal": "./img/journal.png",
  "remotely": "./img/remotely.png",
  "quiver": "./img/quiver.png"
}
var call = new XMLHttpRequest();
var repos;
var divs = [];
call.open("GET", "https://api.github.com/orgs/verizon/repos",true);
call.onload = function(){
  repos = JSON.parse(call.responseText);
  console.log(repos);
  repos.forEach(function(e, i){
    e.sortProperty = moment.utc(e.pushed_at).format("x");
  });
  repos.sort(function(a, b){
    return b.sortProperty - a.sortProperty;
  });
  repos.forEach(function(e, i){
    var date = moment.utc(e.pushed_at).fromNow();

    if(!library[e.name]){
      divs.push(
        <div key={i} className="panel panel-default repo-unit">
          <div className="panel-heading repo-unit">
            <img className="repo-avatar" src="./img/github.png" alt="Not available" />
            <h3 className="repo-name">{e.name}</h3>
          </div>
          <div className="panel-body repo-unit">
            <p className="zeromargin text-left">Last Updated: {date}</p>
            <p className="text-left repo-language">Language: {e.language}</p>
            <p className="zeromargin text-left" className="repo-description">{e.description}</p>
          </div>
          <div className="panel-footer repo-unit">
            <a href={e.homepage}>
              <div className="repo-button-container">
                <button className="custom-1">View</button>
              </div>
            </a>
          </div>
        </div>
      );
    } else {
      divs.push(
        <div key={i} className="panel panel-default repo-unit">
          <div className="panel-heading repo-unit">
            <img className="repo-avatar" src={library[e.name]} alt="Not available" />
            <h3 className="repo-name">{e.name}</h3>
          </div>
          <div className="panel-body repo-unit">
            <p className="zeromargin text-left">Last Updated: {date}</p>
            <p className="text-left repo-language">Language: {e.language}</p>
            <p className="zeromargin text-left" className="repo-description">{e.description}</p>
          </div>
          <div className="panel-footer repo-unit">
            <a href={e.homepage || e.html_url}>
              <div className="repo-button-container">
                <button className="custom-1">View</button>
              </div>
            </a>
          </div>
        </div>
      );
    }
  });
  var RepoElement = React.createClass({
    render: function(){
      var talkDivs = [];
      talkLibrary.forEach(function(e, i){
        talkDivs.push(
          <div key={i} className="content center limit-width talk-unit">
            <div className="col-md-1 col-xs-1">
              <div className="talk-button video">
                <p className="talk-video-view">Video</p>
              </div>
              <div className="talk-button slides">
                <p className="talk-slide-view">Slides</p>
              </div>
            </div>
            <div className="col-md-3 col-xs-3">
              <div className="talk-thumbnail link"></div>
            </div>
            <div className="col-md-8 col-xs-8">
              <div className="talk-title">
                <h2>{e.name}</h2>
                <h4>{e.authorName}</h4>
              </div>
            </div>
          </div>
        );
      });
      return (
        <div>
          {divs}
          {talkDivs}
        </div>
      );
    }
  });
  ReactDOM.render(<RepoElement />, document.getElementById("open-source-content"));
};


document.addEventListener("DOMContentLoaded", function(event){
  switch(location.pathname){
    case "/":
      call.send();
      break;
    case "/talks":
      console.log(library);
      break;
    case "/blog":
      console.log("blog");
      break;
    default:
      location.pathname = "/";
  }
});
