import React from 'react';
import Seo from "../components/seo";
import Carousel from '../components/carousel/carousel';
import FeaturedProjects from '../components/featuredProjects';
import CallToAction from '../components/calltoaction';
import Layout from '../components/layout';

const Index = () => (
  <Layout>
    <Seo title="Verizon Open Source Home" />
    <Carousel />
    <FeaturedProjects />
    <CallToAction />
  </Layout>
)

export default Index
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals