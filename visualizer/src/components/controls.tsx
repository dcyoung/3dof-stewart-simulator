import { OrbitControls, TrackballControls } from "@react-three/drei";
import { CAMERA_VIEW_PERSPECTIVE } from "./camera";

export declare interface DynamicControlsProps {
    cameraView: string;
}

export const DynamicControls = ({
    cameraView,
    ...props
}: DynamicControlsProps): JSX.Element => {
    if (cameraView === CAMERA_VIEW_PERSPECTIVE) {
        return <OrbitControls></OrbitControls>
    }

    return <TrackballControls
        noRotate={true}
        zoomSpeed={1.5}
        panSpeed={10}
        staticMoving={true}
        dynamicDampingFactor={0.3}
    ></TrackballControls>
}

export default DynamicControls;

