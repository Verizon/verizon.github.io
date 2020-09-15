import React from 'react';
import { Title, Body } from '@vds/typography';

const projectUrl = 'https://api.github.com/orgs/Verizon/repos';

class ProjectLayout extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      showProjects: [],
      returnedProjects: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch(projectUrl)
      .then(response => response.json())
      .then(
        (result) => {
          this.setState({
            showProjects: result,
            returnedProjects: result
          });
        }
      )
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    let projectsCopy = this.state.returnedProjects;
    let filteredProjects = projectsCopy.filter(project => project.language === this.state.value);
    this.setState({showProjects : filteredProjects});
  }

  showAll (e) {
    this.setState({
      showProjects: this.state.returnedProjects
    })
  }

  alphabetizeAToZ (e) {
    let projectsCopy = this.state.returnedProjects;
    let alphabetizedItems = projectsCopy.sort(function(a, b) {
      var projectA = a.name.toUpperCase();
      var projectB = b.name.toUpperCase(); 
      if (projectA < projectB) {
        return -1;
      }
      if (projectA > projectB) {
        return 1;
      }
      return 0;
    });
    this.setState({
      showProjects : alphabetizedItems
    })
  }

  alphabetizeZtoA (e) {
    let projectsCopy = this.state.returnedProjects;
    let alphabetizedItems = projectsCopy.sort(function(a, b) {
      let projectA = a.name.toUpperCase();
      let projectB = b.name.toUpperCase(); 
      if (projectA > projectB) {
        return -1;
      }
      if (projectA < projectB) {
        return 1;
      }
      return 0;
    });
    this.setState({
      showProjects : alphabetizedItems
    })
  }

  sortByDateAscending (e) {
    let projectsCopy = this.state.returnedProjects;
    let ascendingDates = projectsCopy.sort(function (a, b) {
      let projectA = a.created_at;
      let projectB = b.created_at;
      if (projectA < projectB) {
        return -1;
      }
      if (projectA > projectB) {
        return 1;
      }
      return 0;
    });
    this.setState({
      showProjects: ascendingDates
    })
  }

  sortByDateDescending (e) {
    let projectsCopy = this.state.returnedProjects;
    let descendingDates = projectsCopy.sort(function (a, b) {
      let projectA = a.created_at;
      let projectB = b.created_at;
      if (projectA > projectB) {
        return -1;
      }
      if (projectA < projectB) {
        return 1;
      }
      return 0;
    });
    this.setState({
      showProjects: descendingDates
    })
  }

 
  render() {
    const { showProjects, returnedProjects } = this.state; 

    const projectCodeLanguage = returnedProjects.map(project => project.language).reduce((accum, project) => {
      if (!accum.includes(project)){
        accum.push(project)
      }
      return accum;
    }, [])


    const projects = showProjects.filter(project=> project.archived === true ).map(function (project){
      const classes = `project-text filterDiv ${project.name} ${project.language}`;
      const projectTag = `#${project.language}`.toLowerCase();
      return (
      <article key={project.id}>
        <div className={classes}>
          <div className="title"><Title size="small">{project.name}</Title></div>
          <div className="body"><Body>{project.description}</Body></div>
            <a href={project.html_url} target="_blank" rel="noreferrer">
              <button type="button">Visit</button>
            </a>
            <div>
              <a target="_self" href="" rel="noreferrer">{projectTag}</a>
            </div>  
        </div>
      </article>
      )
    });
      return (
        <div className="projectLayout">
          <div className="projectLayoutHeading">
            <Title size="large">Verizon's Open Source Projects</Title>
          </div>
          <div>
            <button className="btn active" onClick={(e) => this.showAll(e)}> Show all</button>
            <button className="btn active" onClick={(e) => this.alphabetizeAToZ(e)}>Alphabetize a - z</button>
            <button className="btn active" onClick={(e) => this.alphabetizeZtoA(e)}> Alphabetize z - a</button>
            <button className="btn active" onClick={(e)=> this.sortByDateAscending(e)}> Creation Date (ascending)</button>
            <button className="btn active" onClick={(e)=> this.sortByDateDescending(e)}> Creation Date (descending)</button>
            <form onSubmit={this.handleSubmit}>
              <label>
                Sort by Language:
                <select value={this.state.value} onChange={this.handleChange}>
                  <optgroup label="language">
                    {projectCodeLanguage.map(language => <option value={language}>{language}</option>)}
                  </optgroup>                  
                </select>
              </label>
              <input type="submit" value="Submit"/>
            </form>
          </div>
          <div className="project-grid">{projects}</div>
        </div>
      );
    }
  }

export default ProjectLayout;
