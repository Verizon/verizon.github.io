var React = require('react');
import RepoUnit from './repo_unit.js';

// function init(){
//   jquery.ajax({
//     url: "https://api.github.com/orgs/verizon/repos",
//     success: function(result){
//       result.forEach(function(e, i){
//
//       });
//     }
//   });
// }
// init();

var OpenSourceContent = React.createClass({
  render: function(){
    return (
      <div className="open-source-content">
        <RepoUnit />
      </div>
    );
  }
});

module.exports = OpenSourceContent;
