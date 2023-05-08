import React from "react";
import Header from '../components/header';
import Footer from '../components/footer'; 
import ospo1 from '../images/business-continuity-blk.png';


const community = () => (
     <div>
         <Header selectedValue={"Community"}/>
         <div className="ospage">
             <div className="ospoTitle">
                 <img src={ospo1} alt='ospo1'/>
                 <h1>How We Manage Open Source</h1>
             </div>
             <div className="ospoSubtitle">
                 <h1>What Is An Open Source Program Office</h1>
             </div>
             <div className="ospoBody">
                 <p>An open source program office (OSPO) helps developers at your company successfully use, contribute, 
                 and publish open source projects. Typically OSPOs perform governance, management, support, and strategy consulting functions to 
                 support your company’s open source goals. Every company is different and their OSPOs differ too. There are many resources that will help you understand an OSPO even better. A couple of examples are the <a href="https://www.linuxfoundation.org/resources/open-source-guides/">Linux Foundation</a> and <a href="https://todogroup.org/">TODO</a>. </p>
                 <br></br>
                 <p>Our OSPO focuses on in the following areas:</p>
                 <ul>
                    <li>
                        <h4>Publication Review and Support</h4>
                        <p>We review projects and stage them for open source publication on a branded and managed GitHub organization.</p>
                    </li>
                    <li>
                        <h4>License Compliance</h4>
                        <p>We run a scan process during the build process on our mobile apps and other products to help us prepare open source display credits and ensure that our apps contain exactly what we want them to contain, and nothing else.</p>
                    </li>
                    <li>
                        <h4>Contribution Support</h4>
                        <p>We support contributions to open source projects, specifically in cases where they require a contributor license agreement to be signed or where other factors require our involvement.</p>
                    </li>
                    <li>
                        <h4>Strategy review</h4>
                        <p>We work with our technology leadership to ensure we use, contribute to, and create open source projects in a manner that will help reduce tech-debt, improve business outcomes, and support our goals to achieve engineering excellence.</p>
                    </li>
                 </ul>
                 <p>
                    By running an OSPO, we help our engineers focus on their engineering challenges, their sprints, and their products, while knowing that we have their back when it comes to questions about open source licenses, copyrights, and communities. This way fosters an open and collaborative working environment, just like you find in successful open source communities. We thrive on transparency and operate the program as an open source project encouraging collaboration and publishing all our work in the open. We strive to be an open source friendly company for engineers as we believe that together we can create the future, in the open.
                </p>
                 <br></br>
                 <br></br>

            </div>
         </div>
         <Footer/>
    </div>
    
)

export default community;