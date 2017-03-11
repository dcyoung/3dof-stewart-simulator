import * as THREE from "three";
import { calcServoAngle } from "./InverseKinematics";

const DefaultParameters = {
  // platform
  dist_plat_height: 20, // vertical distance between base and platform centers
  dist_plat_ball_joint_long: 25, // longitudinal distance between the platform's center and an anchor
  dist_plat_ball_joint_lat: 10, // lateral distance between the platform's center and an anchor

  // base
  dist_base_servo_long: 20, // longitudinal distance between the base's center and a servo
  dist_base_servo_lat: 20, // lateral distance between the base's center and a servo
  angle_base_servo_mount: Math.PI / 3,

  // servo horn
  length_servo_horn: 12, // distance between servo horn axis of rotation and an anchor

  // connecting rod
  length_connecting_rod: 20.80511073997235 // distance between two ball joints of a connecting rod
};

// Mechanism (Class): A StewartSimulator Mechanical module class.
//  Represents a mechanism.
class Mechanism {
  constructor(params) {
    // read parameters
    this._parameters =
      typeof params === "undefined" ? DefaultParameters : params;

    // create self object
    this._group = new THREE.Group();

    // create children
    this._base = null;
    this.initBase();
    // this.initServoYaw();

    this.postInit();
  }

  initBase() {
    this._base = new Base(this._parameters);
    // Pose:
    this._base.getGroup().position.set(0, 0, 0);
    this._base.getGroup().rotateZ(0);

    this._group.add(this._base.getGroup());
  }

  // this.initServoYaw = () => {
  //     this._servo_yaw = new Servo(this._parameters);

  //     // Pose:
  //     this._servo_yaw.getGroup().position.set(-10, 35, 0);
  //     this._servo_yaw.getGroup().rotateX(Math.PI/2);
  //     this._servo_yaw.getGroup().rotateZ(0);

  //     this._group.add(this._servo_yaw.getGroup());
  // };

  postInit() {
    this._group.updateMatrixWorld();
  }

  getConnectingRodLengthLeft() {
    let hornEnd = this._base._servo_PitchRoll_left._horn._ball_joint
      .getGroup()
      .getWorldPosition(new THREE.Vector3());
    let platformAnchor = this._base._platform_stand._platform._ballJoint_left
      .getGroup()
      .getWorldPosition(new THREE.Vector3());
    return hornEnd.distanceTo(platformAnchor);
  }

  // getConnectingRodLengthRight() {
  //   let hornEnd = this._base._servo_PitchRoll_right._horn._ball_joint
  //     .getGroup()
  //     .getWorldPosition(new THREE.Vector3());
  //   let platformAnchor = this._base._platform_stand._platform._ballJoint_right
  //     .getGroup()
  //     .getWorldPosition(new THREE.Vector3());
  //   return hornEnd.distanceTo(platformAnchor);
  // }

  // base frame vector from origin of base to platform anchor point
  getQVec(left = true) {
    let platformAnchorPoint = new THREE.Vector3();
    // initialize with the world position of the platform anchor point
    (left
      ? this._base._platform_stand._platform._ballJoint_left
      : this._base._platform_stand._platform._ballJoint_right
    )
      .getGroup()
      .getWorldPosition(platformAnchorPoint);

    // convert the world position to local "base" space
    this._base.getGroup().worldToLocal(platformAnchorPoint);
    return platformAnchorPoint;
  }

  // base frame vector from origin of base to center of servo arm rotation
  getBVec(left = true) {
    let vec = new THREE.Vector3();
    // initialize with the world position of the center of servo arm rotation
    (left
      ? this._base._servo_PitchRoll_left._horn
      : this._base._servo_PitchRoll_right._horn
    )
      .getGroup()
      .getWorldPosition(vec);

    // convert the world position to local "base" space
    this._base.getGroup().worldToLocal(vec);
    return vec;
  }

  // distance between the center of servo arm rotation and the platform anchor point
  getlDist(left = true) {
    if (left) {
      let hornCenter = this._base._servo_PitchRoll_left._horn
        .getGroup()
        .getWorldPosition(new THREE.Vector3());
      let platformAnchor = this._base._platform_stand._platform._ballJoint_left
        .getGroup()
        .getWorldPosition(new THREE.Vector3());
      return hornCenter.distanceTo(platformAnchor);
    }
    let hornCenter = this._base._servo_PitchRoll_right._horn
      .getGroup()
      .getWorldPosition(new THREE.Vector3());
    let platformAnchor = this._base._platform_stand._platform._ballJoint_right
      .getGroup()
      .getWorldPosition(new THREE.Vector3());
    return hornCenter.distanceTo(platformAnchor);
  }

