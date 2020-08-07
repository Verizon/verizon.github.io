import React from "react"
import { Body } from '@vds/typography';
import { Link } from "gatsby"
// import twitterLogo from "../images/social-twitter_auxiliary.png"; 
// import fbLogo from "../images/social-facebook_auxiliary.png"; 

const Footer = () => (
    <footer>
        <div className="inner-footer">
            <div className="navigation">
                <nav>
                    <Link to="/support"><Body color="white" size="large">Support</Body></Link>
                    <Link to="/contacts"><Body color="white" size="large">Contacts</Body></Link>
                    <Link to="/brands"><Body color="white" size="large">Brands</Body></Link>
                </nav>
            </div>
            { <div className="logos">
                <Body color="white" size="small">&#169;	 2020 Verizon</Body>

                {/* Deprecating Social Media Links Until We Have Something To Link Out To  */}
                
                {/* <img src={twitterLogo} alt="twitterLogo" style={{height: '60px', weight: '60px'}}></img>
                <img src={fbLogo} alt="fbLogo" style={{height: '60px', weight: '60px'}}></img> */}
            </div> }
        </div>

    </footer>
)

export default Footer