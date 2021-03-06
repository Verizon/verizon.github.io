import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import { Title, Body, Micro} from '@vds/typography'; 
import { Button } from '@vds/buttons'; 
import { spacers } from '@vds/theme'; 
import { DropdownSelect } from '@vds/selects';
import { Tab, Tabs } from '@vds/tabs'; 
import { Redirect } from "react-router-dom";

const projectUrl = 'https://api.github.com/orgs/Verizon/repos?page=1&per_page=100';

const Group = styled.div`
  margin-bottom: ${typeof window !== 'undefined' && spacers.medium};
`;

export default class ProjectLayout extends Component {
  _isMounted = false; 

  constructor() {
    super();
    this.state = {
      alphabetize: false,
      alphabetizeLabel: '(a - z)',
      sort: false,
      sortLabel: '(asc)',
      value: '',
      showProjects: [],
      returnedProjects: [],
      redirect: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    this._isMounted = true; 
    const fetchMembers = await fetch (projectUrl, {
      method: 'GET',
      // headers: {
      //     'PRIVATE-TOKEN': process.env.PRIVATE_TOKEN
      // }
    });
    const headers = await fetchMembers.headers;
    const xRateLimit = Number(headers.get('x-ratelimit-remaining'));
    console.log(xRateLimit);
    if (xRateLimit < 2 && this._isMounted) {
      this.setState({ redirect: "/home" });
      if (typeof window !== `undefined`) {
               window.open("https://github.com/Verizon", "_blank");
      } 
    }

    const projectMembers = await fetchMembers.json();
    if (this._isMounted) {
      this.setState({
        showProjects: projectMembers,
        returnedProjects: projectMembers
      });
    }
  }

  // componentDidMount() {
  //   fetch(projectUrl, {
  //     method: 'GET',
  //     // headers: {
  //     //   'Authorization': `token ${process.env.ACCESS_TOKEN}`
  //     // }
  //   })
  //   .then(response => response.json())
  //   .then(
  //     (result) => {
  //       // navigate("/home", { replace: true }); 
  //       // if (typeof window !== `undefined`) {
  //       //   window.open("https://github.com/Verizon", "_blank");
  //       // }
  //       this.setState({
  //         showProjects: result,
  //         returnedProjects: result
  //       });
  //     }
  //   ).catch(e => {
  //     navigate("/home", { replace: true });
  //     if (typeof window !== `undefined`) {
  //       window.open("https://github.com/Verizon", "_blank");
  //     }
  //   });
  // }

  componentWillUnmount() {
    this._isMounted = false;
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
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { showProjects, returnedProjects, alphabetizeLabel, sortLabel } = this.state; 
    const alphabetizeMenuLabel = `Alphabetize ${alphabetizeLabel}`;
    const sortDateMenuLabel = `Creation Date ${sortLabel}`; 
    const projectCodeLanguage = returnedProjects.map(project => project.language).reduce((accum, project) => {
      if (!accum.includes(project)){
        accum.push(project)
      }
      return accum;
    }, []);
    const projects = showProjects.filter( project => project.archived === false ).map(function(project) {
    const description = project.description ? project.description.split(' ').slice(0,10).filter( element => element.length < 70 ).join(" ").replace(/\s(?=[^\s]*$)/g, '\u00A0') : "";
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
