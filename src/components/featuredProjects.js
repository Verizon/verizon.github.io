import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { StaticImage } from "gatsby-plugin-image";

const FeaturedProjects = () => (
  <Container className="featuredProjects">
    <Row>
      <h1>
        Featured Projects
      </h1>
    </Row>
    <br />
    <Row>
      <Col>
        <StaticImage src='../images/laptop-antivirus-blk.png' alt='safe computer' />
        <h2>
          Caching
        </h2>
        <a href="https://github.com/Verizon/safecache" target="_blank" rel="noreferrer">
          <p>Safecache</p>
        </a>
      </Col>
      <Col>
        <StaticImage src='../images/hackers-blk.png' alt='infected computer' />
        <h2>
          YANG
        </h2>
        <p>
          <a href="https://github.com/Verizon/YANG-Validator" target="_blank" rel="noreferrer">Validator</a>
          <br />
          <a href="https://github.com/Verizon/YANG-transformer" target="_blank" rel="noreferrer">Transformer</a>
        </p>
      </Col>
      <Col>
        <StaticImage src='../images/digital-content-blk.png' alt='computer with landscape background' />
        <h2>
          AWS
        </h2>
        <a href="https://github.com/Verizon/5GEdgeTutorials" target="_blank" rel="noreferrer">
          <p>5G Edge</p>
        </a>
      </Col>
    </Row>
  </Container>
);

export default FeaturedProjects;
