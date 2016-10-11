var React = require('react');

var MainNavbar = React.createClass({
  toggleTalks: function(){
    document.getElementById("talks-content").classList.remove("hidden");
    document.getElementById("open-source-content").classList.add("hidden");
    document.getElementById("blogs-content").classList.add("hidden");
  },
  toggleOpenSource: function(){
    document.getElementById("talks-content").classList.add("hidden");
    document.getElementById("open-source-content").classList.remove("hidden");
    document.getElementById("blogs-content").classList.add("hidden");
  },
  toggleBlogs: function(){
    document.getElementById("talks-content").classList.add("hidden");
    document.getElementById("open-source-content").classList.add("hidden");
    document.getElementById("blogs-content").classList.remove("hidden");
  },
  render: function(){
    return (
      <div>
        <nav>
          <div className="container-fluid navigation main-navbar-content center limit-width">
            <div className="left inline">
              <div className="navbar-item"><img src="./img/vz_150_rgb_p.png" alt="not available" className="navbar-logo"/></div>
            </div>
            <div className="right inline">
              <div className="navbar-item"><p className="navbar-item-text activatable">Open Source</p></div>
              <div className="navbar-item"><p className="navbar-item-text activatable">Talks</p></div>
              <div className="navbar-item"><p className="navbar-item-text activatable">Blog</p></div>
            </div>
          </div>
        </nav>
      </div>
    );
  }
});

module.exports = MainNavbar;
