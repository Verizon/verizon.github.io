import React from "react";
import Layout from '../components/layout';
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "gatsby";

const NotFoundPage = () => {
	return (
		<Layout>
			<Container
				style={{
					textAlign: "center",
					paddingTop: "10rem",
					paddingBottom: "50rem"
				}}
			>
				<Row>
					<Col>
						<h1>You've arrived at an unfamiliar page</h1>
					</Col>
				</Row>
				<Row>
					<h3><strong>You have two choices.</strong></h3>
				</Row>
				<Row>
					<Col>
						<Link to="/"
						style={{
							color: "blue"
						}}
						>Return To Safety</Link>
					</Col>
					<Col>
						<a style={{
							color: "red"
						}} href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Follow The Rabbit Hole</a>
					</Col>
				</Row>
			</Container>
		</Layout>
	)
}
export default NotFoundPage;