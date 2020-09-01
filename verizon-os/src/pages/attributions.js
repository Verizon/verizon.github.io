import React from "react";
import Iframe from 'react-iframe';
import  "../styles/styles.scss";
import Header from "../components/header";
import Footer from "../components/footer"; 

const Attributions = () => (
    <div className="attributionsPage">
        <Header />
            <Iframe url="https://www.verizon.com/support/residential/internet/equipment/open-source-software"/>
        <Footer/>
    </div>
)

export default Attributions;