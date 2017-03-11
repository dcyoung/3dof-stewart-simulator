import React from "react";
import "./VisualizerDisplay.css";
import { VisualizerDispatchContext } from "../context/VisualizerContext";

class VisualizerDisplay extends React.Component {
  static contextType = VisualizerDispatchContext;

  componentDidMount() {
    const dispatch = this.context;
    dispatch({ type: "init", mount: this.mount });
  }

  render() {
    return (
      <div
        className="Visualizer-window"
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default VisualizerDisplay;
