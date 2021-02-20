import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { VisualizerDispatchContext } from "../context/VisualizerContext";

function MechanicalSettings() {
  const dispatch = useContext(VisualizerDispatchContext);

  return (
    <div>
      <h1>Mechanical settings go here...</h1>
      <Button
        variant="primary"
        size="lg"
        block
        onClick={() => {
            dispatch({
              type: "add_mechanism"
            })
          }
        }
      >
        Add Mechanism
      </Button>
    </div>
  );
}

export default MechanicalSettings;
