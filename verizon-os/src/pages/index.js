import React from "react";
import Header from "../components/header";
import CallToAction from "../components/calltoaction";
import  "../styles/styles.scss";
import Carousel from "../components/carousel";

const IndexPage = () => (
    <div>
        <Header/>
        <Carousel/>
        <CallToAction/> 
    </div>
)

export default IndexPage
