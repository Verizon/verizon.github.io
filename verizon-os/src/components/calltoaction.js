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

  const actions = actionList.map((action, ind) => {
    return  <div className="col-xs" key={ind}>
              <section className="c-card card-container">
                <article className="card-center">
                  <div className="card-body">
                    <a href={action.url}>
                      <Title>{action.heading}</Title>
                    </a>
                    <p className="card-subtitle">
                      <Micro>{action.text}</Micro>
                    </p>
                  </div>
                </article>
              </section>
            </div>        
  })

  return (
      <div className="row">
        {actions}
      </div>
  )
}

export default CallToAction;