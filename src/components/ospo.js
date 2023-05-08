import React from "react";

const Ospo = () => (
    <div className="OspoFrontPage">
        <h1 size="large">Learn about open source</h1>
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