var React = require('react');
var $ = require ('jquery');
var Trianglify = require('Trianglify');

var HeaderContent = React.createClass({
  componentDidMount: function(){
    var header = $('#content-head')
    var pattern = new Trianglify({
      width: window.screen.width | header.outerWidth(),
      height: header.outerHeight(),
      cell_size: 40,
      seed: Math.random(),
      x_colors: 'Spectral'
    }).png()

    header.css('background-image', 'url('+pattern+')');
  },
  render: function(){
    return (
      <div id="content-head" className="content-head">
        <h1>Verizon Engineering.</h1>
        <p>Giving back to the open-source community.</p>
        <p>
          <small>
            <span className="octicon octicon-globe"></span>
            verizon.com
          </small>
        </p>
        <a className="arrow-down octicon octicon-chevron-down" href="#open-source-content"></a>
      </div>
    );
  }
});

module.exports = HeaderContent;
