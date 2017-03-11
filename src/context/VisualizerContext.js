import React from "react";
import { Visualizer } from "../modules/Graphics";

const VisualizerStateContext = React.createContext();
const VisualizerDispatchContext = React.createContext();

function visualizerReducer(state, action) {
  switch (action.type) {
    case "init": {
      state.visualizer.init(action.mount);
      return state;
    }
    case "change_view": {
      state.visualizer.changeView(action.view);
      return state;
    }
    case "change_background_color": {
      state.visualizer.changeBackgroundColor(action.color);
      return state;
    }
    case "add_mechanism": {
      state.visualizer.addMechanism();
      return state;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function VisualizerProvider({ children }) {
  const [state, dispatch] = React.useReducer(visualizerReducer, {
    visualizer: new Visualizer()
  });
  return (
    <VisualizerStateContext.Provider value={state}>
      <VisualizerDispatchContext.Provider value={dispatch}>
        {children}
      </VisualizerDispatchContext.Provider>
    </VisualizerStateContext.Provider>
  );
}

export {
  VisualizerProvider,
  VisualizerStateContext,
  VisualizerDispatchContext
};
