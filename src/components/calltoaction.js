import React from 'react';
import { Link } from "gatsby"; // TODO: gatsby link
import community from '../images/unified-comms-blk.png'; 
import use from '../images/display-blk.png'; 
import contribute from '../images/grid-view-blk.png'; 

/*
  likely will reimplement this whole thing
  This is a bit of a mess layout wise and style wise.
*/

const CallToAction = () => {
  return (
    <div className="callToAction">
      <div className="manageOsText">
      <h2>How we manage open source</h2>
      </div>
      <div className="innerCallToAction">
        <div className="action1">
          <img src={use} alt='use'/>
          <a href="https://github.com/Verizon" target="_blank" rel="noreferrer">
            <h2>Use</h2>
          </a>
          <h3 size="large" viewport="mobile" primitive="h2">our code</h3>
        </div>
        <div className="action2">
          <img src={contribute} alt='contribute'/>
          <Link to='/projects'>
            <h3>Contribute</h3>
          </Link>
          <h3 size="large" viewport="mobile" primitive="h2">to our projects</h3>
        </div>
        <div className="action3">
          <img src={ community } alt='community'/>
          <Link to='/community'>
            <h3>Join</h3>
          </Link>
          <h3 size="large" viewport="mobile" primitive="h2">us today</h3>
        </div>
      </div>
    </div>  
  )
};

export default CallToAction;