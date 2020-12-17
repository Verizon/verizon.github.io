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
import NotFoundPage from './404'; 
import OsPage from './community'; 

function App() {
  return (
    <div className="scrollContainer">
      <Router>
        <div>
          <Header/>

          <Switch>
            <Route exact path="/" component={HomePage}></Route>
            <Route exact path="/home" component={HomePage}></Route>
            <Route exact path="/community" component={OsPage}></Route>
            <Route exact path ="/projects" component={ProjectsPage}></Route>
            <Route component = {NotFoundPage}></Route>
          </Switch>

          <Footer/>
        </div>
      </Router>
      </div>
  );
}

export default App;
