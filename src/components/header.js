import { Link, navigate } from "gatsby"; // TODO: Gatsby links
import { StaticImage } from "gatsby-plugin-image";
import React from "react";
import { Container, Row, Col, NavDropdown } from "react-bootstrap"


const routePaths = [
  { val: '/', name: 'Home' },
  { val: '/community', name: 'Community' },
  { val: 'https://github.com/Verizon', name: 'Projects' },
  { val: "https://www.verizon.com/support/residential/internet/equipment/open-source-software", name: 'Attributions'}
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
        <Col xs="3">
          <div className="logo">
            <Link to="/"><StaticImage src="../images/vz_300_rgb_p.jpg" alt="VzLogo" /></Link>
          </div>
        </Col>
        <Col xs="6">
          <h4
          style={{
            textAlign: "center"
          }}
          ><strong>Open Source</strong></h4>
        </Col>
        <Col className="d-none d-xxl-flex justify-content-end">
          <Row>
            {routePaths.map(
              (item, index) => (
                <Col key={index}>
                  {item.val.includes("https") ? 
                  (<a
                    style={{ textDecoration: 'underline', textDecorationColor: 'black' }}
                    href={item.val}>
                    <h5>{item.name}</h5>
                  </a>) :
                  (<Link
                    style={{ textDecoration: 'underline', textDecorationColor: 'black' }}
                    to={item.val}>
                    <h5>{item.name}</h5>
                  </Link>)}
                </Col>
              )

            )}
          </Row>

        </Col>
        <Col className="d-xl-flex align-self-center d-xxl-none justify-content-end">
          <NavDropdown title="More" >
            {routePaths.map((item, index) => <NavDropdown.Item onClick={() => navigate(item.val)} key={index}>{item.name}</NavDropdown.Item>)}
          </NavDropdown>
        </Col>
      </Row>
    </Container>
  </header>
);

export default Header;
