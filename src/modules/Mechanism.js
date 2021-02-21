import * as THREE from "three";
import { calcServoAngle } from "./InverseKinematics";
import { sinBetween } from "./Utils";

const DefaultParameters = {
  // platform
  dist_plat_height: 20, // vertical distance between base and platform centers
  dist_plat_ball_joint_long: 25, // longitudinal distance between the platform's center and an anchor
  dist_plat_ball_joint_lat: 10, // lateral distance between the platform's center and an anchor

  // base
  dist_base_servo_long: 20, // longitudinal distance between the base's center and a servo
  dist_base_servo_lat: 20, // lateral distance between the base's center and a servo
  angle_base_servo_mount: Math.PI / 6,

  // servo horn
  length_servo_horn: 12, // distance between servo horn axis of rotation and an anchor

  // connecting rod
  length_connecting_rod: 20.80511073997235 // distance between two ball joints of a connecting rod
};

class Mechanism extends THREE.Group {
  constructor(params) {
    super();

    // read parameters
    this._parameters = params === undefined ? DefaultParameters : params;

    // create children
    this._base = new Base();
    this._platformStand = new PlatformStand(this._parameters.dist_plat_height);
    this._platform = new Platform(
      this._parameters.dist_plat_ball_joint_long,
      this._parameters.dist_plat_ball_joint_lat
    );
    this._servo_PitchRoll_left = new Servo(this._parameters.length_servo_horn);
    this._servo_PitchRoll_right = new Servo(this._parameters.length_servo_horn);

    // Stand -> Platform
    this._platform.position.set(0, this._parameters.dist_plat_height, 0);
    // this._platform.rotateX(Math.PI / 2);
    // this._platform.rotateY(-Math.PI / 2);
    this._platformStand.add(this._platform);

    // Base -> Stand
    this._platformStand.position.set(0, 0, 0);
    this._base.add(this._platformStand);

    // Base -> Servo Left
    this._servo_PitchRoll_left.position.set(
      this._parameters.dist_base_servo_lat,
      0,
      -this._parameters.dist_base_servo_long
    );
    this._servo_PitchRoll_left.rotateX(-Math.PI / 2);
    this._servo_PitchRoll_left.rotateZ(
      -this._parameters.angle_base_servo_mount
    );
    this._base.add(this._servo_PitchRoll_left);

    // Base -> Servo Right
    this._servo_PitchRoll_right.position.set(
      -this._parameters.dist_base_servo_lat,
      0,
      -this._parameters.dist_base_servo_long
    );
    this._servo_PitchRoll_right.rotateX(-Math.PI / 2);
    this._servo_PitchRoll_right.rotateZ(
      this._parameters.angle_base_servo_mount
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
      this._platform
        .getBallJointLeft()
        .getWorldPosition(new THREE.Vector3()),
      0.5
    );
  }

