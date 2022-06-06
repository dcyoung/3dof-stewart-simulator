import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { calcServoAngle, solveIk2JointPlanar } from "./InverseKinematics";
import { sinBetween } from "./Utils";

const loader = new STLLoader();
const pos_yAxis = new THREE.Vector3(0, 1, 0);

const DefaultParameters = {
  ////////////////////////////////////////////////////////////////////
  // PLATFORM
  ////////////////////////////////////////////////////////////////////
  dist_plat_ball_joint_lat: 35.6235, // longitudinal distance between pivot center and an anchor
  dist_plat_ball_joint_long: -29.9974, // lateral distance between pivot center and an anchor
  dist_plat_ball_joint_vert: 0, // lateral distance between pivot center and an anchor

  ////////////////////////////////////////////////////////////////////
  // PLATFORM STAND / YAW ROD
  ////////////////////////////////////////////////////////////////////
  dist_plat_stand_anchor_long: -8.636, // longitudinal distance between the platform stand's center and an anchor
  dist_plat_stand_anchor_lat: 0, // lateral distance between the platform stand's center and an anchor
  dist_plat_stand_anchor_vert: -47.4726, // vertical distance between the base and platform stand's anchor

  ////////////////////////////////////////////////////////////////////
  // SERVO - PITCH ROLL
  ////////////////////////////////////////////////////////////////////
  // positions relative to mechanism's origin (ie: main pivot, center of rotation)
  dist_servo_pitch_roll_vert: -28.2194, // vertical distance between pivot center and servo centers
  dist_servo_pitch_roll_long: -29.9974, // longitudinal distance between the pivot center and a pitch roll servo
  dist_servo_pitch_roll_lat: 10.7442, // lateral distance between the pivot center and a pitch roll servo
  mount_angle_servo_pitch_roll: 0, // mount angle of the pitch roll servo
  length_servo_horn_pitch_roll: 24.8793, // distance between servo horn axis of rotation and end anchor
  length_connecting_rod_pitch_roll: 28.2194, // distance between two ball joints of a connecting rod

  ////////////////////////////////////////////////////////////////////
  // SERVO - YAW
  ////////////////////////////////////////////////////////////////////
  // positions relative to mechanism's origin (ie: main pivot, center of rotation)
  dist_servo_yaw_long: 5.461, // longitudinal distance between the mechanism's pivot center and the yaw servo
  dist_servo_yaw_lat: -25.2222, // lateral distance between the mechanism's pivot center and the yaw servo
  dist_servo_yaw_vert: -47.4726, // vertical distance between the mechanism's pivot center and the yaw servo
  mount_angle_servo_yaw: Math.PI / 2, // mount angle of the yaw servo
  length_servo_horn_yaw: 14.097, // distance between servo horn axis of rotation and end anchor
  length_connecting_rod_yaw: 25.2222, // distance between two ball joints of a connecting rod
};

