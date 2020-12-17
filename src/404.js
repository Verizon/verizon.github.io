import React from "react";
import { Title, Subtitle } from '@vds/typography'; 

const NotFoundPage = () => {
    return (
        <div className="notFound">
            <Title>404</Title>
            <Subtitle>Uh oh! I think you've reached a bad URL!</Subtitle>
        </div>
    )
}

export default NotFoundPage;