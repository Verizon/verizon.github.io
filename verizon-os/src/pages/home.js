import React from "react"
import CallToAction from "../components/calltoaction";
import  "../styles/styles.scss";
import Carousel from "../components/carousel";
import Ospo from '../components/ospo'; 

const HomePage = () => (
    <div className="scrollContainer">
        <Carousel/>
        <CallToAction/>
        <Ospo/>
    </div>
)

export default HomePage