import React from 'react';
import  "../styles/styles.scss";
import { Switch, Route, Router } from 'react-router-dom';
import HomePage from '../pages/home';  
// import BlogPage from '../pages/blog'; 
import OsPage from '../pages/community';
import Header from '../components/header';
import Footer from '../components/footer';
import Projects from './projects'; 
import history from "../components/history"; 

const IndexPage = () => (
    <Router history={history}>
        <Header/>
            <Switch>
                <Route exact path="/" component={HomePage}/>
                <Route path="/home" component={HomePage} />
                {/* <Route path="/blog" component={BlogPage} /> */}
                <Route path="/projects" component={Projects} />
                <Route path="/community" component={OsPage}/>
            </Switch>
        <Footer/>
    </Router>
); 

export default IndexPage;