  getServoAngle_Left() {
    // base frame vector from origin of base to platform anchor point
    let q = this.getQVec(true);
    // base frame vector from origin of base to center of servo arm rotation
    let B = this.getBVec(true);
    // length of servo arm
    let a = this._parameters.length_servo_horn;
    // distance between the center of servo arm rotation and the platform anchor point
    let l = this.getlDist(true);
    // length of the connecting rod
    let s = this._parameters.length_connecting_rod;
    // angle of servo horn plane relative to base x-axis
    let beta = this._parameters.angle_base_servo_mount;
    // the calculated servo angle
    return calcServoAngle(q, B, a, l, s, beta);
  }

  getServoAngle_Right() {
    // base frame vector from origin of base to platform anchor point
    let q = this.getQVec(false);
    // base frame vector from origin of base to center of servo arm rotation
    let B = this.getBVec(false);
    // length of servo arm
    let a = this._parameters.length_servo_horn;
    // distance between the center of servo arm rotation and the platform anchor point
    let l = this.getlDist(false);
    // length of the connecting rod
    let s = this._parameters.length_connecting_rod;
    // angle of servo horn plane relative to base x-axis
    let beta = -this._parameters.angle_base_servo_mount;
    // the calculated servo angle
    return calcServoAngle(q, B, a, l, s, beta);
  }

  getGroup() {
    return this._group;
  }
}

// Base (Class): A StewartSimulator Mechanical module class.
//   Represents a base.
class Base {
  constructor(params) {
    // read params
    this._parameters = params;

    // create self-mesh
    this._geometry = new THREE.CylinderGeometry(25, 25, 1, 20, 32);
    this._geometry.rotateX(Math.PI / 2);
    this._material = new THREE.MeshBasicMaterial({ color: 0x595959 });
    this._mesh = new THREE.Mesh(this._geometry, this._material);

    // create self object
    this._group = new THREE.Group();
    this._group.add(this._mesh);

    // create children
    this._platform_stand = null;
    this._servo_PitchRoll_left = null; // left servo for pitch/roll
    this._servo_PitchRoll_right = null; // right servo for pitch/roll
    this.initPlatformStand();
    this.initServoLeft();
    this.initServoRight();
  }

  initPlatformStand() {
    this._platform_stand = new PlatformStand(this._parameters);
    // Pose:
    this._platform_stand.getGroup().position.set(0, 0, 0);
    // FIXME: rotate
    this._group.add(this._platform_stand.getGroup());
  }

  getRelativePosition(vector) {
    return vector - this._group.getWorldPosition();
  }

  initServoLeft() {
    this._servo_PitchRoll_left = new Servo(this._parameters);
    // Pose:
    this._servo_PitchRoll_left
      .getGroup()
      .position.set(
        this._parameters.dist_base_servo_long,
        -this._parameters.dist_base_servo_lat,
        0
      );
    this._servo_PitchRoll_left.getGroup().rotateX(Math.PI);
    this._servo_PitchRoll_left
      .getGroup()
      .rotateZ(-this._parameters.angle_base_servo_mount);

    this._group.add(this._servo_PitchRoll_left.getGroup());
  }

  initServoRight() {
    this._servo_PitchRoll_right = new Servo(this._parameters);

    // Pose:
    this._servo_PitchRoll_right
      .getGroup()
      .position.set(
        this._parameters.dist_base_servo_long,
        this._parameters.dist_base_servo_lat,
        0
      );
    this._servo_PitchRoll_right.getGroup().rotateX(0);
    this._servo_PitchRoll_right
      .getGroup()
      .rotateZ(-this._parameters.angle_base_servo_mount);

    this._group.add(this._servo_PitchRoll_right.getGroup());
  }

  getGroup() {
    return this._group;
  }
}

// PlatformStand (Class): A StewartSimulator Mechanical Module class.
//   Represents a platform stand.
class PlatformStand {
  constructor(params) {
    // read params
    this._parameters = params;

    // create self-mesh
    this._geometry = new THREE.CylinderGeometry(
      4,
      4,
      this._parameters.dist_plat_height,
      20,
      32
    );
    this._geometry.rotateX(Math.PI / 2);
    this._geometry.translate(0, 0, this._parameters.dist_plat_height / 2);
    this._material = new THREE.MeshBasicMaterial({ color: 0x8150c3 });
    this._mesh = new THREE.Mesh(this._geometry, this._material);

    // create self object
    this._group = new THREE.Group();
    this._group.add(this._mesh);

    // create children
    this._platform = null;
    this.initPlatform();
  }

  initPlatform() {
    this._platform = new Platform(this._parameters);

    // Pose:
    this._platform
      .getGroup()
      .position.set(0, 0, this._parameters.dist_plat_height);
    // FIXME: rotate

    this._group.add(this._platform.getGroup());
  }

