import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { VisualizerStateContext } from "../context/VisualizerContext";

function MiscSettings() {
  const vizContext = useContext(VisualizerStateContext);

  return (
    <div>
      <h1>Misc settings go here...</h1>
      <Button
        variant="primary"
        size="lg"
        block
        onClick={() => {
          vizContext.visualizer.toggleMechanismSimulatedMotion();
        }}
      >
        Toggle Simulated Motion
      </Button>
      <Button
        variant="primary"
        size="lg"
        block
        onClick={() => {
          vizContext.visualizer.resetMechanismOrientation();
        }}
      >
        Reset Orientation
      </Button>
    </div>
  );
}

export default MiscSettings;
