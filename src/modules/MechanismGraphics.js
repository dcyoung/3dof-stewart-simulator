import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

function addVisualMeshesToMechanism(
    mechanism,
    meshUrlBase = process.env.PUBLIC_URL + "/models/wheatley/skeleton.stl",
    meshUrlYawRod = process.env.PUBLIC_URL + "/models/wheatley/yaw_rod.stl",
    meshUrlYawRodMount = process.env.PUBLIC_URL + "/models/wheatley/yaw_rod_mount.stl",
    meshUrlCenterPlatform = process.env.PUBLIC_URL + "/models/wheatley/center_platform.stl",
    meshUrlServoPitchRollLeft = process.env.PUBLIC_URL + "/models/servo/s3003.stl",
    meshUrlServoPitchRollRight = process.env.PUBLIC_URL + "/models/servo/s3003.stl",
    meshUrlServoYaw = process.env.PUBLIC_URL + "/models/servo/s3003.stl",
    meshUrlServoHorn = process.env.PUBLIC_URL + "/models/horn/MG90s_arm.stl",
    meshUrlBallJoint = process.env.PUBLIC_URL + "/models/ball-joint/m3_ball_joint.stl",
) {
    const loader = new STLLoader();
    // Materials
    const materialBase = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        specular: 0x111111,
        shininess: 200,
        opacity: 0.5,
        transparent: true,
    });
    const materialServo = new THREE.MeshBasicMaterial({
        color: 0x404040,
        opacity: 0.5,
        transparent: true,
    });
    const materialServoHorn = new THREE.MeshBasicMaterial({
        color: 0xf5f5f5,
        opacity: 0.5,
        transparent: true,
    });
    const materialBallJoint = new THREE.MeshBasicMaterial({
        color: 0x303030,
        opacity: 0.5,
        transparent: true,
    });

    // Skeleton
    loader.load(
        meshUrlBase,
        function (geometry) {
            const mesh = new THREE.Mesh(geometry, materialBase);
            mesh.rotation.set(-Math.PI / 2, 0, 0);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mechanism.base.add(mesh);
        }
    );

    // Platform Stand - Yaw rod
    loader.load(
        meshUrlYawRod,
        function (geometry) {
            const mesh = new THREE.Mesh(geometry, materialBase);
            mesh.rotation.set(-Math.PI / 2, 0, 0);
            mechanism.platformStand.add(mesh);
        }
    );
    // Platform stand - Linkage Mount
    loader.load(
        meshUrlYawRodMount,
        function (geometry) {
            const mesh = new THREE.Mesh(geometry, materialBase);
            mesh.rotation.set(-Math.PI / 2, 0, 0);
            mechanism.platformStand.add(mesh);
        }
    );

    // Platform
    loader.load(
        meshUrlCenterPlatform,
        function (geometry) {
            const mesh = new THREE.Mesh(geometry, materialBase);
            mesh.rotation.set(-Math.PI / 2, 0, 0);
            mechanism.platform.add(mesh);
        }
    );

    // Servos
    for (const [servo, meshUrl] of [
        [mechanism.servo_PitchRoll_left, meshUrlServoPitchRollLeft],
        [mechanism.servo_PitchRoll_right, meshUrlServoPitchRollRight],
        [mechanism.servo_Yaw, meshUrlServoYaw]]
    ) {
        loader.load(
            meshUrl,
            function (geometry) {
                const mesh = new THREE.Mesh(geometry, materialServo);
                servo.add(mesh);
            }
        );
        loader.load(
            meshUrlServoHorn,
            function (geometry) {
                const mesh = new THREE.Mesh(geometry, materialServoHorn);
                mesh.rotation.set(Math.PI, 0, 0);
                servo.horn.add(mesh);
            }
        );
    }

    for (const bJoint of [
        mechanism.platformStand.ballJoint,
        mechanism.servo_PitchRoll_left.horn.ballJoint,
        mechanism.servo_PitchRoll_right.horn.ballJoint,
        mechanism.servo_Yaw.horn.ballJoint,
        mechanism.platformStand.ballJoint,
        mechanism.platform.ballJoint_left,
        mechanism.platform.ballJoint_right,
    ]) {
        loader.load(
            meshUrlBallJoint,
            function (geometry) {
                const mesh = new THREE.Mesh(geometry, materialBallJoint);
                mesh.position.set(0, 0, 0);
                mesh.rotation.set(-Math.PI / 2, 0, 0);
                let scaleFactor = 0.15;
                mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
                bJoint.add(mesh);
            }
        );
    }

    // Axes Helpers
    mechanism.platform.add(new THREE.AxesHelper(30));
    mechanism.platformStand.add(new THREE.AxesHelper(15));

    for (const servo of [
        mechanism.servo_PitchRoll_left,
        mechanism.servo_PitchRoll_right,
        mechanism.servo_Yaw
    ]) {
        servo.add(new THREE.AxesHelper(8));
        servo.horn.add(new THREE.AxesHelper(8));
        servo.horn.ballJoint.add(new THREE.AxesHelper(5));
    }
}

export { addVisualMeshesToMechanism }