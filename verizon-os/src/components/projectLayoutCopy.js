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
    this.handleClick = this.handleClick.bind(this)
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

  handleClick (param, e) {
    e.preventDefault();
    console.log("here", param, e)
    this.filterSelection(param)
  }

  w3AddClass(element, newDiv) {
    let arrOfSplitDivs = element.className.split(" ");
    console.log("w3AddClass", "arrOfSplitDivs", arrOfSplitDivs);
    let arrOfNewDiv = newDiv.split(" ");
    console.log("w3AddClass", "arrOfNewDiv", arrOfNewDiv)
    for (let i = 0; i < arrOfNewDiv.length; i++) {
      if (arrOfSplitDivs.indexOf(arrOfNewDiv[i]) === -1) {
        element.className += " " + arrOfNewDiv[i];
      }
    }
  }

  w3RemoveClass(element, newDiv) {
    let arrOfSplitDivs = element.className.split(" ");
    //console.log("w3RemoveClass", "arrOfSplitDivs", arrOfSplitDivs) //w3RemoveClass arrOfSplitDivs (3) ["project-text", "filterDiv", "nelson"]
    let arrOfNewDiv = newDiv.split(" ");
    //console.log("w3RemoveClass", "arrOfNewDiv", arrOfNewDiv) //w3RemoveClass arrOfNewDiv ["show"]
    for (let i = 0; i < arrOfNewDiv.length; i++) {
      while (arrOfSplitDivs.indexOf(arrOfNewDiv[i]) > -1) {
        arrOfSplitDivs.splice(arrOfSplitDivs.indexOf(arrOfNewDiv[i]), 1);
      }
    }
    element.className = arrOfSplitDivs.join(" ");
  }

  filterSelection(classNameTarget) {
    //console.log("filterSelection", "classNameTarget", classNameTarget); // filterSelection classNameTarget remotely
    let arrOfDivStrings = document.getElementsByClassName("filterDiv");
    //console.log("filterSelection", "arrOfDivStrings", arrOfDivStrings); //[div.project-text.filterDiv.remotely.show, div.project-text.filterDiv.remotely.show...]
    if (classNameTarget === "all") classNameTarget = "";
    for (let i = 0; i < arrOfDivStrings.length; i++) {
      this.w3RemoveClass(arrOfDivStrings[i], "show");
      if (arrOfDivStrings[i].className.indexOf(classNameTarget) > -1) this.w3AddClass(arrOfDivStrings[i], "show");
    }
    this.setState()
  }

  render() {
    const { error, isLoaded, items } = this.state; 
    const projects = items.filter(project=> project.archived === true ).map(function (project){
      const classes = `project-text filterDiv ${project.name}`;
      return (
      <article key={project.id}>
        <div className={classes}>
          <div className="title"><Title size="small">{project.name}</Title></div>
          <div className="body"><Body>{project.description}</Body></div>
            <a href={project.html_url} target="_blank" rel="noreferrer">
              <button type="button">Visit</button>
            </a>
        </div>
      </article>
      )
    });
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
          <div>
            <button className="btn active" onClick={(e) => this.handleClick('all', e)}> Show all</button>
            <button className="btn active" onClick={(e)=> this.handleClick("remotely", e)}> Show remotely</button>
          </div>
          <div className="project-grid">{projects}</div>
        </div>
      );
    }
  }
}

export default ProjectLayout;
