import React from 'react';
import { Title, Body } from '@vds/typography';
import placeholder from '../images/placeholder-image.png';

const CallToAction = () => {
  return (
    <div className="callToAction">
      <Title>How To Manage Open Source</Title>
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