class Mechanism extends THREE.Group {
  constructor(params) {
    super();

    // read parameters
    this._parameters = params === undefined ? DefaultParameters : params;

    // create children
    this._base = new Base();
    this._servo_PitchRoll_left = new Servo(
      this._parameters.length_servo_horn_pitch_roll,
      "s3003.stl"
    );
    this._servo_PitchRoll_right = new Servo(
      this._parameters.length_servo_horn_pitch_roll,
      "s3003.stl"
    );
    this._servo_Yaw = new Servo(
      this._parameters.length_servo_horn_yaw,
      "s3003.stl"
    );
    this._platformStand = new PlatformStand(
      this._parameters.dist_plat_stand_anchor_long,
      this._parameters.dist_plat_stand_anchor_lat,
      this._parameters.dist_plat_stand_anchor_vert
    );
    this._platform = new Platform(
      this._parameters.dist_plat_ball_joint_long,
      this._parameters.dist_plat_ball_joint_lat,
      this._parameters.dist_plat_ball_joint_vert
    );

    // Stand -> Platform
    this._platformStand.add(this._platform);

    // Base -> Stand
    this._platformStand.position.set(0, 0, 0);
    this._base.add(this._platformStand);

    // Base -> Servo Yaw
    this._servo_Yaw.position.set(
      this._parameters.dist_servo_yaw_lat,
      this._parameters.dist_servo_yaw_vert,
      this._parameters.dist_servo_yaw_long
    );
    this._servo_Yaw.rotateY(this._parameters.mount_angle_servo_yaw);
    this._base.add(this._servo_Yaw);

    // Base -> Servo Left
    this._servo_PitchRoll_left.position.set(
      this._parameters.dist_servo_pitch_roll_lat,
      this._parameters.dist_servo_pitch_roll_vert,
      this._parameters.dist_servo_pitch_roll_long
    );
    this._servo_PitchRoll_left.rotateX(Math.PI / 2);
    this._servo_PitchRoll_left.rotateY(-Math.PI / 2);
    this._servo_PitchRoll_left.rotateX(
      this._parameters.mount_angle_servo_pitch_roll
    );
    this._base.add(this._servo_PitchRoll_left);

    // Base -> Servo Right
    this._servo_PitchRoll_right.position.set(
      -this._parameters.dist_servo_pitch_roll_lat,
      this._parameters.dist_servo_pitch_roll_vert,
      this._parameters.dist_servo_pitch_roll_long
    );
    this._servo_PitchRoll_right.rotateX(Math.PI / 2);
    this._servo_PitchRoll_right.rotateY(-Math.PI / 2);
    this._servo_PitchRoll_right.rotateX(
      -this._parameters.mount_angle_servo_pitch_roll
    );
    this._base.add(this._servo_PitchRoll_right);

    // Mechanism -> Base
    this.add(this._base);

    // post init
    this.updateMatrixWorld();

    //
    this._clock = new THREE.Clock();
  }

  getPlatform() {
    return this._platform;
  }

  getBase() {
    return this._base;
  }

  getYawConnectingRodLength() {
    return this._servo_Yaw
      .getHorn()
      .getBallJoint()
      .getWorldPosition(new THREE.Vector3())
      .distanceTo(
        this._platformStand.getBallJoint().getWorldPosition(new THREE.Vector3())
      );
  }

  getYawConnectingRodMidPoint_WorldPosition() {
    return getPointInBetweenByPerc(
      this._servo_Yaw
        .getHorn()
        .getBallJoint()
        .getWorldPosition(new THREE.Vector3()),
      this._platformStand.getBallJoint().getWorldPosition(new THREE.Vector3()),
      0.5
    );
  }

  getConnectingRodLength_Left() {
    return this._servo_PitchRoll_left
      .getHorn()
      .getBallJoint()
      .getWorldPosition(new THREE.Vector3())
      .distanceTo(
        this._platform.getBallJointLeft().getWorldPosition(new THREE.Vector3())
      );
  }

  getConnectingRodLength_Right() {
    return this._servo_PitchRoll_right
      .getHorn()
      .getBallJoint()
      .getWorldPosition(new THREE.Vector3())
      .distanceTo(
        this._platform.getBallJointRight().getWorldPosition(new THREE.Vector3())
      );
  }

  getConnectingRodMidPoint_Left_WorldPosition() {
    return getPointInBetweenByPerc(
      this._servo_PitchRoll_left
        .getHorn()
        .getBallJoint()
        .getWorldPosition(new THREE.Vector3()),
      this._platform.getBallJointLeft().getWorldPosition(new THREE.Vector3()),
      0.5
    );
  }

  getConnectingRodMidPoint_Right_WorldPosition() {
    return getPointInBetweenByPerc(
      this._servo_PitchRoll_right
        .getHorn()
        .getBallJoint()
        .getWorldPosition(new THREE.Vector3()),
      this._platform.getBallJointRight().getWorldPosition(new THREE.Vector3()),
      0.5
    );
  }

  // base frame vector from origin of base to platform anchor point
  getQVec_Left() {
    // initialize with the world position of the platform anchor point
    // then convert the world position to local "base" space
    return this._base.worldToLocal(
      this._platform.getBallJointLeft().getWorldPosition(new THREE.Vector3())
    );
  }

  // base frame vector from origin of base to platform anchor point
  getQVec_Right() {
    // initialize with the world position of the platform anchor point
    // then convert the world position to local "base" space
    return this._base.worldToLocal(
      this._platform.getBallJointRight().getWorldPosition(new THREE.Vector3())
    );
  }

