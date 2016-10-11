var React = require('react');
var library = {
  "sbt-blockade": "./img/blockade.png", "delorean": "./img/delorean.png", "knobs": "./img/knobs.png", "journal": "./img/journal.png", "remotely": "./img/remotely.png", "quiver": "./img/quiver.png"
}
var ReactDOM = require('react-dom');
// var render = require('react-dom');


function RenderRepos(){
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
        return (
          <div>
          {divs}
          </div>
        )
      }
    });
    ReactDOM.render(<RepoElement />, document.getElementById("open-source-content"));
  }
  call.send();
}

module.exports = RenderRepos;
