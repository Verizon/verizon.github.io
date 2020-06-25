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
                    <Title>Verizon Open Source</Title>
                </div>
                <div className="navigation">
                    <nav>
                        <Link to="/about"><Body>Home</Body></Link>
                        <Link to="/blog"><Body>Blog</Body></Link>
                        <Link to="/projects"><Body>Projects</Body></Link>
                        <Link to="/attributions"><Body>Attributions</Body></Link>
                    </nav>
                </div>
                
            </div>
                
        </div>

    </header>
)

export default Header