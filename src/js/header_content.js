var React = require('react');
// var $ = require ('jquery');
// var Trianglify = require('Trianglify');

var HeaderContent = React.createClass({
  componentDidMount: function(){
    // var header = $('#content-head')
    // var pattern = new Trianglify({
    //   width: window.screen.width | header.outerWidth(),
    //   height: header.outerHeight(),
    //   cell_size: 40,
    //   seed: Math.random(),
    //   x_colors: [ "#4B3434", "#4C4C4E", "#98999B", "#F0F0F0", "#98999B","#4C4C4E","#4B3434" ]
    // }).png()

    // header.css('background-image', 'url('+pattern+')');
  },
  render: function(){
    return (
      <div id="content-head" className="content-head">
        <h1>Verizon Engineering.</h1>
        <p>Giving back to the open-source community.</p>
        <p>
          <a href="#"><img src="https://img.shields.io/github/stars/badges/shields.svg?style=social&label=Star" /></a>
        </p>
      </div>
    );
  }
});

module.exports = HeaderContent;
