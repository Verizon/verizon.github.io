import React from "react";
import Header from "../components/header";
import CallToAction from "../components/calltoaction";
import  "../styles/styles.scss";
import Carousel from "../components/carousel";
import Footer from "../components/footer"

const IndexPage = () => (
    <div>
        <Header/>
        <Carousel/>
        <CallToAction/> 
        <Footer/>
    </div>
)

export default IndexPage