  // base frame vector from origin of base to center of servo arm rotation
  getBVec_Left() {
    // initialize with the world position of the center of servo arm rotation
    // then convert the world position to local "base" space
    return this._base.worldToLocal(
      this._servo_PitchRoll_left.getHorn().getWorldPosition(new THREE.Vector3())
    );
  }

  // base frame vector from origin of base to center of servo arm rotation
  getBVec_Right() {
    // initialize with the world position of the center of servo arm rotation
    // then convert the world position to local "base" space
    return this._base.worldToLocal(
      this._servo_PitchRoll_right
        .getHorn()
        .getWorldPosition(new THREE.Vector3())
    );
  }

  // FIXME: currently leveraging a simulated reflection so the math works...
  // would be nice to resolve for expected coordinate system
  getServoAngle_Left() {
    // base frame vector to desired end effector (platform anchor point)
    let q = this.getQVec_Left();
    // base frame vector to center of servo arm rotation
    let B = this.getBVec_Left();
    // length of servo arm
    let a = this._parameters.length_servo_horn_pitch_roll;
    // length of the connecting rod
    let s = this._parameters.length_connecting_rod_pitch_roll;
    // angle of servo horn plane relative to base forward axis
    let beta = Math.PI + this._parameters.mount_angle_servo_pitch_roll;

    // the calculated servo angle (expects vectors with for Z-up)
    return (
      Math.PI +
      calcServoAngle(
        // simulate reflection of q and B vecs so the math from the flip scenario applies
        new THREE.Vector3(-q.x, q.z, q.y),
        new THREE.Vector3(-B.x, B.z, B.y),
        a,
        s,
        beta
      )
    );
  }

  getServoAngle_Right() {
    // base frame vector to desired end effector (platform anchor point)
    let q = this.getQVec_Right();
    // base frame vector to center of servo arm rotation
    let B = this.getBVec_Right();
    // length of servo arm
    let a = this._parameters.length_servo_horn_pitch_roll;
    // length of the connecting rod
    let s = this._parameters.length_connecting_rod_pitch_roll;
    // angle of servo horn plane relative to base forward axis
    let beta = Math.PI - this._parameters.mount_angle_servo_pitch_roll;
    // the calculated servo angle (expects vectors with Z-up)
    return -calcServoAngle(
      new THREE.Vector3(q.x, q.z, q.y),
      new THREE.Vector3(B.x, B.z, B.y),
      a,
      s,
      beta
    );
  }

  getYawServoAngle() {
    const a1 = this._parameters.length_servo_horn_yaw;
    const a2 = this._parameters.length_connecting_rod_yaw;

    // define the position of the target point for the ik solution
    const p_world_desiredEndEffector = this._platformStand
      .getBallJoint()
      .getWorldPosition(new THREE.Vector3());
    const p_world_linkageOrigin = this._servo_Yaw
      .getHorn()
      .getWorldPosition(new THREE.Vector3());
    // calculate a vector pointing from servo horn pivot toward the yaw anchor
    let p_local_desiredEndEffector = new THREE.Vector3();
    p_local_desiredEndEffector.subVectors(
      p_world_desiredEndEffector,
      p_world_linkageOrigin
    );
    // Only consider 2d plane
    p_local_desiredEndEffector = new THREE.Vector2(
      -p_local_desiredEndEffector.z,
      -p_local_desiredEndEffector.x
    );
    let ikSolns = solveIk2JointPlanar(p_local_desiredEndEffector, a1, a2);
    let q = ikSolns[0]["q2"];
    return q;
  }

  updateServos() {
    // Animate servo horns
    this._servo_PitchRoll_left
      .getHorn()
      .setRotationFromAxisAngle(pos_yAxis, this.getServoAngle_Left());
    this._servo_PitchRoll_left
      .getHorn()
      .getBallJoint()
      .lookAt(
        this._platform.getBallJointLeft().getWorldPosition(new THREE.Vector3())
      );

    this._servo_PitchRoll_right
      .getHorn()
      .setRotationFromAxisAngle(pos_yAxis, this.getServoAngle_Right());
    this._servo_PitchRoll_right
      .getHorn()
      .getBallJoint()
      .lookAt(
        this._platform.getBallJointRight().getWorldPosition(new THREE.Vector3())
      );

    this._servo_Yaw
      .getHorn()
      .setRotationFromAxisAngle(pos_yAxis, this.getYawServoAngle());

    this._servo_Yaw
      .getHorn()
      .getBallJoint()
      .lookAt(
        this._platformStand.getBallJoint().getWorldPosition(new THREE.Vector3())
      );
  }

