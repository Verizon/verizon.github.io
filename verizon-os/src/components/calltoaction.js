import React from 'react';
import { Title, Micro } from '@vds/typography';

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

  const actions = actionList.map((action) => {
    return  <section className="card">
              <article className="card-center">
                <div className="card-body">
                  <a href={action.url}>
                    <Title>{action.heading}</Title>
                  </a>
                  <p>
                    <Micro>{action.text}</Micro>
                  </p>
                </div>
              </article>
            </section>            
  })
  return (
      <div className="row">
        {actions}
      </div>
  )
}

export default CallToAction;