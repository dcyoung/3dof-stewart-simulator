import * as THREE from "three";
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { calcServoAngle, solveIk2JointPlanar } from "./InverseKinematics";
import { sinBetween } from "./Utils";

const loader = new STLLoader();
const pos_yAxis = new THREE.Vector3(0, 1, 0);

const DefaultParameters = {
  ////////////////////////////////////////////////////////////////////
  // platform
  dist_plat_height: 20, // vertical distance between base and platform centers
  dist_plat_ball_joint_long: 25, // longitudinal distance between the platform's center and an anchor
  dist_plat_ball_joint_lat: 10, // lateral distance between the platform's center and an anchor

  ////////////////////////////////////////////////////////////////////
  // pitch roll servos, relative to base
  long_dist_base_2_servo_pitch_roll: 20, // longitudinal distance between the base's center and a pitch roll servo
  lat_dist_base_2_servo_pitch_roll: 20, // lateral distance between the base's center and a pitch roll servo
  angle_base_2_servo_pitch_roll_mount: Math.PI / 6, // mount angle of the pitch roll servo

  // servo horn
  length_servo_horn_pitch_roll: 12, // distance between servo horn axis of rotation and end anchor

  // connecting rod
  length_connecting_rod_pitch_roll: 20.80511073997235, // distance between two ball joints of a connecting rod

  ////////////////////////////////////////////////////////////////////
  // yaw servo, relative to base
  long_dist_base_2_servo_yaw: 0, // longitudinal distance between the base's center and a pitch roll servo
  lat_dist_base_2_servo_yaw: 10, // lateral distance between the base's center and a pitch roll servo
  angle_base_2_servo_yaw_mount: Math.PI / 2, // mount angle of the yaw servo

  // servo horn
  length_servo_horn_yaw: 8, // distance between servo horn axis of rotation and end anchor

  // connecting rod
  length_connecting_rod_yaw: 10, // distance between two ball joints of a connecting rod

  ////////////////////////////////////////////////////////////////////
  // platform stand
  long_dist_plat_stand_anchor: 8, // longitudinal distance between the platform stand's center and an anchor
  lat_dist_plat_stand_anchor: 0,  // lateral distance between the platform stand's center and an anchor
  vertical_dist_plat_stand_anchor: 5, // vertical distance between the base and platform stand's anchor
};


