import React from "react";
import "./App.css";
import Sidebar from "./ui/Sidebar";
import VisualizerDisplay from "./ui/VisualizerDisplay";
import Toolbar from "./ui/Toolbar";
import { VisualizerProvider } from "./context/VisualizerContext";
import { Container, Row, Col } from "react-bootstrap";



function App() {
  return (
    <div className="App">
      <VisualizerProvider>
        <Container fluid={true}>
          <Row>
            <Col>
              <Sidebar />
            </Col>
            <Col xs={9}>
              <Toolbar />
              <VisualizerDisplay />
            </Col>
          </Row>
        </Container>
      </VisualizerProvider>
    </div>
  );
}

export default App;
