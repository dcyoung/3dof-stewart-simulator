import { useFrame } from "@react-three/fiber";
import { Mechanism3Dof } from "../stewart-platform-simulator/Mechanism";

export declare interface MotionControlProps {
    mech: Mechanism3Dof,
    simulateMotion?: boolean,
}

const MotionControl = ({
    mech,
    simulateMotion = true,
    ...props
}: MotionControlProps): JSX.Element => {
    useFrame(() => {
        if (simulateMotion) {
            mech.simulateMotion();
        } else {
            // if (target !== null) {
            //   mech.trackTarget(
            //     target.getWorldPosition(tmpVec)
            //   );
            // }
        }
        mech.animate();
    })

    return <></>;
}

export default MotionControl;
