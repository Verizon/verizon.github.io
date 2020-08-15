import React from "react";
import  "../styles/styles.scss";
import BlogLayout from "../components/blogLayout";
import Header from "../components/header";
import Footer from "../components/footer"; 

const BlogPage = () => (
    <div>
        <Header />
        <BlogLayout/>
        <Footer/>
    </div>
)

export default BlogPage;