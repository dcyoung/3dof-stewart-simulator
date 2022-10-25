import { useFrame } from "@react-three/fiber";
import { Object3D, Vector3 } from "three";
import { Mechanism3Dof } from "../stewart-platform-simulator/Mechanism";

export declare interface MotionControlProps {
    mech: Mechanism3Dof,
    simulateMotion?: boolean,
    target?: Object3D | null
}

const MotionControl = ({
    mech,
    simulateMotion = true,
    target,
    ...props
}: MotionControlProps): JSX.Element => {
    const tmpVec = new Vector3();

    useFrame(() => {
        if (simulateMotion) {
            mech.simulateMotion();
        } else {
            if (target !== null && target !== undefined) {
                mech.trackTarget(
                    target.getWorldPosition(tmpVec)
                );
            }
        }
        mech.animate();
    })

    return <></>;
}

export default MotionControl;
