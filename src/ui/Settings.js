import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { VisualizerDispatchContext } from "../context/VisualizerContext";
import { VisualizerStateContext } from "../context/VisualizerContext";

function Settings() {
  const dispatch = useContext(VisualizerDispatchContext);
  const vizContext = useContext(VisualizerStateContext);

  return (
    <div>
      <h1>Settings...</h1>
      <Button
        variant="primary"
        size="lg"
        block
        onClick={() => {
            dispatch({
              type: "toggle_debug_info"
            })
          }
        }
      >
        Toggle Debug Info
      </Button>
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

export default Settings;
