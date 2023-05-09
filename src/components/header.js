import { Link, navigate } from "gatsby"; // TODO: Gatsby links
import { StaticImage } from "gatsby-plugin-image";
import React from "react";
import { Container, Row, Col, NavDropdown } from "react-bootstrap"

const ddVals = [
  { val: '/', name: 'Home' },
  { val: '/community', name: 'Community' },
  { val: '/projects', name: 'Projects' },
  { val: 'https://www.verizon.com/support/residential/internet/equipment/open-source-software', name: 'Attributions' }
]

const routePaths = [
  { val: '/', name: 'Home' },
  { val: '/community', name: 'Community' },
  { val: '/projects', name: 'Projects' }
]

const Header = () => (
  <header>
    <Container
      fluid
      style={{
        paddingTop: `.4rem`,
      }}
    >
      <Row
        className="justify-content-md-center justify-content-sm-start align-items-end"
      >
        <Col xs="4">
          <div className="logo">
            <Link to="/index"><StaticImage src="../images/vz_300_rgb_p.jpg" alt="VzLogo" /></Link>
          </div>
        </Col>
        <Col xs="6" lg="4">
          <h4
          style={{
            textAlign: "center"
          }}
          ><strong>Open Source</strong></h4>
        </Col>
        <Col className="d-none d-lg-flex justify-content-end">
          <Row>
            {routePaths.map(
              (item, index) => (
                <Col>
                  <Link
                    style={{ textDecoration: 'underline', textDecorationColor: 'black' }}
                    to={item.val}
                    key={index}>
                    <h5>{item.name}</h5>
                  </Link>
                </Col>
              )

            )}
            <Col>
              <a
                href="https://www.verizon.com/support/residential/internet/equipment/open-source-software"
                style={{
                  textDecoration: 'underline',
                  textDecorationColor: 'black'
                }}
                target="_blank"
                rel="noreferrer">
                <h5>Attributions</h5>
              </a>
            </Col>
            <Col xs="1"/>
          </Row>

        </Col>
        <Col className="d-md-flex align-self-center d-lg-none">
          <NavDropdown title="More" >
            {ddVals.map((item, index) => <NavDropdown.Item onClick={() => navigate(item.val)}key={index}>{item.name}</NavDropdown.Item>)}
          </NavDropdown>
        </Col>
      </Row>
    </Container>
  </header>
);

export default Header;
