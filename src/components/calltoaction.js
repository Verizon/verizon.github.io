import React from 'react';
import { Link } from "gatsby";
import { Container, Row, Col } from 'react-bootstrap';
import { StaticImage } from 'gatsby-plugin-image';

/*
  likely will reimplement this whole thing
  This is a bit of a mess layout wise and style wise.
*/

const CallToAction = () => (
  <div className="callToAction">
    <Container>
      <Row>
        <Col>
          <h1>Get Involved</h1>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <StaticImage src='../images/display-blk.png' alt='monitor' />
          <a rel="noreferrer" href="https://github.com/Verizon" target="_blank" >
            <h3>
              Use
            </h3>
          </a>
          <p>our code</p>
        </Col>
        <Col>
          <StaticImage src='../images/grid-view-blk.png' alt='grid' />
          <a rel="noreferrer" target="_blank" href='https://github.com/verizon'>
            <h3>
              Contribute
            </h3>
          </a>
          <p>to our projects</p>
        </Col>
        <Col>
          <StaticImage src='../images/unified-comms-blk.png' alt='community' />
          <Link to='/community'>
            <h3>
              Join
            </h3>
          </Link>
          <p>us today</p>
        </Col>
      </Row>
    </Container>
  </div>
)

export default CallToAction;
