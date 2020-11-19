import React from "react";
import CallToAction from "../components/calltoaction";
import  "../styles/styles.scss";
import Carousel from "../components/carousel";
import Ospo from '../components/ospo'; 
import Header from '../components/header'
import Footer from '../components/footer'
import FeaturedProjects from "../components/featuredProjects";
import { Router } from 'react-router';
import history from '../components/history';

const HomePage = () => (
    <Router history={history}>
        <div className="scrollContainer">
            <Header selectedValue="Home"></Header>
            <Carousel/>
            <Ospo/>
            <FeaturedProjects/>
            <CallToAction/>
            <Footer/>
        </div>
    </Router>
    
);

export default HomePage;