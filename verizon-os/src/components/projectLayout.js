import React, { Fragment } from 'react';
import styled from 'styled-components';
import { DropdownSelect } from '@vds/selects';
import { spacers } from '@vds/theme';
import { Title, Body, Micro } from '@vds/typography';
import { Button} from '@vds/buttons';
import { Tabs, Tab } from '@vds/tabs';
const projectUrl = 'https://api.github.com/orgs/Verizon/repos';

const Group = styled.div`
  margin-bottom: ${spacers.medium};
`;

class ProjectLayout extends React.Component {
  constructor() {
    super();
    this.state = {
      alphabetize: false,
      alphabetizeLabel: '(a - z)',
      sort: false,
      sortLabel: '(asc)',
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
    this.handleSubmit(event);
  }

  handleSubmit(event) {
    event.preventDefault();
    let projectsCopy = this.state.returnedProjects;
    let filteredProjects = projectsCopy.filter(project => project.language === event.target.value);
    this.setState({showProjects : filteredProjects});
  }

  showAll () {
    this.setState({
      showProjects: this.state.returnedProjects
    })
  }

  alphabetize () {
    if (!this.state.alphabetize) {
      this.alphabetizeAToZ()
      this.setState({
        alphabetize: !this.state.alphabetize,
        alphabetizeLabel: '(z - a)'
      })
      
    }
    if (this.state.alphabetize){
      this.alphabetizeZtoA()
      this.setState({
        alphabetize: !this.state.alphabetize,
        alphabetizeLabel: '(a - z)'
      })
    }
  }
  alphabetizeAToZ () {
    let projectsCopy = this.state.showProjects;
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

  alphabetizeZtoA () {
    let projectsCopy = this.state.showProjects;
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

  sortByDate () {
    if (!this.state.sort) {
      this.sortByDateAscending()
      this.setState({
        sort: !this.state.sort,
        sortLabel: '(desc)'
      })
    } else {
      this.sortByDateDescending()
      this.setState({
        sort: !this.state.sort,
        sortLabel: '(asc)'
      })
    }
  }
  sortByDateAscending () {
    let projectsCopy = this.state.showProjects;
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

  sortByDateDescending () {
    let projectsCopy = this.state.showProjects;
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
    const { showProjects, returnedProjects, alphabetizeLabel, sortLabel } = this.state; 
    const alphabetizeMenuLabel = `Alphabetize ${alphabetizeLabel}`;
    const sortDateMenuLabel = `Creation Date ${sortLabel}`; 
    const projectCodeLanguage = returnedProjects.map(project => project.language).reduce((accum, project) => {
      if (!accum.includes(project)){
        accum.push(project)
      }
      return accum;
    }, [])
    const projects = showProjects.filter(project=> project.archived === true ).map((project) => {
      const description = project.description.split(' ').filter(element => element.length < 70).join(' ').replace(/\s(?=[^\s]*$)/g, '\u00A0');
      const classes = `project-text ${project.name} ${project.language}`;
      const projectTag = `${project.language}`.toLowerCase();
      return (
      <article key={project.id}>
        <div className={classes}>
          <div className="title">
            <Title size="small">{project.name}</Title>
          </div>
          <div className="body">
            <Body>{description}</Body>
          </div>
          <div className="button" >
            <a href={project.html_url} target="_blank" rel="noreferrer">
              <Button size="small">Visit</Button>
            </a>
          </div>
          <div className="projectTag">
            <a target="_self" value={projectTag} href={projectTag} rel="noreferrer" onClick={(event)=> console.log("value", event.target.value)}>
              <Micro viewport="desktop" primitive="h2">{projectTag}</Micro>
            </a>
          </div>  
        </div>
      </article>
      )
    });

    
      return (
        <div className="projectLayout">
          <div className="projectLayoutHeading">
            <Title size="large">Verizon Open Source Projects</Title>
          </div>
          <div className="projectMenuButtons">
            <Tabs>            
              <Tab label="Show All" onClick={()=> this.showAll()} />
              <Tab label={alphabetizeMenuLabel} onClick={() => this.alphabetize()} />
              <Tab label={sortDateMenuLabel} onClick={()=> this.sortByDate()} />
            </Tabs>
            <Fragment>
              <Group>
                <DropdownSelect label="Language" width="200px" inlineLabel="true" value={this.state.value} onChange={(e)=> this.handleChange(e)}>
                  {projectCodeLanguage.map(language => <option value={language}>{language}</option>)}
                </DropdownSelect>
              </Group>
            </Fragment>
          </div>
          <div className="project-grid">{projects}</div>
        </div>
      );
    }
  }

export default ProjectLayout;