class Mechanism extends THREE.Group {
  constructor(params) {
    super();

    // read parameters
    this._parameters = params === undefined ? DefaultParameters : params;

    // create children
    this._base = new Base();
    this._servo_PitchRoll_left = new Servo(this._parameters.length_servo_horn_pitch_roll);
    this._servo_PitchRoll_right = new Servo(this._parameters.length_servo_horn_pitch_roll);
    this._servo_Yaw = new Servo(this._parameters.length_servo_horn_yaw);
    this._platformStand = new PlatformStand(
      this._parameters.dist_plat_height,
      this._parameters.long_dist_plat_stand_anchor,
      this._parameters.lat_dist_plat_stand_anchor,
      this._parameters.vertical_dist_plat_stand_anchor,
    );
    this._platform = new Platform(
      this._parameters.dist_plat_ball_joint_long,
      this._parameters.dist_plat_ball_joint_lat,
    );

    // Stand -> Platform
    this._platform.position.set(0, this._parameters.dist_plat_height, 0);
    this._platformStand.add(this._platform);

    // Base -> Stand
    this._platformStand.position.set(0, 0, 0);
    this._base.add(this._platformStand);

    // Base -> Servo Yaw
    this._servo_Yaw.position.set(
      this._parameters.lat_dist_base_2_servo_yaw,
      0,
      this._parameters.long_dist_base_2_servo_yaw
    );
    this._servo_Yaw.rotateY(
      this._parameters.angle_base_2_servo_yaw_mount
    );
    this._base.add(this._servo_Yaw);

    // Base -> Servo Left
    this._servo_PitchRoll_left.position.set(
      this._parameters.lat_dist_base_2_servo_pitch_roll,
      0,
      -this._parameters.long_dist_base_2_servo_pitch_roll
    );
    this._servo_PitchRoll_left.rotateX(-Math.PI / 2);
    this._servo_PitchRoll_left.rotateZ(
      -this._parameters.angle_base_2_servo_pitch_roll_mount
    );
    this._base.add(this._servo_PitchRoll_left);

    // Base -> Servo Right
    this._servo_PitchRoll_right.position.set(
      -this._parameters.lat_dist_base_2_servo_pitch_roll,
      0,
      -this._parameters.long_dist_base_2_servo_pitch_roll
    );
    this._servo_PitchRoll_right.rotateX(-Math.PI / 2);
    this._servo_PitchRoll_right.rotateZ(
      this._parameters.angle_base_2_servo_pitch_roll_mount
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
      this._platformStand
        .getBallJoint()
        .getWorldPosition(new THREE.Vector3()),
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
    let a = this._parameters.length_servo_horn_pitch_roll;
    // distance between the center of servo arm rotation and the platform anchor point
    let l = this.getlDist_Left();
    // length of the connecting rod
    let s = this._parameters.length_connecting_rod_pitch_roll;

    // angle of servo horn plane relative to base x-axis
    let beta = -this._parameters.angle_base_2_servo_pitch_roll_mount;

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
    let a = this._parameters.length_servo_horn_pitch_roll;
    // distance between the center of servo arm rotation and the platform anchor point
    let l = this.getlDist_Right();
    // length of the connecting rod
    let s = this._parameters.length_connecting_rod_pitch_roll;
    // angle of servo horn plane relative to base x-axis
    let beta = -this._parameters.angle_base_2_servo_pitch_roll_mount;
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

  getYawServoAngle() {
    const a1 = this._parameters.length_servo_horn_yaw;
    const a2 = this._parameters.length_connecting_rod_yaw;

    // define the position of the target point for the ik solution
    const p2 = this._platformStand
      .getBallJoint()
      .getWorldPosition(new THREE.Vector3());
    const p1 = this._servo_Yaw
      .getHorn()
      .getWorldPosition(new THREE.Vector3())
    let p = new THREE.Vector3();
    p.subVectors(p2, p1);
    p = new THREE.Vector2(-p.z, -p.x);
    let ikSolns = solveIk2JointPlanar(p, a1, a2);
    let q = ikSolns[0]["q1"];
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
        this._platform
          .getBallJointLeft()
          .getWorldPosition(new THREE.Vector3())
      );

    this._servo_PitchRoll_right
      .getHorn()
      .setRotationFromAxisAngle(pos_yAxis, this.getServoAngle_Right());
    this._servo_PitchRoll_right
      .getHorn()
      .getBallJoint()
      .lookAt(    
        this._platform
          .getBallJointRight()
          .getWorldPosition(new THREE.Vector3())
      );

    this._servo_Yaw
      .getHorn()
      .setRotationFromAxisAngle(pos_yAxis, this.getYawServoAngle());
    
    this._servo_Yaw
      .getHorn()
      .getBallJoint()
      .lookAt(    
        this._platformStand
          .getBallJoint()
          .getWorldPosition(new THREE.Vector3())
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
      sinBetween(rollRange, -rollRange, t, 5), // roll
    )
  }

  setFinalOrientation(yaw, pitch, roll) {
    // YAW (accomplished by rotating the platform stand)
    this._platformStand.setRotationFromAxisAngle(
      pos_yAxis,
      yaw
    );
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
    this._platform.setRotationFromEuler(
      new THREE.Euler(
        pitch,
        0,
        roll,
        "XYZ"
      )
    );

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
    const lookAtOrientation = new THREE.Euler()
      .setFromRotationMatrix(
        new THREE.Matrix4()
          .lookAt(
            sourcePoint,        // eye 
            targetWorldPosition,// center
            pos_yAxis,          // up vector
          )
      );
    this.setFinalOrientation(
      - lookAtOrientation.y, // yaw 
      Math.PI + lookAtOrientation.x, // pitch
      Math.PI + lookAtOrientation.z // roll
    );
  }

  animate() {
    this.updateServos();
  }
}

class Base extends THREE.Mesh {
  constructor() {
    super(
      new THREE.CylinderGeometry(25, 25, 1, 20, 32),
      new THREE.MeshBasicMaterial({ color: 0x595959, opacity: 0.25, transparent: true })
    );
  }
}

// PlatformStand (Class): A StewartSimulator Mechanical Module class.
//   Represents a platform stand.
class PlatformStand extends THREE.Mesh {
  constructor(height, long_dist_ball_joint, lat_dist_ball_joint, vertical_dist_ball_joint) {
    // create self-mesh
    let geometry = new THREE.CylinderGeometry(4, 4, height, 20, 32);
    geometry.translate(0, height / 2, 0);
    let material = new THREE.MeshBasicMaterial({ color: 0x8150c3, opacity: 0.5, transparent: true });
    super(geometry, material);

    // create children
    this._ballJoint = new BallJoint();
    this._ballJoint.position.set(
      lat_dist_ball_joint,
      vertical_dist_ball_joint,
      -long_dist_ball_joint
    );
    this.add(this._ballJoint);

    this.add(new THREE.AxesHelper(25));
  }

