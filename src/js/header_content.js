var React = require('react');
var $ = require ('jquery');
var Trianglify = require('Trianglify');
var Scroll = require('react-scroll');
var scroller = Scroll.scroller;

var HeaderContent = React.createClass({
  componentDidMount: function(){
    var header = $('#content-head')
    var pattern = new Trianglify({
      width: window.screen.width | header.outerWidth(),
      height: header.outerHeight()*1.1,
      cell_size: 40,
      seed: Math.random(),
      x_colors: 'Spectral'
    }).png()

    header.css('background-image', 'url('+pattern+')');
    header.css('background-repeat', 'no-repeat');
  },
  scrollToProjects: function() {
    scroller.scrollTo('open-source-content', {
      duration: 1500,
      delay: 100,
      smooth: true,
    })
  },
  render: function(){
    return (
      <div id="content-head" className="content-head">

        <div className="row">
          <h1>Free. Creative. Open.</h1>
        </div>
        <div className="row">
          <div className="col-md-12 subheading">
            <p>giving back to the open-source community</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <p>
              <a target="_blank" href="https://github.com/verizon" className="linky"><span className="octicon octicon-mark-github"></span> github</a>
              <a target="_blank" href="https://twitter.com/verizon" className="linky"><span className="octicon octicon-broadcast"></span> twitter</a>
              <a href="mailto:code@verizon.com" className="linky"><span className="octicon octicon-mail"></span> contact</a>
            </p>
          </div>
        </div>
        <a className="arrow-down octicon octicon-chevron-down"
           href="#"
           onClick={this.scrollToProjects}></a>
      </div>
    );
  }
});

module.exports = HeaderContent;