  getGroup() {
    return this._group;
  }
}

// Platform (Class): A StewartSimulator Mechanical Module class.
//   Represents a platform.
class Platform {
  constructor(params) {
    // read params
    this._parameters = params;

    // create self-mesh
    this._geometry = new THREE.BoxGeometry(
      this._parameters.dist_plat_ball_joint_long * 2,
      this._parameters.dist_plat_ball_joint_lat * 2,
      1
    );
    this._material = new THREE.MeshBasicMaterial({ color: 0x5092c3 });
    this._mesh = new THREE.Mesh(this._geometry, this._material);

    // create self object
    this._group = new THREE.Group();
    this._group.add(this._mesh);

    // create children
    this._ballJoint_left = null;
    this._ballJoint_right = null;
    this.initBallJointLeft();
    this.initBallJointRight();
  }

  initBallJointLeft() {
    this._ballJoint_left = new BallJoint(this._parameters);

    // Pose:
    this._ballJoint_left
      .getGroup()
      .position.set(
        this._parameters.dist_plat_ball_joint_long,
        -this._parameters.dist_plat_ball_joint_lat,
        0
      );
    // FIXME: rotate

    this._group.add(this._ballJoint_left.getGroup());
  }

  initBallJointRight() {
    this._ballJoint_right = new BallJoint(this._parameters);

    // Pose:
    this._ballJoint_right
      .getGroup()
      .position.set(
        this._parameters.dist_plat_ball_joint_long,
        this._parameters.dist_plat_ball_joint_lat,
        0
      );
    // FIXME: rotate

    this._group.add(this._ballJoint_right.getGroup());
  }

  getGroup() {
    return this._group;
  }
}

// ConnectingArm (Class): A StewartSimulator Mechanical Module class.
//   Represents a connecting arm.
class ConnectingArm {
  constructor(params) {
    this._parameters = params;

    this._group = new THREE.Group();
    // this._geometry = null;
    // this._mesh = null;
    // this._material = null;
  }

  getGroup() {
    return this._group;
  }
}

// Servo (Class): A StewartSimulator Mechanical Module class.
//   Represents a servo.
class Servo {
  constructor(params) {
    // read params
    this._parameters = params;

    // create self-mesh
    this._geometry = new THREE.BoxGeometry(10, 10, 4);
    this._material = new THREE.MeshBasicMaterial({ color: 0x92c350 });
    this._mesh = new THREE.Mesh(this._geometry, this._material);

    // create self object
    this._group = new THREE.Group();
    this._group.add(this._mesh);

    // create children
    this._horn = null;
    this.initHorn();
  }

  initHorn() {
    this._horn = new ServoHorn(this._parameters);

    // Pose:
    this._horn.getGroup().position.set(0, 5, 0);
    // FIXME: rotate

    this._group.add(this._horn.getGroup());
  }

  getGroup() {
    return this._group;
  }
}

// ServoHorn (Class): A StewartSimulator Mechanical Module class.
//   Represents a servo horn.
class ServoHorn {
  constructor(params) {
    // read params
    this._parameters = params;

    // create self-mesh
    this._geometry = new THREE.BoxGeometry(
      this._parameters.length_servo_horn,
      1,
      2
    );
    this._geometry.translate(this._parameters.length_servo_horn / 2, 0, 0);
    this._material = new THREE.MeshBasicMaterial({ color: 0xff5733 });
    this._mesh = new THREE.Mesh(this._geometry, this._material);

    // create self object
    this._group = new THREE.Group();
    this._group.add(this._mesh);

    // create children
    this._ball_joint = null;
    this.initBallJoint();
  }

  initBallJoint() {
    this._ball_joint = new BallJoint(this._parameters);

    // Pose:
    this._ball_joint
      .getGroup()
      .position.set(this._parameters.length_servo_horn, 0, 0);
    // FIXME: rotate

    this._group.add(this._ball_joint.getGroup());
  }

  getGroup() {
    return this._group;
  }
}

// BallJoint (Class): A StewartSimulator Mechanical Module class.
//  Represents a ball joint.
class BallJoint {
  constructor(params) {
    // read params
    this._parameters = params;

    // create self-mesh
    this._geometry = new THREE.SphereGeometry(0.5, 32, 32);
    this._material = new THREE.MeshBasicMaterial({ color: 0xffc0cb });
    this._mesh = new THREE.Mesh(this._geometry, this._material);

    // create self object
    this._group = new THREE.Group();
    this._group.add(this._mesh);
  }

  getGroup() {
    return this._group;
  }
}

export { Mechanism };