  getBallJoint() {
    return this._ballJoint;
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
    let material = new THREE.MeshBasicMaterial({ color: 0x5092c3, opacity: 0.5, transparent: true });
    let mesh = new THREE.Mesh(geometry, material);
    this.add(mesh);

    // create children
    this._ballJoint_left = new BallJoint();
    this._ballJoint_left.position.set(
      dist_plat_ball_joint_lat,
      0,
      -dist_plat_ball_joint_long
    );
    this.add(this._ballJoint_left);

    this._ballJoint_right = new BallJoint();
    this._ballJoint_right.position.set(
      -dist_plat_ball_joint_lat,
      0,
      -dist_plat_ball_joint_long
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
  constructor(servoHornLength) {
    super();

    // create servo body mesh
    let _self = this;
    loader.load(process.env.PUBLIC_URL + '/models/servo/MG955.stl', function (geometry) {
      const material = new THREE.MeshBasicMaterial({ color: 0x404040, opacity: 0.5, transparent: true, });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(3.0, 0.0, 0);
      mesh.rotation.set(Math.PI / 2, 0, 0);
      let scaleFactor = 7.5;
      mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
      _self.add(mesh);
    });

    // create children
    this._horn = new ServoHorn(servoHornLength);
    this._horn.position.set(0, 5, 0);
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
    loader.load(process.env.PUBLIC_URL + '/models/horn/MG90s_arm.stl', function (geometry) {
      const material = new THREE.MeshBasicMaterial({ color: 0xF5F5F5, opacity: 0.5, transparent: true, });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      mesh.rotation.set(Math.PI, -Math.PI/2, 0);
      let scaleFactor = 0.75;
      mesh.scale.set(scaleFactor * length / 12.0, scaleFactor, scaleFactor * length / 12.0);
      _self.add(mesh);
    });

    // create children
    this._ball_joint = new BallJoint();
    this._ball_joint.position.set(length, 0, 0);

    this.add(this._ball_joint);
    this.add(new THREE.AxesHelper(8));
  }

  getBallJoint() {
    return this._ball_joint;
  }
}

// BallJoint (Class): A StewartSimulator Mechanical Module class.
//  Represents a ball joint.
class BallJoint extends THREE.Group {
  constructor(color = 0x303030) {
    super();

    // create mesh
    let _self = this;
    loader.load(process.env.PUBLIC_URL + '/models/ball-joint/m3_ball_joint.stl', function (geometry) {
      const material = new THREE.MeshBasicMaterial({ color: color, opacity: 0.5, transparent: true, });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      mesh.rotation.set(-Math.PI/2, 0, 0);
      let scaleFactor = 0.15;
      mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
      _self.add(mesh);
    });

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
