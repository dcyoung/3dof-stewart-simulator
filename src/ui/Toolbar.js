import React, { useContext } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { VisualizerDispatchContext } from "../context/VisualizerContext";
import { CameraViewEnum, BackgroundColorEnum } from "../modules/Graphics";

function CameraViewSelector() {
  const dispatch = useContext(VisualizerDispatchContext);

  return (
    <NavDropdown title="Camera View" id="basic-nav-dropdown">
      {Object.keys(CameraViewEnum.properties).map((key, index) => {
        return (
          <NavDropdown.Item
            key={index}
            onClick={() =>
              dispatch({
                type: "change_view",
                view: CameraViewEnum.properties[key].value
              })
            }
          >
            {CameraViewEnum.properties[key].displayName}
          </NavDropdown.Item>
        );
      })}
    </NavDropdown>
  );
}

function BackgroundColorSelector() {
  const dispatch = useContext(VisualizerDispatchContext);
  return (
    <NavDropdown title="Background Color" id="basic-nav-dropdown">
      {Object.keys(BackgroundColorEnum.properties).map((key, index) => {
        return (
          <NavDropdown.Item
            key={index}
            onClick={() =>
              dispatch({
                type: "change_background_color",
                color: BackgroundColorEnum.properties[key].value
              })
            }
          >
            {BackgroundColorEnum.properties[key].displayName}
          </NavDropdown.Item>
        );
      })}
    </NavDropdown>
  );
}

function Toolbar() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand>Stewart Simulator</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <CameraViewSelector />
          <BackgroundColorSelector />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Toolbar;
