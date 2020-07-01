import { Link } from "gatsby"
import React from "react"
import logo from "../images/vz_150_rgb_p.jpg"
import { Title, Body } from '@vds/typography';

const Header = () => (
    <header>
        <div className="container">
            <div className="inner-header">
                <div className="logo">
                    <img src={logo} alt="VzLogo"></img>
                </div>
                <div className="title">
                    <Title size="large">Verizon Open Source</Title>
                </div>
                <div className="navigation">
                    <nav>
                        <Link to="/about"><Body size="large">Home</Body></Link>
                        <Link to="/blog"><Body size="large">Blog</Body></Link>
                        <Link to="/projects"><Body size="large">Projects</Body></Link>
                        <Link to="/attributions"><Body size="large">Attributions</Body></Link>
                    </nav>
                </div>
                
            </div>
                
        </div>

    </header>
)

export default Header