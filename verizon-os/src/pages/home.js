import React from "react";
import CallToAction from "../components/calltoaction";
import  "../styles/styles.scss";
import Carousel from "../components/carousel";
import Ospo from '../components/ospo'; 
import FeaturedProjects from "../components/featuredProjects";

const HomePage = () => (
    <div className="scrollContainer">
        <Carousel/>
        <Ospo/>
        <FeaturedProjects/>
        <CallToAction/>
    </div>
);

export default HomePage;