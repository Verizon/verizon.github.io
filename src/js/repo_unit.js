var React = require('react');

var RepoUnit = React.createClass({
  render: function(){
    return (
      <div className="panel panel-default repo-unit">
        <div className="panel-heading repo-unit">
          <h1>{this.props.name}</h1>
          <p>{this.props.language}</p>
        </div>

        <div className="panel-body repo-unit">
          <p>{this.props.description}</p>
        </div>

        <div className="panel-footer repo-unit">
        </div>
      </div>
    );
  }
});

module.exports = RepoUnit;
