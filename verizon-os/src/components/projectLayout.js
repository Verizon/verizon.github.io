import React from 'react';
import { Title, Body } from '@vds/typography';

const projectUrl = 'https://api.github.com/orgs/Verizon/repos';

class ProjectLayout extends React.Component {
  constructor() {
    super();
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch(projectUrl)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    const projects = items.map(project =>(
      <article key={project.id}>
        <div className="project-text" >
          <div className="title"><Title size="small">{project.name}</Title></div>
          <div className="body"><Body>{project.description}</Body></div>
            <a href={project.html_url} target="_blank" rel="noreferrer">
              <button type="button">Visit</button>
            </a>
        </div>
      </article>
    ));
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="projectLayout">
          <div className="projectLayoutHeading">
            <Title size="large">Verizon's Open Source Projects</Title>
          </div>
          <div className="project-grid">{projects}</div>
        </div>
      );
    }
  }
}

export default ProjectLayout;
