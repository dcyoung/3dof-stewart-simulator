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
          let value = vizContext.visualizer._mechanism.getServoAngle_Left();
          console.log(value);
        }}
      >
        LogServoAngle_Left
      </Button>
    </div>
  );
}

export default MiscSettings;