  simulateMotion() {
    let t = this._clock.getElapsedTime();

    // oscillate roll pitch and yaw within desired ranges
    let yawRange = Math.PI / 10;
    let pitchRange = Math.PI / 20;
    let rollRange = Math.PI / 30;

    this.setFinalOrientation(
      sinBetween(yawRange, -yawRange, t, 0.5), // yaw
      sinBetween(pitchRange, -pitchRange, 0.5 * t, 0.5), // pitch
      sinBetween(rollRange, -rollRange, t, 5) // roll
    );
  }

  setFinalOrientation(yaw, pitch, roll) {
    // YAW (accomplished by rotating the platform stand)
    this._platformStand.setRotationFromAxisAngle(pos_yAxis, yaw);
    // Orient the platform stand ball joint
    this._platformStand
      .getBallJoint()
      .lookAt(
        this._servo_Yaw
          .getHorn()
          .getBallJoint()
          .getWorldPosition(new THREE.Vector3())
      );

    // PITCH + Roll (accomplished by rotating the platform)
    this._platform.setRotationFromEuler(new THREE.Euler(pitch, 0, roll, "XYZ"));

    // Orient the platform ball joints
    this._platform
      .getBallJointLeft()
      .lookAt(
        this._servo_PitchRoll_left
          .getHorn()
          .getBallJoint()
          .getWorldPosition(new THREE.Vector3())
      );
    this._platform
      .getBallJointRight()
      .lookAt(
        this._servo_PitchRoll_right
          .getHorn()
          .getBallJoint()
          .getWorldPosition(new THREE.Vector3())
      );
  }

  trackTarget(targetWorldPosition) {
    const sourcePoint = this._platform.getWorldPosition(new THREE.Vector3());
    const lookAtOrientation = new THREE.Euler().setFromRotationMatrix(
      new THREE.Matrix4().lookAt(
        sourcePoint, // eye
        targetWorldPosition, // center
        pos_yAxis // up vector
      )
    );
    this.setFinalOrientation(
      -lookAtOrientation.y, // yaw
      Math.PI + lookAtOrientation.x, // pitch
      Math.PI + lookAtOrientation.z // roll
    );
  }

  animate() {
    this.updateServos();
  }
}

class Base extends THREE.Group {
  constructor() {
    super();
    const material = new THREE.MeshPhongMaterial({
      color: 0xaaaaaa,
      specular: 0x111111,
      shininess: 200,
      opacity: 0.5,
      transparent: true,
    });
    let _self = this;
    loader.load(
      process.env.PUBLIC_URL + "/models/wheatley/skeleton.stl",
      function (geometry) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.set(-Math.PI / 2, 0, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        _self.add(mesh);
      }
    );
  }
}

// PlatformStand (Class): A StewartSimulator Mechanical Module class.
//   Represents a platform stand.
class PlatformStand extends THREE.Group {
  constructor(
    long_dist_ball_joint,
    lat_dist_ball_joint,
    vertical_dist_ball_joint
  ) {
    super();
    let _self = this;
    // Yaw rod mesh
    const material = new THREE.MeshPhongMaterial({
      color: 0xaaaaaa,
      specular: 0x111111,
      shininess: 200,
      opacity: 0.5,
      transparent: true,
    });
    loader.load(
      process.env.PUBLIC_URL + "/models/wheatley/yaw_rod.stl",
      function (geometry) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.set(-Math.PI / 2, 0, 0);
        _self.add(mesh);
      }
    );
    // Linkage Mount
    loader.load(
      process.env.PUBLIC_URL + "/models/wheatley/yaw_rod_mount.stl",
      function (geometry) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.set(-Math.PI / 2, 0, 0);
        _self.add(mesh);
      }
    );
    // Ball Joint
    this._ballJoint = new BallJoint();
    _self._ballJoint.position.set(
      lat_dist_ball_joint,
      vertical_dist_ball_joint,
      long_dist_ball_joint
    );
    this.add(this._ballJoint);
    this.add(new THREE.AxesHelper(15));
  }

  getBallJoint() {
    return this._ballJoint;
  }
}

