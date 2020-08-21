import React from "react";
import { Title } from '@vds/typography';

const Ospo = () => (
    <div className="OspoFrontPage">
        <Title>Learn About Open Source Project Offices</Title>
        <div className="innerOspo">
            <div className="Video1">
                <iframe src='https://www.youtube.com/embed/YqvKHBTJ0yQ'
                    frameBorder='0'
                    allow='autoplay; encrypted-media'
                    allowFullScreen
                    title='video'
                />          
            </div>
            <div className="Video1">
                <iframe src='https://www.youtube.com/embed/Y1sXSSvnkFo'
                    frameBorder='0'
                    allow='autoplay; encrypted-media'
                    allowFullScreen
                    title='video'
                /> 
            </div>
            <div className="Video1">
                <iframe src='https://www.youtube.com/embed/fIAD_s8mtf4'
                    frameBorder='0'
                    allow='autoplay; encrypted-media'
                    allowFullScreen
                    title='video'
                /> 
            </div>
        </div>
    </div>
);

export default Ospo;