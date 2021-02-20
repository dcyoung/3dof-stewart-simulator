import React from "react";
import "./VisualizerDisplay.css";
import { VisualizerDispatchContext } from "../context/VisualizerContext";

class VisualizerDisplay extends React.Component {
  static contextType = VisualizerDispatchContext;

  componentDidMount() {
    const dispatch = this.context;
    dispatch({ type: "init", visualizerMount: this.visualizerMount, hudMount: this.hudMount });
  }

  render() {
    return (
      <div
        className="Visualizer-window"
        ref={mount => {
          this.visualizerMount = mount;
        }}
      >
        <div 
          id="debug-hud"
          ref = {mount => {
            this.hudMount = mount;
          }}
        />
      </div>
    );
  }
}

export default VisualizerDisplay;
