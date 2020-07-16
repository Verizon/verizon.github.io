import React from 'react';
import { Title, Subtitle } from '@vds/typography';

const actionList = [
  { 
    "heading": "Use",
    "url": "placeholder",
    "text": "our open source code"
  }, 
  {
    "heading": "Contribute",
    "url": "placeholder",
    "text": "to our projects"
  },
  {
    "heading": "Join",
    "url": "placeholder",
    "text" : "our communities"
  }
];

const CallToAction = () => {

  const actions = actionList.map((action, index) => {
    return   <div className="card card-center card-body" key={index}>
                <a href={action.url}>
                  <Title>{action.heading}</Title>
                </a>  
                <Subtitle>{action.text}</Subtitle>
              </div> 
  })
  return (
    <div className="row">
      {actions}
    </div>
  )
}

export default CallToAction;