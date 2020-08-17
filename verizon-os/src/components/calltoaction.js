import React from 'react';
import { Title, Body } from '@vds/typography';
import placeholder from '../images/placeholder-image.png';
import { Link } from "gatsby";

const CallToAction = () => {
  return (
    <div className="callToAction">
      <Link to='/community'><Title>How To Manage Open Source</Title></Link>
      <div className="innerCallToAction">
        <div className="action">
          <img src={placeholder} alt='placeholder'/>
          <Title>Use</Title>   
          <Body size="large" viewport="desktop" primitive="h2">our open source code</Body>
        </div>
        <div className="action">
          <img src={placeholder} alt='placeholder'/>
          <Title>Contribute</Title>
          <Body size="large" viewport="desktop" primitive="h2">our projects</Body>
        </div>
        <div className="action">
          <img src={placeholder} alt='placeholder'/>
          <Title>Join</Title>
          <Body size="large" viewport="desktop" primitive="h2">our communities</Body>
        </div>
      </div>
    </div>  
  )
};

export default CallToAction;