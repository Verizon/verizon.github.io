import React, { Fragment } from 'react';
import styled from 'styled-components';
const projectUrl = 'https://api.github.com/orgs/Verizon/repos';

const Title = typeof window !== 'undefined' && require('@vds/typography').Title;
const Body = typeof window !== 'undefined' && require('@vds/typography').Body;
const Micro = typeof window !== 'undefined' && require('@vds/typography').Micro;
const Button = typeof window !== 'undefined' && require('@vds/buttons').Button;
const spacers = typeof window !== 'undefined' && require('@vds/theme').spacers;
const DropdownSelect = typeof window !== 'undefined' && require('@vds/selects').DropdownSelect;
const Tabs = typeof window !== 'undefined' && require('@vds/tabs').Tabs;
const Tab = typeof window !== 'undefined' && require('@vds/tabs').Tab;

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
    fetch(projectUrl, {
      method: 'GET',
      headers: {
        'Authorization': `token ${process.env.GATSBY_OAUTH_TOKEN}`
      }
    })
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
    }, []);
    const projects = showProjects.filter( project => project.archived === true ).map(function(project) {
      const description = project.description.split(' ').slice(0,10).filter( element => element.length < 70 ).join(" ").replace(/\s(?=[^\s]*$)/g, '\u00A0');
      const projectTag = `${project.language}`.toLowerCase();
      return (
        <article key={project.id}>
          <div className="project-card-text">
            <div className="project-card-title">
              <Title size="small">{project.name}</Title>
            </div>
            <div className="project-card-body">
              <Body>{description}</Body>
            </div>
          </div>
          <div className="project-card-button" >
            <a href={project.html_url} target="_blank" rel="noreferrer">
              <Button size="small">Visit</Button>
            </a>
          </div>
          <div className="project-card-tag">
            <a target="_self" value={projectTag} href={projectTag} rel="noreferrer" onClick={(event)=> console.log("value", event.target.value)}>
              <Micro viewport="desktop" primitive="h2">{projectTag}</Micro>
            </a>
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
              <DropdownSelect label="Language" width="200px" inlineLabel={true} value={this.state.value} onChange={(e)=> this.handleChange(e)}>
                {projectCodeLanguage.map((language, index )=> <option key={index} value={language}>{language}</option>)}
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

