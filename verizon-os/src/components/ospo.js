import React from "react"
import { Title } from '@vds/typography';

const Ospo = () => (
    <ospo>
        <div className="OspoFrontPage">
            <Title>Learn About Open Source Project Offices</Title>
            <div className="innerOspo">
                <div className="Video1">
                    <iframe src='https://www.youtube.com/embed/YqvKHBTJ0yQ'
                        frameborder='0'
                        allow='autoplay; encrypted-media'
                        allowfullscreen
                        title='video'
                    />          
                </div>
                <div className="Video1">
                    <iframe src='https://www.youtube.com/embed/Y1sXSSvnkFo'
                        frameborder='0'
                        allow='autoplay; encrypted-media'
                        allowfullscreen
                        title='video'
                    /> 
                </div>
                <div className="Video1">
                    <iframe src='https://www.youtube.com/embed/fIAD_s8mtf4'
                        frameborder='0'
                        allow='autoplay; encrypted-media'
                        allowfullscreen
                        title='video'
                    /> 
                </div>
            </div>
        </div>
    </ospo>
)

export default Ospo