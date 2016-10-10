var React = require('react');
var $ = require ('jquery');
var Trianglify = require('Trianglify');

var HeaderContent = React.createClass({
  componentDidMount: function(){
    var header = $('#content-head')
    var pattern = new Trianglify({
      width: window.screen.width | header.outerWidth(),
      height: header.outerHeight()*1.2,
      cell_size: 50,
      seed: Math.random(),
      x_colors: 'Reds'
    }).png()

    header.css('background-image', 'url('+pattern+')');
  },
  render: function(){
    return (
      <div id="content-head" className="content-head">
        <h1>Hello.</h1>
      </div>
    );
  }
});

module.exports = HeaderContent;
