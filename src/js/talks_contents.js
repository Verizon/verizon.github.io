var React = require('react');
var talksThumbnailLibrary = {
  "Large-scale Infrastructure Automation at Verizon": "./img/LSIA.png", "Enterprise Algebras": "./img/enterprise.png", "Scaling Verizon IPTV Recommendations with Scala and Spark": "./img/SVIPTVR.png", "Time Series Effects for TV Recommendations": "./img/TSEFTVR.png", "Roll Your Own Shapeless": "./img/RYOS.png", "Index Your State For Safer Functional APIs": "./img/Lambdaconf.png", "Constraints Liberate, Liberties Constrain": "./img/constraints.png", "Building a Reasonable Expression DSL with Kleisli": "./img/ScalaBTB.png"
}
const talkLibrary = [{"name": "Large-scale Infrastructure Automation at Verizon","authorName": "Timothy Perrett, Hashiconf 2016","video": "https://www.youtube.com/watch?list=PL81sUbsFNc5bDS1lH0HPJFyBnAP8Iv4t0&params=OAFIAVgL&v=RzmpW5a1zEI&mode=NORMAL&app=desktop","slides": "http://www.slideshare.net/timperrett/largescale-infrastructure-automation-at-verizon-65797198"}, {"name": "Enterprise Algebras","authorName": "Timothy Perrett, Scala World 2016","slides": "http://www.slideshare.net/timperrett/enterprise-algebras-scala-world-2016"}, {"name": "Scaling Verizon IPTV Recommendations with Scala and Spark","authorName": "Diana Hu and Russ Horten, RecSysLSRS 2016","slides": "https://speakerdeck.com/sdianahu/scaling-verizon-iptv-recommendations-with-scala-and-spark"}, {"name": "Time Series Effects for TV Recommendations" ,"authorName": "Diana Hu and Russ Horten, RecSysTV 2016","slides": "https://speakerdeck.com/sdianahu/recsystv-2016-time-series-effects-for-tv-recommendations"}, {"name": "Roll Your Own Shapeless","authorName": "Daniel Spiewak, Scala Days Berlin 2016","video" : "https://www.youtube.com/watch?v=zKRNMyo3wzg"}, {"name": "Index Your State For Safer Functional APIs" ,"authorName": "Vincent Marquez at Lambda Conf 2016","video": "https://www.youtube.com/watch?v=eO1JLs5FR6k"}, {"name": "Constraints Liberate, Liberties Constrain","authorName": "Runar Bjarnason, Scala World 2015","video": "https://www.youtube.com/watch?v=GqmsQeSzMdw"}, {"name": "Building a Reasonable Expression DSL with Kleisli","authorName": "Ryan Delucci, Scala By the Bay 2015","video": "https://www.youtube.com/watch?v=SXmKA1rNAgk"}];
var ReactDOM = require('react-dom');


function RenderTalks(){
  console.log("rendered");
  var TalkElement = React.createClass({
    render: function(){
      var talkDivs = [];
      talkLibrary.forEach(function(e, i){
        talkDivs.push(
          <div key={i} className="content center limit-width talk-unit">
            <div className="col-md-1 col-xs-1 talk-buttons">
              <a href={e.video}>
                <div className="talk-button video">
                  <p className="talk-video-view">Video</p>
                </div>
              </a>
              <a href={e.slides}>
                <div className="talk-button slides">
                  <p className="talk-slide-view">Slides</p>
                </div>
              </a>
            </div>
            <div className="col-md-3 col-xs-3">
              <img className="talk-thumbnail" src={talksThumbnailLibrary[e.name]} alt="Not available" />
            </div>
            <div className="col-md-8 col-xs-8">
              <div className="talk-title">
                <h2>{e.name}</h2>
                <h4>{e.authorName}</h4>
              </div>
            </div>
          </div>
        );
      });
      return (
        <div>
          {talkDivs}
        </div>
      )
    }
  });
  ReactDOM.render(<TalkElement />, document.getElementById("talks-content"));
}

module.exports = RenderTalks
