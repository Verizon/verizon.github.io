import React from "react";
import { Title } from '@vds/typography';

const Ospo = () => (
    <div className="OspoFrontPage">
        <Title size="large">Learn about open source project offices</Title>
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
                <iframe src='https://www.youtube.com/embed/x6PbVlYBiS0'
                    frameBorder='0'
                    allow='autoplay; encrypted-media'
                    allowFullScreen
                    title='video'
                /> 
            </div>
            <div className="Video1">
                <iframe src='https://www.youtube.com/embed/ncuIj9_EL7o'
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