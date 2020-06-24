import React from 'react';

const actionList = [
      { 
        "heading": "Use",
        "url": "www.google.com",
        "text": "our open source code"
      }, 
      {
        "heading": "Contribute",
        "url": "www.google.com",
        "text": "to our projects"
      },
      {
        "heading": "Do",
        "url": "www.google.com",
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
                      <h1 className="card-header">{action.heading}</h1>
                    </a>
                    <p className="card-subtitle">{action.text}</p>
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