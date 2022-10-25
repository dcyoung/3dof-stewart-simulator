import { OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import { Vector3 } from "three";

const POS_Y_AXIS = new Vector3(0, 1, 0);
const POS_Z_AXIS = new Vector3(0, 0, 1);
export const CAMERA_VIEW_PERSPECTIVE = "PERSPECTIVE";
export const CAMERA_VIEW_ORTHO_FRONT = "ORTHO_FRONT";
export const CAMERA_VIEW_ORTHO_BACK = "ORTHO_BACK";
export const CAMERA_VIEW_ORTHO_LEFT = "ORTHO_LEFT";
export const CAMERA_VIEW_ORTHO_RIGHT = "ORTHO_RIGHT";
export const CAMERA_VIEW_ORTHO_TOP = "ORTHO_TOP";
export const CAMERA_VIEW_ORTHO_BOTTOM = "ORTHO_BOTTOM";

const STARTING_ORTHO_CAM_DISTANCE = 125;
const STARTING_PERSPECTIVE_CAM_POSITION = new Vector3(125, 50, 70);


export declare interface DynamicCameraProps {
  cameraView: string;
}


export const DynamicCamera = ({
  cameraView,
  ...props
}: DynamicCameraProps): JSX.Element => {
  if (cameraView === CAMERA_VIEW_PERSPECTIVE) {
    return (
      <PerspectiveCamera
        makeDefault
        fov={90}
        near={0.1}
        far={10000}
        rotation={[0, 0, 0]}
        position={STARTING_PERSPECTIVE_CAM_POSITION.toArray()}
        up={[0, 1, 0]}
      ></PerspectiveCamera>
    );
  }

  let startingPosition = [0, 0, STARTING_ORTHO_CAM_DISTANCE];
  let up = POS_Y_AXIS;

  switch (cameraView) {
    case CAMERA_VIEW_ORTHO_FRONT:
      startingPosition = [0, 0, STARTING_ORTHO_CAM_DISTANCE];
      up = POS_Y_AXIS;
      break;
    case CAMERA_VIEW_ORTHO_BACK:
      startingPosition = [0, 0, -STARTING_ORTHO_CAM_DISTANCE];
      up = POS_Y_AXIS;
      break;
    case CAMERA_VIEW_ORTHO_LEFT:
      startingPosition = [-STARTING_ORTHO_CAM_DISTANCE, 0, 0];
      up = POS_Y_AXIS;
      break;
    case CAMERA_VIEW_ORTHO_RIGHT:
      startingPosition = [STARTING_ORTHO_CAM_DISTANCE, 0, 0];
      up = POS_Y_AXIS;
      break;
    case CAMERA_VIEW_ORTHO_TOP:
      startingPosition = [0, STARTING_ORTHO_CAM_DISTANCE, 0];
      up = POS_Z_AXIS;
      break;
    case CAMERA_VIEW_ORTHO_BOTTOM:
      startingPosition = [0, -STARTING_ORTHO_CAM_DISTANCE, 0];
      up = POS_Z_AXIS;
      break;
    default:
      throw new Error(`Unsupported camera view ${cameraView}`);
  }
  return (
    <OrthographicCamera
      makeDefault
      near={0.1}
      far={10000}
      rotation={[0, 0, 0]}
      up={up.toArray()}
      position={new Vector3().fromArray(startingPosition)}
      zoom={12.0}
    ></OrthographicCamera>
  );
}


export default DynamicCamera;