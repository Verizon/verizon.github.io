import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import ProjectLayout from '../components/projectLayout';
import { Router } from 'react-router-dom';
import history from '../components/history'; 

const Projects = () => (
  <Router history={history}>
    <div>
      <Header selectedValue={"Projects"}></Header>
      <ProjectLayout/>
      <Footer/>
    </div>
  </Router>
);

export default Projects;