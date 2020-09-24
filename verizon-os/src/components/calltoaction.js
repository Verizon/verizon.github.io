import React from 'react';
import { Title, Body } from '@vds/typography';
import { Link } from "gatsby";
import community from '../images/smart-communities-blk.png'; 
import use from '../images/display-blk.png'; 
import contribute from '../images/grid-view-blk.png'; 

const CallToAction = () => {
  return (
    <div className="callToAction">
      <Title>How We Manage Open Source</Title>
      <div className="innerCallToAction">
        <div className="action1">
          <img src={use} alt='use'/>
          <div className="text1">
          <Link to="https://github.com/Verizon" target="_blank" rel="noreferrer"><Title>Use</Title></Link>
            <Body size="large" viewport="desktop" primitive="h2">our open source code</Body>
          </div>
        </div>
        <div className="action2">
          <img src={contribute} alt='contribute'/>
          <div className="text2">
          <Link to='/projects'><Title>Contribute</Title></Link>
            <Body size="large" viewport="desktop" primitive="h2">our projects</Body>
          </div>
        </div>
        <div className="action3">
          <img src={ community } alt='community'/>
          <div className="text3">
          <Link to='/community'><Title>Join</Title></Link>
            <Body size="large" viewport="desktop" primitive="h2">our communities</Body>
          </div>
        </div>
      </div>
    </div>  
  )
};

export default CallToAction;