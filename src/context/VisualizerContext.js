import React from "react";
import { Visualizer, DebugHUD, MechanismDebugHudComponent } from "../modules/Graphics";

const VisualizerStateContext = React.createContext();
const VisualizerDispatchContext = React.createContext();

function visualizerReducer(state, action) {
  switch (action.type) {
    case "init": {
      state.visualizer.init(action.visualizerMount);
      state.debugHUD.init(action.hudMount, state.visualizer);
      state.visualizer.addAnimHook(state.debugHUD);
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
    case "activate_target_control": {
      state.visualizer.activateTargetMode();
      return state;
    }
    case "deactivate_target_control": {
      state.visualizer.deactivateTargetMode();
      return state;
    }
    case "add_mechanism": {
      if (state.visualizer._mechanism === null) {
        state.visualizer.addMechanism();
        state.debugHUD.addHUDComponent(new MechanismDebugHudComponent());
      }
      return state;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function VisualizerProvider({ children }) {
  const [state, dispatch] = React.useReducer(visualizerReducer, {
    visualizer: new Visualizer(),
    debugHUD: new DebugHUD(),
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
