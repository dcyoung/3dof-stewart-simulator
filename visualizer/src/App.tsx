import './App.css';
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useControls } from 'leva';
import DynamicCamera, { CAMERA_VIEW_ORTHO_BACK, CAMERA_VIEW_ORTHO_BOTTOM, CAMERA_VIEW_ORTHO_FRONT, CAMERA_VIEW_ORTHO_LEFT, CAMERA_VIEW_ORTHO_RIGHT, CAMERA_VIEW_ORTHO_TOP, CAMERA_VIEW_PERSPECTIVE } from './components/camera';
import DynamicControls from './components/controls';
import { Mechanism3Dof, MechanismParameters3Dof } from './stewart-platform-simulator/Mechanism';
import { WheatleySkin } from './components/skins/wheatley';
import Stage from './components/stage';
import MotionControl from './components/motion-control';
import { MechanismDebugHud } from './components/hud';

const App = (): JSX.Element => {
  const mech = new Mechanism3Dof(new MechanismParameters3Dof());
  const { CameraView, SimulateMotion, HUD } = useControls({
    CameraView: {
      value: CAMERA_VIEW_PERSPECTIVE,
      options: [CAMERA_VIEW_PERSPECTIVE, CAMERA_VIEW_ORTHO_FRONT, CAMERA_VIEW_ORTHO_BACK, CAMERA_VIEW_ORTHO_LEFT, CAMERA_VIEW_ORTHO_RIGHT, CAMERA_VIEW_ORTHO_TOP, CAMERA_VIEW_ORTHO_BOTTOM]
    },
    SimulateMotion: true,
    HUD: false,
  });

  return (
    <Canvas shadows gl={{ antialias: false }}>
      <Stage />
      <WheatleySkin mech={mech} />
      <MotionControl mech={mech} simulateMotion={SimulateMotion} />
      {HUD ? <MechanismDebugHud mech={mech} /> : null}
      <DynamicCamera cameraView={CameraView}></DynamicCamera>
      <DynamicControls cameraView={CameraView}></DynamicControls>
      {/* <gridHelper args={[200, 10, `white`, `gray`]} /> */}
      <Stats />
    </Canvas>
  );
}

export default App; 