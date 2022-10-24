import { Scene, Vector3 } from 'three';
import { Mechanism3Dof } from './Mechanism';

/**
 * A simulation mode for simulations
 */
enum SimulationMode {
  IDLE = 'IDLE',
  SIMULATED_MOTION = 'SIMULATED_MOTION',
  TRACK_TARGET = 'TRACK_TARGET',
}

/**
 * A headless simulation for a mechnism
 */
class HeadlessSimulation {
  private _simulationMode: SimulationMode;
  private _lookAtWorldPosition: Vector3;
  private _scene: Scene;
  public readonly mechanism: Mechanism3Dof;

  constructor(mechanism: Mechanism3Dof) {
    this.mechanism = mechanism;
    this._simulationMode = SimulationMode.IDLE;
    this._lookAtWorldPosition = new Vector3(0, 0, 0);
    this._scene = new Scene();
    this._scene.add(this.mechanism);
    this.resetOrientation();
  }

  setSimulationMode(mode: SimulationMode): void {
    this._simulationMode = mode;
  }

  setTargetWorldPosition(v: Vector3): void {
    this._lookAtWorldPosition.copy(v);
  }

  resetOrientation(): void {
    this.mechanism.setFinalOrientation(0, 0, 0);
  }

  animateMechanism(): void {
    switch (this._simulationMode) {
      case SimulationMode.SIMULATED_MOTION:
        this.mechanism.simulateMotion();
        break;
      case SimulationMode.TRACK_TARGET:
        this.mechanism.trackTarget(this._lookAtWorldPosition);
        break;
      case SimulationMode.IDLE:
      default:
        break;
    }

    this.mechanism.animate();
  }
}
export { HeadlessSimulation, SimulationMode };
