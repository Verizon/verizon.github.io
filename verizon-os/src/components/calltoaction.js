import React from 'react';
import { Link } from "gatsby";
import community from '../images/unified-comms-blk.png'; 
import use from '../images/display-blk.png'; 
import contribute from '../images/grid-view-blk.png'; 

const Title = typeof window !== 'undefined' && require('@vds/typography').Title;
const Subtitle = typeof window !== 'undefined' && require('@vds/typography').Subtitle;

const CallToAction = () => {
  return (
    <div className="callToAction">
      <div className="manageOsText">
        <Title size="large">How we manage open source</Title>
      </div>
      <div className="innerCallToAction">
        <div className="action1">
          <img src={use} alt='use'/>
          <a href="https://github.com/Verizon" target="_blank" rel="noreferrer"><Title viewport="mobile" size="large">Use</Title></a>
            <Subtitle size="large" viewport="mobile" primitive="h2">our code</Subtitle>
        </div>
        <div className="action2">
          <img src={contribute} alt='contribute'/>
          <Link to='/projects'><Title viewport="mobile" size="large">Contribute</Title></Link>
          <Subtitle size="large" viewport="mobile" primitive="h2">to our projects</Subtitle>
        </div>
        <div className="action3">
          <img src={ community } alt='community'/>
          <Link to='/community'><Title viewport="mobile" size="large">Join</Title></Link>
          <Subtitle size="large" viewport="mobile" primitive="h2"> us today</Subtitle>
        </div>
      </div>
    </div>  
  )
};

export default CallToAction;