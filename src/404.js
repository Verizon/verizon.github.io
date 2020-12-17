import React from "react";
import { Title, Subtitle } from '@vds/typography'; 

const NotFoundPage = () => {
    return (
        <div className="notFound">
            <Title size="XLarge">404</Title>
            <br></br>
            <Subtitle>Uh oh! I think you've reached a bad URL!</Subtitle>
        </div>
    )
}

export default NotFoundPage;