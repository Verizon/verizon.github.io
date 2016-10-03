var React = require('react');
import RepoUnit from './repo_unit.js';

var OpenSourceContent = React.createClass({

  render: function(){
    // var repos;
    // var divs = [];
    // var call = new XMLHttpRequest();
    // call.open("GET", "https://api.github.com/orgs/verizon/repos",true);
    // call.onload = function(){
    //   repos = JSON.parse(call.responseText);
    // };
    // call.send();


    // console.log(divs);
    return (
      <div className="open-source-content" id="open-source-content">
      </div>
    );

  }
});

module.exports = OpenSourceContent;
