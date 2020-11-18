import React from "react"
import { Title, Body } from '@vds/typography';

const BlogLayout = () => (
    <div className="blogpage">
        <div className="blogTitleContainer">
            <div className="blogTitle">
                <Title>Open Source Blog</Title>
                <img src={require('../images/news-blk.png')} alt = ""  />
            </div>
            <div className="blogTitleText">
                <br></br>
                <Body size="large">Welcome to the Verizon Open Source blog where we’ll share news and updates about our open source projects.</Body>
            </div>
        </div>
        <div className="blog">
            <img src={require('../images/blog-logo.png')} alt = ""  />
            <span className="blogText"><Body>Blog Snippet 1 Blog Snippet 1Blog Snippet 1Blog Snippet 1Blog Snippet 1Blog Snippet 1Blog Snippet 1Blog Snippet 1Blog Snippet 1Blog Snippet 1Blog Snippet 1Blog Snippet 1 </Body></span>
        </div>
        <div className="blog">
            <img src={require('../images/blog-logo.png')} alt = ""  />
            <span className="blogText"><Body>Blog Snippet 2 Blog Snippet 2Blog Snippet 2Blog Snippet 2Blog Snippet 2Blog Snippet 2Blog Snippet 2Blog Snippet 2Blog Snippet 2Blog Snippet 2Blog Snippet 2Blog Snippet 2 </Body></span>
        </div>
        <div className="blog">
            <img src={require('../images/blog-logo.png')} alt = ""  />
            <span className="blogText"><Body>Blog Snippet 3 Blog Snippet 3Blog Snippet 3Blog Snippet 3Blog Snippet 3Blog Snippet 3Blog Snippet 3Blog Snippet 3Blog Snippet 3Blog Snippet 3Blog Snippet 3Blog Snippet 3 </Body></span>
        </div>
    </div>
    
)

export default BlogLayout