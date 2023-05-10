import React from "react";
import { Link } from "gatsby";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => (
  <footer>
    <Container
      fluid
      style={{
        paddingTop: "1.5rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem"
      }}>
      <Row>
        <Col className="justify-content-start d-flex">
          <Row className="d-flex">
            <Col>
              <Link to="/community" >
                <h5>
                  <strong>Community</strong>
                </h5>
              </Link>
            </Col>
            <Col>
              <a
                href="https://github.com/Verizon"
                target="_blank"
                rel="noreferrer">
                <h5>
                  <strong>Github</strong>
                </h5>
              </a>
            </Col>
          </Row>
        </Col>
        <Col className="justify-content-end d-flex" style={{
          fontSize: ".8rem",
          fontWeight: "bold"
        }}>
          <p>&#169;	 {(new Date()).getFullYear()} Verizon</p>
        </Col>
      </Row>
    </Container>
  </footer>
)

export default Footer;