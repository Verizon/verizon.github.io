import React from "react";
import  "./styles.scss";  
import Header from './components/header';
import Footer from './components/footer'; 
import ospo1 from './images/business-continuity-blk.png';
import { Title, Subtitle } from '@vds/typography'; 


const OsPage = () => (
     <div>
         <Header selectedValue={"Community"}/>
         <div className="ospage">
             <div className="ospoTitle">
                 <img src={ospo1} alt='ospo1'/>
                 <Title size="large" viewport="mobile">How We Manage Open Source</Title>
             </div>
             <div className="ospoSubtitle">
                 <Title size="large" viewport="mobile">What Is An Open Source Program Office</Title>
             </div>
             <div className="ospoBody">
                 <Subtitle size="large" viewport="mobile">An open source program office (OSPO) helps developers at your company successfully use, contribute, 
                 and publish open source projects. Typically OSPOs perform governance, management, support, and strategy consulting functions to 
                 support your company’s open source goals. Every company is different and their OSPOs differ too. There are many resources that will help you understand an OSPO even better. A couple of examples are the <a href="https://www.linuxfoundation.org/resources/open-source-guides/">Linux Foundation</a> and <a href="https://todogroup.org/">TODO</a>. </Subtitle>
                 <br></br>
                 <Subtitle size="large" viewport="mobile"> Our OSPO focuses on in the following areas:</Subtitle>
                 <ul>
                    <li><Title bold={true} size="medium" viewport="mobile">Publication Review and Support</Title><Subtitle size="large" viewport="mobile">We review projects and stage them for open source publication on a branded and managed GitHub organization.</Subtitle></li>
                    <li><Title bold={true} size="medium" viewport="mobile">License Compliance</Title><Subtitle size="large" viewport="mobile">We run a scan process during the build process on our mobile apps and other products to help us prepare open source display credits and ensure that our apps contain exactly what we want them to contain, and nothing else.</Subtitle></li>
                    <li><Title bold={true} size="medium" viewport="mobile">Contribution Support</Title><Subtitle size="large" viewport="mobile">We support contributions to open source projects, specifically in cases where they require a contributor license agreement to be signed or where other factors require our involvement.</Subtitle></li>
                    <li><Title bold={true} size="medium" viewport="mobile">Strategy review</Title><Subtitle size="large" viewport="mobile">We work with our technology leadership to ensure we use, contribute to, and create open source projects in a manner that will help reduce tech-debt, improve business outcomes, and support our goals to achieve engineering excellence.</Subtitle></li>
                 </ul>
                 <Subtitle size="large" viewport="mobile">By running an OSPO, we help our engineers focus on their engineering challenges, their sprints, and their products, while knowing that we have their back when it comes to questions about open source licenses, copyrights, and communities. This way fosters an open and collaborative working environment, just like you find in successful open source communities. We thrive on transparency and operate the program as an open source project encouraging collaboration and publishing all our work in the open. We strive to be an open source friendly company for engineers as we believe that together we can create the future, in the open.</Subtitle>
                 <br></br>
                 <br></br>

            </div>
         </div>
         <Footer/>
    </div>
    
)

export default OsPage;