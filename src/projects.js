import React from 'react';
import Header from './components/header';
import Footer from './components/footer';
import ProjectLayout from './components/projectLayout';

const ProjectsPage = () => (
    <div>
      <Header selectedValue={"Projects"}></Header>
      <ProjectLayout/>
      <Footer/>
    </div>
);

export default ProjectsPage;