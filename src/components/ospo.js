import React from "react";
import { Title } from "@vds/typography"

const Ospo = () => (
    <div className="OspoFrontPage">
        <Title size="large">Learn about open source</Title>
        <div className="innerOspo">
            <div className="Video1">
                <iframe src='https://www.youtube.com/embed/KHyVJzYnRT8'
                    frameBorder='0'
                    width='100%'
                    height='100%'
                    allow='autoplay; encrypted-media'
                    allowFullScreen
                    title='video'
                />          
            </div>
            <div className="Video1">
                <iframe src='https://www.youtube.com/embed/V3c5p2JopzQ'
                    frameBorder='0'
                    width='100%'
                    height='100%'
                    allow='autoplay; encrypted-media'
                    allowFullScreen
                    title='video'
                /> 
            </div>
            <div className="Video1">
                <iframe src='https://www.youtube.com/embed/Z4KzklUB6Jw'
                    frameBorder='0'
                    width='100%'
                    height='100%'
                    allow='autoplay; encrypted-media'
                    allowFullScreen
                    title='video'
                /> 
            </div>
        </div>
    </div>
);

export default Ospo;