import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { MutableRefObject, useRef } from "react";
import { Group, Object3D, Vector3 } from "three";
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

export declare interface MechanismDebugHudProps {
    mech: Mechanism3Dof,
    angleDisplayFormat?: number
}

export const MechanismDebugHud = ({
    mech,
    angleDisplayFormat = AngleDisplayFormatEnum.DEGREES_RAW,
    ...props
}: MechanismDebugHudProps): JSX.Element => {
    const ref_servoAngleLeft = useRef<Group>(null);
    const ref_text_servoAngleLeft = useRef<HTMLParagraphElement>(null);
    const ref_servoAngleRight = useRef<Group>(null);
    const ref_text_servoAngleRight = useRef<HTMLParagraphElement>(null);
    const ref_servoAngleYaw = useRef<Group>(null);
    const ref_text_servoAngleYaw = useRef<HTMLParagraphElement>(null);

    const ref_connectingRodLeft = useRef<Group>(null);
    const ref_text_connectingRodLeft = useRef<HTMLParagraphElement>(null);
    const ref_connectingRodRight = useRef<Group>(null);
    const ref_text_connectingRodRight = useRef<HTMLParagraphElement>(null);
    const ref_connectingRodYaw = useRef<Group>(null);
    const ref_text_connectingRodYaw = useRef<HTMLParagraphElement>(null);

    const ref_bJoint_servoHornLeft = useRef<Group>(null);
    const ref_text_bJoint_servoHornLeft = useRef<HTMLParagraphElement>(null);
    const ref_bJoint_servoHornRight = useRef<Group>(null);
    const ref_text_bJoint_servoHornRight = useRef<HTMLParagraphElement>(null);
    const ref_bJoint_servoHornYaw = useRef<Group>(null);
    const ref_text_bJoint_servoHornYaw = useRef<HTMLParagraphElement>(null);
    const ref_bJoint_platformLeft = useRef<Group>(null);
    const ref_text_bJoint_platformLeft = useRef<HTMLParagraphElement>(null);
    const ref_bJoint_platformRight = useRef<Group>(null);
    const ref_text_bJoint_platformRight = useRef<HTMLParagraphElement>(null);
    const ref_bJoint_platformStand = useRef<Group>(null);
    const ref_text_bJoint_platformStand = useRef<HTMLParagraphElement>(null);

    const elements: [
        MutableRefObject<Group | null>, // the group
        MutableRefObject<HTMLParagraphElement | null>,   // the text
        Object3D | null, // the bone to follow for position info... otherwise assume it will be calculated  
        boolean, // true if should show text representation of the position
    ][] = [
            [ref_servoAngleLeft, ref_text_servoAngleLeft, mech.servo_PitchRoll_left, false],
            [ref_servoAngleRight, ref_text_servoAngleRight, mech.servo_PitchRoll_right, false],
            [ref_servoAngleYaw, ref_text_servoAngleYaw, mech.servo_Yaw, false],
            [ref_connectingRodLeft, ref_text_connectingRodLeft, null, false],
            [ref_connectingRodRight, ref_text_connectingRodRight, null, false],
            [ref_connectingRodYaw, ref_text_connectingRodYaw, null, false],
            [ref_bJoint_servoHornLeft, ref_text_bJoint_servoHornLeft, mech.servo_PitchRoll_left.horn.ballJoint, true],
            [ref_bJoint_servoHornRight, ref_text_bJoint_servoHornRight, mech.servo_PitchRoll_right.horn.ballJoint, true],
            [ref_bJoint_servoHornYaw, ref_text_bJoint_servoHornYaw, mech.servo_Yaw.horn.ballJoint, true],
            [ref_bJoint_platformLeft, ref_text_bJoint_platformLeft, mech.platform.ballJoint_left, true],
            [ref_bJoint_platformRight, ref_text_bJoint_platformRight, mech.platform.ballJoint_right, true],
            [ref_bJoint_platformStand, ref_text_bJoint_platformStand, mech.platformStand.ballJoint, true]
        ];

    useFrame(() => {
        // Update positions
        elements.map(([grpRef, textRef, bone, showPosition]) => {
            if (grpRef.current && bone) {
                bone.getWorldPosition(grpRef.current.position);
            }
            if (textRef.current && showPosition && bone) {
                textRef.current.textContent = vectorToFixedString(bone.getWorldPosition(new Vector3()))
            }
        })
        if (ref_connectingRodLeft.current) {
            ref_connectingRodLeft.current.position.copy(mech.getConnectingRodMidPoint_Left_WorldPosition());
        }
        if (ref_connectingRodRight.current) {
            ref_connectingRodRight.current.position.copy(mech.getConnectingRodMidPoint_Right_WorldPosition());
        }
        if (ref_connectingRodYaw.current) {
            ref_connectingRodYaw.current.position.copy(mech.getYawConnectingRodMidPoint_WorldPosition());
        }

        // Update texts
        if (ref_text_servoAngleLeft.current) {
            ref_text_servoAngleLeft.current.textContent = `Rotation: ${formatAngle(mech.getServoAngle_Left(), angleDisplayFormat)}`;
        }
        if (ref_text_servoAngleRight.current) {
            ref_text_servoAngleRight.current.textContent = `Rotation: ${formatAngle(mech.getServoAngle_Right(), angleDisplayFormat)}`;
        }
        if (ref_text_servoAngleYaw.current) {
            ref_text_servoAngleYaw.current.textContent = `Rotation: ${formatAngle(mech.getYawServoAngle(), angleDisplayFormat)}`;
        }
        if (ref_text_connectingRodLeft.current) {
            ref_text_connectingRodLeft.current.textContent = `Len: ${mech.getConnectingRodLength_Left().toFixed(2)}`;
        }
        if (ref_text_connectingRodRight.current) {
            ref_text_connectingRodRight.current.textContent = `Len: ${mech.getConnectingRodLength_Right().toFixed(2)}`;
        }
        if (ref_text_connectingRodYaw.current) {
            ref_text_connectingRodYaw.current.textContent = `Len: ${mech.getYawConnectingRodLength().toFixed(2)}`;
        }
    })

    return (<>
        {elements.map(([refGroup, refText, _, __]) => {
            return <group ref={refGroup} key={generateUUID()}>
                <Html as='div' wrapperClass='debug-hud' center>
                    <p ref={refText}></p>
                </Html>
            </group>
        })}
    </>);
}