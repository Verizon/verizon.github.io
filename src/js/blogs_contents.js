var React = require('react');
var ReactDOM = require('react-dom');
var blogLibrary = [{"title": "Lorem ipsum hodor", "author": "lorem ipsum", "content": "Lorem ipsum hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor"}, {"title": "Lorem ipsum hodor", "author": "lorem ipsum", "content": "Lorem ipsum hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor"}, {"title": "Lorem ipsum hodor", "author": "lorem ipsum", "content": "Lorem ipsum hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor hodor"}];

function RenderBlogs(){
  var BlogElement = React.createClass({
    render: function(){
      var blogDivs = [];
      blogLibrary.forEach(function(e, i){
        blogDivs.push(
          <div key={i} className="content center limit-width blog-unit">
            
          </div>
        );
      });
      return (
        <div>
          {blogDivs}
        </div>
      )
    }
  });
  ReactDOM.render(<BlogElement />, document.getElementById("blogs-content"));
}

module.exports = RenderBlogs;