  getConnectingRodMidPoint_Right_WorldPosition() {
    return getPointInBetweenByPerc(
      this._servo_PitchRoll_right
        .getHorn()
        .getBallJoint()
        .getWorldPosition(new THREE.Vector3()), 
      this._platform
        .getBallJointRight()
        .getWorldPosition(new THREE.Vector3()),
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
      this._servo_PitchRoll_left
        .getHorn()
        .getWorldPosition(new THREE.Vector3())
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

  // distance between the center of servo arm rotation and the platform anchor point
  getlDist_Left() {
    return this._servo_PitchRoll_left
      .getHorn()
      .getWorldPosition(new THREE.Vector3())
      .distanceTo(
        this._platform.getBallJointLeft().getWorldPosition(new THREE.Vector3())
      );
  }

  // distance between the center of servo arm rotation and the platform anchor point
  getlDist_Right() {
    return this._servo_PitchRoll_right
      .getHorn()
      .getWorldPosition(new THREE.Vector3())
      .distanceTo(
        this._platform.getBallJointRight().getWorldPosition(new THREE.Vector3())
      );
  }

  // FIXME: currently leveraging a simulated reflection so the math works... 
  // would be nice to resolve for expected coordinate system
  getServoAngle_Left() {
    // base frame vector from origin of base to platform anchor point
    let q = this.getQVec_Left();
    // base frame vector from origin of base to center of servo arm rotation
    let B = this.getBVec_Left();
    // length of servo arm
    let a = this._parameters.length_servo_horn;
    // distance between the center of servo arm rotation and the platform anchor point
    let l = this.getlDist_Left();
    // length of the connecting rod
    let s = this._parameters.length_connecting_rod;
    
    // angle of servo horn plane relative to base x-axis
    let beta = -this._parameters.angle_base_servo_mount;

    // the calculated servo angle (expects vectors with for Z-up)
    return Math.PI + calcServoAngle(
      // simulate reflection of q and B vecs so the math from the flip scenario applies
      new THREE.Vector3(-q.x, q.z, q.y),
      new THREE.Vector3(-B.x, B.z, B.y),
      a,
      l,
      s,
      beta
    );
  }

  getServoAngle_Right() {
    // base frame vector from origin of base to platform anchor point
    let q = this.getQVec_Right();
    // base frame vector from origin of base to center of servo arm rotation
    let B = this.getBVec_Right();
    // length of servo arm
    let a = this._parameters.length_servo_horn;
    // distance between the center of servo arm rotation and the platform anchor point
    let l = this.getlDist_Right();
    // length of the connecting rod
    let s = this._parameters.length_connecting_rod;
    // angle of servo horn plane relative to base x-axis
    let beta = -this._parameters.angle_base_servo_mount;
    // the calculated servo angle (expects vectors with for Z-up)
    return -calcServoAngle(
      new THREE.Vector3(q.x, q.z, q.y),
      new THREE.Vector3(B.x, B.z, B.y),
      a,
      l,
      s,
      beta
    );
  }

  updateServos() {
    // Animate servo horns
    const pos_yAxis = new THREE.Vector3(0, 1, 0);
    this._servo_PitchRoll_left
      .getHorn()
      .setRotationFromAxisAngle(pos_yAxis, this.getServoAngle_Left());

    this._servo_PitchRoll_right
      .getHorn()
      .setRotationFromAxisAngle(pos_yAxis, this.getServoAngle_Right());
  }

  simulateMotion() {
    let t = this._clock.getElapsedTime();

    // YAW (oscillate base)
    let yawRange = Math.PI / 4;
    // PITCH + Roll (oscillate platform)
    let pitchRange = Math.PI / 20;
    let rollRange = Math.PI / 30;

    this.setFinalOrientation(
      sinBetween(yawRange, -yawRange, t, 0.5), // yaw
      sinBetween(pitchRange, -pitchRange, t, 0.5), // pitch
      sinBetween(rollRange, -rollRange, t, 5), // roll
    )
  }

  setFinalOrientation(yaw, pitch, roll) {
    const pos_yAxis = new THREE.Vector3(0, 1, 0);
    // YAW (oscillate base)
    this._base.setRotationFromAxisAngle(
        pos_yAxis,
        yaw
      );

    // PITCH + Roll (oscillate platform)
    this._platform.setRotationFromEuler(
      new THREE.Euler(
        pitch,
        0,
        roll,
        "XYZ"
      )
    );
  }

  trackTarget(target) {
    this._platform.lookAt(target);
  }

  animate() {
    this.updateServos();
  }
}

class Base extends THREE.Mesh {
  constructor() {
    super(
      new THREE.CylinderGeometry(25, 25, 1, 20, 32),
      new THREE.MeshBasicMaterial({ color: 0x595959 })
    );
  }
}

// PlatformStand (Class): A StewartSimulator Mechanical Module class.
//   Represents a platform stand.
class PlatformStand extends THREE.Mesh {
  constructor(height) {
    let geometry = new THREE.CylinderGeometry(4, 4, height, 20, 32);
    geometry.translate(0, height / 2, 0);
    let material = new THREE.MeshBasicMaterial({ color: 0x8150c3 });
    super(geometry, material);
  }
}

// Platform (Class): A StewartSimulator Mechanical Module class.
//   Represents a platform.
class Platform extends THREE.Group {
  constructor(dist_plat_ball_joint_long, dist_plat_ball_joint_lat) {
    super();

    // create self-mesh
    let geometry = new THREE.BoxGeometry(
      dist_plat_ball_joint_lat * 2,
      1,
      dist_plat_ball_joint_long * 2
    );
    let material = new THREE.MeshBasicMaterial({ color: 0x5092c3 });
    let mesh = new THREE.Mesh(geometry, material);
    this.add(mesh);

    // create children
    this._ballJoint_left = new BallJoint(0xff0000);
    this._ballJoint_left.position.set(
      dist_plat_ball_joint_lat,
      0,
      -dist_plat_ball_joint_long
    );
    this.add(this._ballJoint_left);

    this._ballJoint_right = new BallJoint(0x0000ff);
    this._ballJoint_right.position.set(
      -dist_plat_ball_joint_lat,
      0,
      -dist_plat_ball_joint_long
    );
    this.add(this._ballJoint_right);

    this.add(new THREE.AxesHelper(50));
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
  constructor(servoHornLength) {
    super();

    // create servo body mesh
    let mesh = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 4),
      new THREE.MeshBasicMaterial({ color: 0x92c350 })
    );
    this.add(mesh);

    // create children
    this._horn = new ServoHorn(servoHornLength);
    this._horn.position.set(0, 5, 0);
    this.add(this._horn);
    this.add(new THREE.AxesHelper(10));
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
    let geometry = new THREE.BoxGeometry(length, 1, 2);
    geometry.translate(length / 2, 0, 0);
    let material = new THREE.MeshBasicMaterial({ color: 0xff5733 });
    let mesh = new THREE.Mesh(geometry, material);

    this.add(mesh);

    // create children
    this._ball_joint = new BallJoint();
    this._ball_joint.position.set(length, 0, 0);

    this.add(this._ball_joint);
    this.add(new THREE.AxesHelper(10));
  }

  getBallJoint() {
    return this._ball_joint;
  }
}

// BallJoint (Class): A StewartSimulator Mechanical Module class.
//  Represents a ball joint.
class BallJoint extends THREE.Mesh {
  constructor(color = 0xffc0cb) {
    super(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshBasicMaterial({ color: color })
    );
  }
}

function getPointInBetweenByPerc(pointA, pointB, percentage) {
  var dir = pointB.clone().sub(pointA);
  var len = dir.length();
  dir = dir.normalize().multiplyScalar(len*percentage);
  return pointA.clone().add(dir);
}

export { Mechanism };
