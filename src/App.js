import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Header from './components/header';
import Footer from './components/footer';
import HomePage from './home'; 
import ProjectsPage from './projects'; 
import OsPage from './community'; 

function App() {
  return (
    <div className="scrollContainer">
      <Router>
        <div>
          <Header/>

          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route path="/home">
              <HomePage/>
            </Route>
            <Route path="/community">
              <OsPage />
            </Route>
            <Route path ="/projects">
              <ProjectsPage/>
            </Route>
          </Switch>

          <Footer/>
        </div>
      </Router>
      </div>
  );
}

export default App;
