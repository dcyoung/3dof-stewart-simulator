import { Html } from "@react-three/drei";
import { Object3D, Vector3 } from "three";
import { generateUUID } from "three/src/math/MathUtils";
import { Mechanism3Dof } from "../stewart-platform-simulator/Mechanism";


const vectorToFixedString = (
    v: Vector3,
    fractionDigits: number = 1
): string => {
    return `${v.x.toFixed(fractionDigits)},${v.y.toFixed(fractionDigits)},${v.z.toFixed(fractionDigits)}`
}

//  Converts radians to degrees 
const rad2Deg = (rad: number): number => {
    return rad * 180 / Math.PI;
}

// Forces range to [0:360) 
const capToAngularRangeDeg = (deg: number): number => {
    deg = deg % 360.0;
    return Math.abs(deg >= 0 ? deg : deg + 360);
}

// Forces range to [0:2PI) 
const capToAngularRangeRad = (rad: number): number => {
    rad = rad % (2 * Math.PI);
    return Math.abs(rad >= 0 ? rad : rad + 2 * Math.PI);
}

const AngleDisplayFormatEnum = {
    RADIANS_RAW: 1,
    RADIANS_0_2PI: 2,
    DEGREES_RAW: 3,
    DEGREES_0_360: 4,

    properties: {
        1: {
            value: 1,
            name: "RADIANS_RAW",
            displayName: "Radians (raw)",
            bIsDefault: false,
        },
        2: {
            value: 2,
            name: "RADIANS_0_2PI",
            displayName: "Radians [0:2*Pi)",
            bIsDefault: false,
        },
        3: {
            value: 3,
            name: "DEGREES_RAW",
            displayName: "Degrees (raw)",
            bIsDefault: true,
        },
        4: {
            value: 4,
            name: "DEGREES_0_360",
            displayName: "Degrees [0:360)",
            bIsDefault: false,
        },
    },
};


const formatAngle = (rad: number, angleDisplayFormat: number): string => {
    switch (angleDisplayFormat) {
        case AngleDisplayFormatEnum.RADIANS_0_2PI:
            return `${capToAngularRangeRad(rad).toFixed(2)}rad`;
        case AngleDisplayFormatEnum.DEGREES_RAW:
            return `${rad2Deg(rad).toFixed(2)}deg`;
        case AngleDisplayFormatEnum.DEGREES_0_360:
            return `${capToAngularRangeDeg(rad2Deg(rad)).toFixed(2)}deg`;
        case AngleDisplayFormatEnum.RADIANS_RAW:
        default:
            return `${rad.toFixed(2)}rad`;
    }
}

export declare interface ObjectOverlayTextProps {
    text: string,
    target: Vector3 | Object3D,
}

export const ObjectOverlayText = ({
    text,
    target,
    ...props
}: ObjectOverlayTextProps): JSX.Element => {
    const targetPosition = new Vector3();
    if (target instanceof Object3D) {
        target.getWorldPosition(targetPosition);
    } else {
        targetPosition.copy(target);
    }
    return <Html
        as='div' // Wrapping element (default: 'div')
        wrapperClass='debug-hud'
        center // Adds a -50%/-50% css transform (default: false) [ignored in transform mode]
        position={targetPosition}
    >
        <p>{text}</p>
    </Html>
};

export declare interface MechanismDebugHudProps {
    mech: Mechanism3Dof,
    angleDisplayFormat?: number
}

export const MechanismDebugHud = ({
    mech,
    angleDisplayFormat = AngleDisplayFormatEnum.DEGREES_RAW,
    ...props
}: MechanismDebugHudProps): JSX.Element => {
    return <>
        <ObjectOverlayText
            text={`Rotation: ${formatAngle(mech.getServoAngle_Left(), angleDisplayFormat)}`}
            target={mech.servo_PitchRoll_left}
        ></ObjectOverlayText>
        <ObjectOverlayText
            text={`Rotation: ${formatAngle(mech.getServoAngle_Right(), angleDisplayFormat)}`}
            target={mech.servo_PitchRoll_right}
        ></ObjectOverlayText>
        <ObjectOverlayText
            text={`Rotation: ${formatAngle(mech.getYawServoAngle(), angleDisplayFormat)}`}
            target={mech.servo_Yaw}
        ></ObjectOverlayText>

        {/* update the display text for connecting rods */}
        <ObjectOverlayText
            text={`Len: ${mech.getConnectingRodLength_Left().toFixed(2)}`}
            target={mech.getConnectingRodMidPoint_Left_WorldPosition()}
        ></ObjectOverlayText>
        <ObjectOverlayText
            text={`Len: ${mech.getConnectingRodLength_Right().toFixed(2)}`}
            target={mech.getConnectingRodMidPoint_Right_WorldPosition()}
        ></ObjectOverlayText>
        <ObjectOverlayText
            text={`Len: ${mech.getYawConnectingRodLength().toFixed(2)}`}
            target={mech.getYawConnectingRodMidPoint_WorldPosition()}
        ></ObjectOverlayText>

        {[
            mech.servo_PitchRoll_left.horn.ballJoint.getWorldPosition(new Vector3()),
            mech.servo_PitchRoll_right.horn.ballJoint.getWorldPosition(new Vector3()),
            mech.servo_Yaw.horn.ballJoint.getWorldPosition(new Vector3()),
            mech.platform.ballJoint_left.getWorldPosition(new Vector3()),
            mech.platform.ballJoint_right.getWorldPosition(new Vector3()),
            mech.platformStand.ballJoint.getWorldPosition(new Vector3()),
        ].map(v => {
            return (
                <ObjectOverlayText
                    key={generateUUID()}
                    text={vectorToFixedString(v)}
                    target={v}
                ></ObjectOverlayText>);
        })}
    </>;
}