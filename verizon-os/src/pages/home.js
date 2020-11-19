import React from "react";
import CallToAction from "../components/calltoaction";
import  "../styles/styles.scss";
import Carousel from "../components/carousel";
import Ospo from '../components/ospo'; 
import Header from '../components/header'
import Footer from '../components/footer'
import FeaturedProjects from "../components/featuredProjects";

const HomePage = () => (
        <div className="scrollContainer">
            <Header selectedValue="Home"></Header>
            <Carousel/>
            <Ospo/>
            <FeaturedProjects/>
            <CallToAction/>
            <Footer/>
        </div>
    
);

export default HomePage;