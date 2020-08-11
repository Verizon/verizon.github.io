import { Link } from "gatsby";
import React from "react";
import logo from "../images/vz_150_rgb_p.jpg";
import { Title, Body } from '@vds/typography';

const Header = () => (
    <header>
        <div className="container">
            <div className="inner-header">
                <div className="logo">
                    <img src={logo} alt="VzLogo"></img>
                </div>
                <div className="title">
                    <Title size="medium">Verizon Open Source</Title>
                </div>
                <div className="navigation">
                    <nav>
                        <Link to="/" style={{ textDecoration: 'none' }}><Body size="large">Home</Body></Link>

                        {/* Deprecating Blog Tab Until We Have A Blog Ready */}

                        {/* <Link to="/blog"><Body size="large">Blog</Body></Link> */}
                        
                        <Link to="/projects" style={{ textDecoration: 'none' }}><Body size="large">Projects</Body></Link>
                        <Link to="https://www.verizon.com/support/residential/internet/equipment/open-source-software" style={{ textDecoration: 'none' }}><Body size="large">Attributions</Body></Link>
                    </nav>
                </div>
            </div>  
        </div>
    </header>
)

export default Header;