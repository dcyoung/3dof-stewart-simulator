import { Mechanism3Dof } from "../../stewart-platform-simulator/Mechanism";
import { useFrame, useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { MutableRefObject, Suspense, useMemo, useRef } from 'react';
import { Group, MeshBasicMaterial, MeshPhongMaterial, Object3D } from "three";

import MESH_URL_BASE from "./models/wheatley/skeleton.stl";
import MESH_URL_YAW_ROD from "./models/wheatley/yaw_rod.stl";
import MESH_URL_YAW_ROD_MOUNT from "./models/wheatley/yaw_rod_mount.stl";
import MESH_URL_CENTER_PLATFORM from "./models/wheatley/center_platform.stl";
import MESH_URL_SERVO from "./models/servo/s3003.stl";
import MESH_URL_SERVO_HORN from "./models/horn/MG90s_arm.stl";
import MESH_URL_BALL_JOINT from "./models/ball-joint/m3_ball_joint.stl";
import { generateUUID } from "three/src/math/MathUtils";


export declare interface WheatleySkinProps {
    mech: Mechanism3Dof,
}

export const WheatleySkin = ({
    mech,
    ...props
}: WheatleySkinProps): JSX.Element => {
    const materialBase = useMemo(() => new MeshPhongMaterial({
        color: 0xaaaaaa,
        specular: 0x111111,
        shininess: 200,
        opacity: 0.5,
        transparent: true,
    }), []);
    const materialServo = useMemo(() => new MeshBasicMaterial({
        color: 0x404040,
        opacity: 0.5,
        transparent: true,
    }), []);
    const materialServoHorn = useMemo(() => new MeshBasicMaterial({
        color: 0xf5f5f5,
        opacity: 0.5,
        transparent: true,
    }), []);
    const materialBallJoint = useMemo(() => new MeshBasicMaterial({
        color: 0x303030,
        opacity: 0.5,
        transparent: true,
    }), []);
    const geomBase = useLoader(STLLoader, MESH_URL_BASE);
    const geomYawRod = useLoader(STLLoader, MESH_URL_YAW_ROD);
    const geomYawRodMount = useLoader(STLLoader, MESH_URL_YAW_ROD_MOUNT);
    const geomCenterPlatform = useLoader(STLLoader, MESH_URL_CENTER_PLATFORM);
    const geomServo = useLoader(STLLoader, MESH_URL_SERVO);
    const geomServoHorn = useLoader(STLLoader, MESH_URL_SERVO_HORN);
    const geomBallJoint = useLoader(STLLoader, MESH_URL_BALL_JOINT);

    const ref_mech = useRef<Group | null>(null);
    const ref_base = useRef<Group | null>(null);
    const ref_platformStand = useRef<Group | null>(null);
    const ref_platformStandBallJoint = useRef<Group | null>(null);
    const ref_platform = useRef<Group | null>(null);
    const ref_platform_ballJoint_left = useRef<Group | null>(null);
    const ref_platform_ballJoint_right = useRef<Group | null>(null);
    const ref_servoYaw = useRef<Group | null>(null);
    const ref_servoYaw_horn = useRef<Group | null>(null);
    const ref_servoYaw_ballJoint = useRef<Group | null>(null);
    const ref_servoPitchRoll_left = useRef<Group | null>(null);
    const ref_servoPitchRoll_left_horn = useRef<Group | null>(null);
    const ref_servoPitchRoll_left_ballJoint = useRef<Group | null>(null);
    const ref_servoPitchRoll_right = useRef<Group | null>(null);
    const ref_servoPitchRoll_right_horn = useRef<Group | null>(null);
    const ref_servoPitchRoll_right_ballJoint = useRef<Group | null>(null);

    const srcAndRefPairs: [MutableRefObject<Group | null>, Object3D][] = [
        [ref_mech, mech],
        [ref_base, mech.base],
        [ref_platformStand, mech.platformStand],
        [ref_platformStandBallJoint, mech.platformStand.ballJoint],
        [ref_platform, mech.platform],
        [ref_platform_ballJoint_left, mech.platform.ballJoint_left],
        [ref_platform_ballJoint_right, mech.platform.ballJoint_right],
        [ref_servoYaw, mech.servo_Yaw],
        [ref_servoYaw_horn, mech.servo_Yaw.horn],
        [ref_servoYaw_ballJoint, mech.servo_Yaw.horn.ballJoint],
        [ref_servoPitchRoll_left, mech.servo_PitchRoll_left],
        [ref_servoPitchRoll_left_horn, mech.servo_PitchRoll_left.horn],
        [ref_servoPitchRoll_left_ballJoint, mech.servo_PitchRoll_left.horn.ballJoint],
        [ref_servoPitchRoll_right, mech.servo_PitchRoll_right],
        [ref_servoPitchRoll_right_horn, mech.servo_PitchRoll_right.horn],
        [ref_servoPitchRoll_right_ballJoint, mech.servo_PitchRoll_right.horn.ballJoint],
    ];


    useFrame(() => {
        for (const [ref, src] of srcAndRefPairs) {
            ref.current?.setRotationFromMatrix(src.matrix);
            ref.current?.position.copy(src.position);
        }
    });

    return (
        <Suspense fallback={null}>
            <group ref={ref_mech}>
                <group ref={ref_base}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]} material={materialBase}>
                        <primitive object={geomBase} />
                    </mesh>
                    <group ref={ref_platformStand}>
                        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materialBase}>
                            <primitive object={geomYawRod} />
                        </mesh>
                        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materialBase}>
                            <primitive object={geomYawRodMount} />
                        </mesh>
                        <group ref={ref_platformStandBallJoint}>
                            <mesh
                                position={[0, 0, 0]}
                                scale={[0.15, 0.15, 0.15]}
                                rotation={[-Math.PI / 2, 0, 0]}
                                material={materialBallJoint}
                            >
                                <primitive object={geomBallJoint} />
                            </mesh>
                        </group>
                        <axesHelper args={[15]}></axesHelper>
                        <group ref={ref_platform}>
                            <mesh rotation={[-Math.PI / 2, 0, 0]} material={materialBase}>
                                <primitive object={geomCenterPlatform} />
                            </mesh>
                            <group ref={ref_platform_ballJoint_left}>
                                <mesh position={[0, 0, 0]} scale={[0.15, 0.15, 0.15]} rotation={[-Math.PI / 2, 0, 0]} material={materialBallJoint}>
                                    <primitive object={geomBallJoint} />
                                </mesh>
                                {/* <axesHelper args={[5]}></axesHelper> */}
                            </group>
                            <group ref={ref_platform_ballJoint_right}>
                                <mesh position={[0, 0, 0]} scale={[0.15, 0.15, 0.15]} rotation={[-Math.PI / 2, 0, 0]} material={materialBallJoint}>
                                    <primitive object={geomBallJoint} />
                                </mesh>
                                {/* <axesHelper args={[5]}></axesHelper> */}
                            </group>
                        </group>
                    </group>

                    {[
                        [ref_servoYaw, ref_servoYaw_horn, ref_servoYaw_ballJoint],
                        [ref_servoPitchRoll_left, ref_servoPitchRoll_left_horn, ref_servoPitchRoll_left_ballJoint],
                        [ref_servoPitchRoll_right, ref_servoPitchRoll_right_horn, ref_servoPitchRoll_right_ballJoint],
                    ].map(([ref_servo, ref_horn, ref_bJoint]) => {
                        return (
                            <group ref={ref_servo} key={generateUUID()}>
                                <mesh material={materialServo}>
                                    <primitive object={geomServo} />
                                </mesh>
                                <group ref={ref_horn}>
                                    <mesh rotation={[Math.PI, 0, 0]} material={materialServoHorn}>
                                        <primitive object={geomServoHorn} />
                                    </mesh>
                                    <group ref={ref_bJoint}>
                                        <mesh position={[0, 0, 0]} scale={[0.15, 0.15, 0.15]} rotation={[-Math.PI / 2, 0, 0]} material={materialBallJoint}>
                                            <primitive object={geomBallJoint} />
                                        </mesh>
                                        {/* <axesHelper args={[5]}></axesHelper> */}
                                    </group>
                                    <axesHelper args={[8]}></axesHelper>
                                </group>
                                <axesHelper args={[8]}></axesHelper>
                            </group>
                        );
                    })}
                </group>
            </group>
        </Suspense>
    );
}

export default WheatleySkin;