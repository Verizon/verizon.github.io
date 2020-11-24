import React, {Component} from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import CallToAction from "../components/calltoaction";
import Carousel from "../components/carousel";
import Ospo from '../components/ospo'; 
import FeaturedProjects from "../components/featuredProjects";

export default class IndexPage extends Component {
    render(){
        return (
            <div className="scrollContainer">
                <Header/>
                <Carousel/>
                <Ospo/>
                <FeaturedProjects/>
                <CallToAction/>
                <Footer/>
            </div>
        ); 
    }
}