// Platform (Class): A StewartSimulator Mechanical Module class.
//   Represents a platform.
class Platform extends THREE.Group {
  constructor(
    dist_plat_ball_joint_long,
    dist_plat_ball_joint_lat,
    dist_plat_ball_joint_vert
  ) {
    super();
    let _self = this;
    // Mesh
    const material = new THREE.MeshPhongMaterial({
      color: 0xaaaaaa,
      specular: 0x111111,
      shininess: 200,
      opacity: 0.5,
      transparent: true,
    });
    loader.load(
      process.env.PUBLIC_URL + "/models/wheatley/center_platform.stl",
      function (geometry) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.set(-Math.PI / 2, 0, 0);
        _self.add(mesh);
      }
    );

    // create children
    this._ballJoint_left = new BallJoint();
    this._ballJoint_left.position.set(
      dist_plat_ball_joint_lat,
      dist_plat_ball_joint_vert,
      dist_plat_ball_joint_long
    );
    this.add(this._ballJoint_left);

    this._ballJoint_right = new BallJoint();
    this._ballJoint_right.position.set(
      -dist_plat_ball_joint_lat,
      dist_plat_ball_joint_vert,
      dist_plat_ball_joint_long
    );
    this.add(this._ballJoint_right);

    this.add(new THREE.AxesHelper(30));
  }

  getBallJointLeft() {
    return this._ballJoint_left;
  }

  getBallJointRight() {
    return this._ballJoint_right;
  }
}

// Servo (Class): A StewartSimulator Mechanical Module class.
//   Represents a servo.
class Servo extends THREE.Group {
  constructor(servoHornLength, modelName = "s3003.stl") {
    super();
    // create servo body mesh
    let _self = this;
    const material = new THREE.MeshBasicMaterial({
      color: 0x404040,
      opacity: 0.5,
      transparent: true,
    });
    loader.load(
      process.env.PUBLIC_URL + "/models/servo/" + modelName,
      function (geometry) {
        const mesh = new THREE.Mesh(geometry, material);
        _self.add(mesh);
      }
    );

    // create children
    this._horn = new ServoHorn(servoHornLength);
    // this._horn.position.set(0, 5, 0);
    this.add(this._horn);
    this.add(new THREE.AxesHelper(8));
  }

  getHorn() {
    return this._horn;
  }
}

// ServoHorn (Class): A StewartSimulator Mechanical Module class.
//   Represents a servo horn.
class ServoHorn extends THREE.Group {
  constructor(length) {
    super();

    // create mesh
    let _self = this;
    const material = new THREE.MeshBasicMaterial({
      color: 0xf5f5f5,
      opacity: 0.5,
      transparent: true,
    });
    loader.load(
      process.env.PUBLIC_URL + "/models/horn/MG90s_arm.stl",
      function (geometry) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.set(Math.PI, 0, 0);
        _self.add(mesh);
      }
    );

    this._ballJoint = new BallJoint();
    this._ballJoint.position.set(0, 0, length);
    this.add(this._ballJoint);

    this.add(new THREE.AxesHelper(8));
  }

  getBallJoint() {
    return this._ballJoint;
  }
}

// BallJoint (Class): A StewartSimulator Mechanical Module class.
//  Represents a ball joint.
class BallJoint extends THREE.Group {
  constructor(color = 0x303030) {
    super();

    // create mesh
    let _self = this;
    const material = new THREE.MeshBasicMaterial({
      color: color,
      opacity: 0.5,
      transparent: true,
    });
    loader.load(
      process.env.PUBLIC_URL + "/models/ball-joint/m3_ball_joint.stl",
      function (geometry) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        mesh.rotation.set(-Math.PI / 2, 0, 0);
        let scaleFactor = 0.15;
        mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
        _self.add(mesh);
      }
    );

    this.add(new THREE.AxesHelper(5));
  }
}

function getPointInBetweenByPerc(pointA, pointB, percentage) {
  var dir = pointB.clone().sub(pointA);
  var len = dir.length();
  dir = dir.normalize().multiplyScalar(len * percentage);
  return pointA.clone().add(dir);
}

export { Mechanism };
