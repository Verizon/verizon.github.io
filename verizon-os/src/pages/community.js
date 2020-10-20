import React from "react"
import  "../styles/styles.scss";
import { Body, Title} from '@vds/typography';
import Header from '../components/header';
import Footer from '../components/footer'; 
import ospo1 from '../images/business-continuity-blk.png';

const OsPage = () => (
    <div>
        <Header/>
        <div className="ospage">
            <div className="ospoTitle">
                <img src={ospo1} alt='ospo1'/>
                <Title size="large" viewport="mobile">How We Manage Open Source</Title>
            </div>
            <div className="ospoSubtitle">
                <Title size="small" viewport="mobile">About the Verizon Media Open Source Program Office</Title>
            </div>
            <div className="ospoBody">
                <Body size="large" viewport="mobile">An open source program office (OSPO) helps developers at your company successfully use, contribute, 
                and publish open source projects. Typically OSPOs perform governance, management, support, and strategy consulting functions to 
                support your company’s open source goals. Every company is different and their OSPOs differ too. We’ve been active participants of 
                the TODO Group and have benefited greatly from (and contributed back to) the shared body of work about OSPOs. You can read more 
                about their work <a href="https://www.linuxfoundation.org/resources/open-source-guides/">if you click here</a>. </Body>
                <br></br>
                <Body size="large" viewport="mobile"> Our OSPO focuses on in the following areas:</Body>
                <ul>
                    <li><Body bold={true} size="large" viewport="mobile">Publication Review and Support</Body><Body size="large" viewport="mobile">We review projects and stage them for open source publication on a branded and managed GitHub organization.</Body></li>
                    <li><Body bold={true} size="large" viewport="mobile">License Compliance</Body><Body size="large" viewport="mobile">We run a scan process during the build process on our mobile apps and other products to help us prepare open source display credits and ensure that our apps contain exactly what we want them to contain, and nothing else.</Body></li>
                    <li><Body bold={true} size="large" viewport="mobile">Contribution Support</Body><Body size="large" viewport="mobile">We support contributions to open source projects, specifically in cases where they require a contributor license agreement to be signed or where other factors require our involvement.</Body></li>
                    <li><Body bold={true} size="large" viewport="mobile">Strategy review</Body><Body size="large" viewport="mobile">We work with our technology leadership to ensure we use, contribute to, and create open source projects in a manner that will help reduce tech-debt, improve business outcomes, and support our goals to achieve engineering excellence.</Body></li>
                </ul>
                    <Body size="large" viewport="mobile">By running an OSPO, we help our engineers focus on their engineering challenges, their sprints, and their products, while knowing that we have their back when it comes to questions about open source licenses, copyrights, and communities. This way fosters an open and collaborative working environment, just like you find in successful open source communities. We thrive on transparency and operate the program as an open source project encouraging collaboration and publishing all our work in the open. At Verizon Media, nearly all our platforms are built upon open source projects. We strive to be an open source friendly company for engineers as we believe that together we can create the future, in the open.</Body>
                <br></br>
                <br></br>

                    <Body size="large" viewport="mobile">We know that engineers love working at companies that support open source. We love working with engineers who embody open source principles in their work. Check out this site to see what we have published, how you can work with us, and maybe even work at Verizon Media. <a href="https://www.verizonmedia.com/careers/">We’re hiring.</a></Body>
                <br></br>
                <br></br>

                <Body size="large" viewport="mobile"><a href = "https://verizonmedia.github.io/oss-guide/">Verizon Media Open Source Developer Guide</a></Body>
            </div>
        </div>
        <Footer/>
    </div>
    
)

export default OsPage