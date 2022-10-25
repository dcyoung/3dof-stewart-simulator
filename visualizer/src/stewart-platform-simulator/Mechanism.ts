import { Clock, Euler, Group, Matrix4, Vector2, Vector3 } from 'three';
import { calcServoAngle, solveIk2JointPlanar } from './InverseKinematics';
import { lerpVector, sinBetween } from './Utils';

const pos_yAxis = new Vector3(0, 1, 0);

/**
 * Parameters describing the layout of a 3DOF stewart platform
 */
class MechanismParameters3Dof {
  /**
   * the position of the platform's right anchor/balljoint relative to the platform's pivot center
   * This is one of two balljoints used to control pitch/roll.
   * x,y,z = lat, vert, long distance
   */
  public readonly local_position_plat_ball_joint_right: Vector3;
  /**
   * the position of the platform's left anchor/balljoint relative to the platform's pivot center
   * This is one of two balljoints used to control pitch/roll.
   * x,y,z = lat, vert, long distance
   */
  public readonly local_position_plat_ball_joint_left: Vector3;
  /**
   * the position of the anchor/balljoint relative to the platform stand (yaw rod)'s center
   * This is the balljoint used to control yaw.
   * x,y,z = lat, vert, long distance
   */
  public readonly local_position_plat_stand_ball_joint: Vector3;
  /**
   * Position of the right pitch-roll servo relative to mechanism's origin (ie: main pivot, center of rotation)
   * x,y,z = lat, vert, long distance
   */
  public readonly local_position_servo_pitch_roll_right: Vector3;
  /**
   * Position of the left pitch-roll servo relative to mechanism's origin (ie: main pivot, center of rotation)
   * x,y,z = lat, vert, long distance
   */
  public readonly local_position_servo_pitch_roll_left: Vector3;
  /**
   * Mount angle of the right pitch-roll servo
   */
  public readonly mount_angle_servo_pitch_roll_right: number;
  /**
   * Mount angle of the left pitch-roll servo
   */
  public readonly mount_angle_servo_pitch_roll_left: number;
  /**
   * The length of a servo horn on a pitch roll servo.
   * That is distance between servo horn axis of rotation and end anchor
   */
  public readonly length_servo_horn_pitch_roll: number;
  /**
   * Distance between two ball joints of a connecting rod
   */
  public readonly length_connecting_rod_pitch_roll: number;
  /**
   * Position of the yaw servo relative to mechanism's origin (ie: main pivot, center of rotation)
   * x,y,z = lat, vert, long distance
   */
  public readonly local_position_servo_yaw: Vector3;
  /**
   * Mount angle of the yaw servo
   */
  public readonly mount_angle_servo_yaw: number;
  /**
   * The length of a servo horn on the yaw servo.
   * That is distance between servo horn axis of rotation and end anchor
   */
  public readonly length_servo_horn_yaw: number;
  /**
   *  Distance between two ball joints of a connecting rod
   */
  public readonly length_connecting_rod_yaw: number;

  /**
   * Parameters for a 3dof mechanism
   * @param local_position_plat_ball_joint_right - the position of the platform's right anchor/balljoint relative to the platform's pivot center
   * @param local_position_plat_ball_joint_left - the position of the platform's left anchor/balljoint relative to the platform's pivot center
   * @param local_position_plat_stand_ball_joint - the position of the anchor/balljoint relative to the platform stand (yaw rod)'s center
   * @param local_position_servo_pitch_roll_right - Position of the right pitch-roll servo relative to mechanism's origin (ie: main pivot, center of rotation)
   * @param local_position_servo_pitch_roll_left - Position of the left pitch-roll servo relative to mechanism's origin (ie: main pivot, center of rotation)
   * @param mount_angle_servo_pitch_roll_right - Mount angle of the right pitch-roll servo
   * @param mount_angle_servo_pitch_roll_left - Mount angle of the left pitch-roll servo
   * @param length_servo_horn_pitch_roll - The length of a servo horn on a pitch roll servo. That is distance between servo horn axis of rotation and end anchor
   * @param length_connecting_rod_pitch_roll - Distance between two ball joints of a connecting rod
   * @param local_position_servo_yaw - Position of the yaw servo relative to mechanism's origin (ie: main pivot, center of rotation)
   * @param mount_angle_servo_yaw - Mount angle of the yaw servo
   * @param length_servo_horn_yaw - The length of a servo horn on the yaw servo. That is distance between servo horn axis of rotation and end anchor
   * @param length_connecting_rod_yaw - Distance between two ball joints of a connecting rod
   */
  constructor(
    local_position_plat_ball_joint_right: Vector3 = new Vector3(
      -35.6235,
      0,
      -29.9974
    ),
    local_position_plat_ball_joint_left: Vector3 = new Vector3(
      35.6235,
      0,
      -29.9974
    ),
    local_position_plat_stand_ball_joint: Vector3 = new Vector3(
      0,
      -47.4726,
      -8.636
    ),
    local_position_servo_pitch_roll_right: Vector3 = new Vector3(
      -10.7442,
      -28.2194,
      -29.9974
    ),
    local_position_servo_pitch_roll_left: Vector3 = new Vector3(
      10.7442,
      -28.2194,
      -29.9974
    ),
    mount_angle_servo_pitch_roll_right = 0,
    mount_angle_servo_pitch_roll_left = 0,
    length_servo_horn_pitch_roll = 24.8793,
    length_connecting_rod_pitch_roll = 28.2194,
    local_position_servo_yaw: Vector3 = new Vector3(
      -25.2222,
      -47.4726,
      5.461
    ),
    mount_angle_servo_yaw: number = Math.PI / 2,
    length_servo_horn_yaw = 14.097,
    length_connecting_rod_yaw = 25.2222
  ) {
    this.local_position_plat_ball_joint_right =
      local_position_plat_ball_joint_right;
    this.local_position_plat_ball_joint_left =
      local_position_plat_ball_joint_left;
    this.local_position_plat_stand_ball_joint =
      local_position_plat_stand_ball_joint;
    this.local_position_servo_pitch_roll_right =
      local_position_servo_pitch_roll_right;
    this.local_position_servo_pitch_roll_left =
      local_position_servo_pitch_roll_left;
    this.mount_angle_servo_pitch_roll_right =
      mount_angle_servo_pitch_roll_right;
    this.mount_angle_servo_pitch_roll_left = mount_angle_servo_pitch_roll_left;
    this.length_servo_horn_pitch_roll = length_servo_horn_pitch_roll;
    this.length_connecting_rod_pitch_roll = length_connecting_rod_pitch_roll;
    this.local_position_servo_yaw = local_position_servo_yaw;
    this.mount_angle_servo_yaw = mount_angle_servo_yaw;
    this.length_servo_horn_yaw = length_servo_horn_yaw;
    this.length_connecting_rod_yaw = length_connecting_rod_yaw;
  }
}

/**
 * Represents a 3DOF stewart platform/parallel motion mechanism.
 */
class Mechanism3Dof extends Group {
  public readonly parameters: MechanismParameters3Dof;
  public readonly base: Base;
  public readonly servo_PitchRoll_left: Servo;
  public readonly servo_PitchRoll_right: Servo;
  public readonly servo_Yaw: Servo;
  public readonly platformStand: PlatformStand;
  public readonly platform: Platform;
  private _clock: Clock;

  constructor(parameters: MechanismParameters3Dof) {
    super();

    // read parameters
    this.parameters = parameters;

    // create children
    this.base = new Base();
    this.servo_PitchRoll_left = new Servo(
      this.parameters.length_servo_horn_pitch_roll
    );
    this.servo_PitchRoll_right = new Servo(
      this.parameters.length_servo_horn_pitch_roll
    );
    this.servo_Yaw = new Servo(this.parameters.length_servo_horn_yaw);
    this.platformStand = new PlatformStand(
      this.parameters.local_position_plat_stand_ball_joint
    );
    this.platform = new Platform(
      this.parameters.local_position_plat_ball_joint_right,
      this.parameters.local_position_plat_ball_joint_left
    );

    // Stand -> Platform
    this.platformStand.add(this.platform);

    // Base -> Stand
    this.platformStand.position.set(0, 0, 0);
    this.base.add(this.platformStand);

    // Base -> Servo Yaw
    this.servo_Yaw.position.copy(this.parameters.local_position_servo_yaw);
    this.servo_Yaw.rotateY(this.parameters.mount_angle_servo_yaw);
    this.base.add(this.servo_Yaw);

    // Base -> Servo Left
    this.servo_PitchRoll_left.position.copy(
      this.parameters.local_position_servo_pitch_roll_left
    );
    this.servo_PitchRoll_left.rotateX(Math.PI / 2);
    this.servo_PitchRoll_left.rotateY(-Math.PI / 2);
    this.servo_PitchRoll_left.rotateX(
      this.parameters.mount_angle_servo_pitch_roll_left
    );
    this.base.add(this.servo_PitchRoll_left);

    // Base -> Servo Right
    this.servo_PitchRoll_right.position.copy(
      this.parameters.local_position_servo_pitch_roll_right
    );
    this.servo_PitchRoll_right.rotateX(Math.PI / 2);
    this.servo_PitchRoll_right.rotateY(-Math.PI / 2);
    this.servo_PitchRoll_right.rotateX(
      this.parameters.mount_angle_servo_pitch_roll_right
    );
    this.base.add(this.servo_PitchRoll_right);

    // Mechanism -> Base
    this.add(this.base);

    // post init
    this.updateMatrixWorld();

    //
    this._clock = new Clock();

    this.setFinalOrientation(0, 0, 0);
    this.updateServos();
  }

  getYawConnectingRodLength(): number {
    return this.servo_Yaw.horn.ballJoint
      .getWorldPosition(new Vector3())
      .distanceTo(
        this.platformStand.ballJoint.getWorldPosition(new Vector3())
      );
  }

  getYawConnectingRodMidPoint_WorldPosition(): Vector3 {
    return lerpVector(
      this.servo_Yaw.horn.ballJoint.getWorldPosition(new Vector3()),
      this.platformStand.ballJoint.getWorldPosition(new Vector3()),
      0.5
    );
  }

  getConnectingRodLength_Left(): number {
    return this.servo_PitchRoll_left.horn.ballJoint
      .getWorldPosition(new Vector3())
      .distanceTo(
        this.platform.ballJoint_left.getWorldPosition(new Vector3())
      );
  }

  getConnectingRodLength_Right(): number {
    return this.servo_PitchRoll_right.horn.ballJoint
      .getWorldPosition(new Vector3())
      .distanceTo(
        this.platform.ballJoint_right.getWorldPosition(new Vector3())
      );
  }

  getConnectingRodMidPoint_Left_WorldPosition(): Vector3 {
    return lerpVector(
      this.servo_PitchRoll_left.horn.ballJoint.getWorldPosition(
        new Vector3()
      ),
      this.platform.ballJoint_left.getWorldPosition(new Vector3()),
      0.5
    );
  }

  getConnectingRodMidPoint_Right_WorldPosition(): Vector3 {
    return lerpVector(
      this.servo_PitchRoll_right.horn.ballJoint.getWorldPosition(
        new Vector3()
      ),
      this.platform.ballJoint_right.getWorldPosition(new Vector3()),
      0.5
    );
  }

  // base frame vector from origin of base to platform anchor point
  getQVec_Left(): Vector3 {
    // initialize with the world position of the platform anchor point
    // then convert the world position to local "base" space
    return this.base.worldToLocal(
      this.platform.ballJoint_left.getWorldPosition(new Vector3())
    );
  }

  // base frame vector from origin of base to platform anchor point
  getQVec_Right(): Vector3 {
    // initialize with the world position of the platform anchor point
    // then convert the world position to local "base" space
    return this.base.worldToLocal(
      this.platform.ballJoint_right.getWorldPosition(new Vector3())
    );
  }

  // base frame vector from origin of base to center of servo arm rotation
  getBVec_Left(): Vector3 {
    // initialize with the world position of the center of servo arm rotation
    // then convert the world position to local "base" space
    return this.base.worldToLocal(
      this.servo_PitchRoll_left.horn.getWorldPosition(new Vector3())
    );
  }

  // base frame vector from origin of base to center of servo arm rotation
  getBVec_Right(): Vector3 {
    // initialize with the world position of the center of servo arm rotation
    // then convert the world position to local "base" space
    return this.base.worldToLocal(
      this.servo_PitchRoll_right.horn.getWorldPosition(new Vector3())
    );
  }

  // FIXME: currently leveraging a simulated reflection so the math works...
  // would be nice to resolve for expected coordinate system
  getServoAngle_Left(): number {
    // base frame vector to desired end effector (platform anchor point)
    const q = this.getQVec_Left();
    // base frame vector to center of servo arm rotation
    const B = this.getBVec_Left();
    // length of servo arm
    const a = this.parameters.length_servo_horn_pitch_roll;
    // length of the connecting rod
    const s = this.parameters.length_connecting_rod_pitch_roll;
    // angle of servo horn plane relative to base forward axis
    const beta = Math.PI + this.parameters.mount_angle_servo_pitch_roll_left;

    // the calculated servo angle (expects vectors with Z-up)
    return (
      Math.PI +
      calcServoAngle(
        // simulate reflection of q and B vecs so the math from the flip scenario applies
        new Vector3(-q.x, q.z, q.y),
        new Vector3(-B.x, B.z, B.y),
        a,
        s,
        beta
      )
    );
  }

  getServoAngle_Right(): number {
    // base frame vector to desired end effector (platform anchor point)
    const q = this.getQVec_Right();
    // base frame vector to center of servo arm rotation
    const B = this.getBVec_Right();
    // length of servo arm
    const a = this.parameters.length_servo_horn_pitch_roll;
    // length of the connecting rod
    const s = this.parameters.length_connecting_rod_pitch_roll;
    // angle of servo horn plane relative to base forward axis
    const beta = Math.PI + this.parameters.mount_angle_servo_pitch_roll_right;
    // the calculated servo angle (expects vectors with Z-up)
    return -calcServoAngle(
      new Vector3(q.x, q.z, q.y),
      new Vector3(B.x, B.z, B.y),
      a,
      s,
      beta
    );
  }

  getYawServoAngle(): number {
    const a1 = this.parameters.length_servo_horn_yaw;
    const a2 = this.parameters.length_connecting_rod_yaw;

    // define the position of the target point for the ik solution
    const p_world_desiredEndEffector =
      this.platformStand.ballJoint.getWorldPosition(new Vector3());
    const p_world_linkageOrigin = this.servo_Yaw.horn.getWorldPosition(
      new Vector3()
    );
    // calculate a vector pointing from servo horn pivot toward the yaw anchor
    const p_local_desiredEndEffector = new Vector3();
    p_local_desiredEndEffector.subVectors(
      p_world_desiredEndEffector,
      p_world_linkageOrigin
    );
    const ikSolns = solveIk2JointPlanar(
      // Only consider 2d plane
      new Vector2(
        -p_local_desiredEndEffector.z,
        -p_local_desiredEndEffector.x
      ),
      a1,
      a2
    );
    const q = ikSolns[0]['q2'];
    return q;
  }

  updateServos(): void {
    // Animate servo horns
    this.servo_PitchRoll_left.horn.setRotationFromAxisAngle(
      pos_yAxis,
      this.getServoAngle_Left()
    );
    this.servo_PitchRoll_left.horn.ballJoint.lookAt(
      this.platform.ballJoint_left.getWorldPosition(new Vector3())
    );

    this.servo_PitchRoll_right.horn.setRotationFromAxisAngle(
      pos_yAxis,
      this.getServoAngle_Right()
    );
    this.servo_PitchRoll_right.horn.ballJoint.lookAt(
      this.platform.ballJoint_right.getWorldPosition(new Vector3())
    );

    this.servo_Yaw.horn.setRotationFromAxisAngle(
      pos_yAxis,
      this.getYawServoAngle()
    );

    this.servo_Yaw.horn.ballJoint.lookAt(
      this.platformStand.ballJoint.getWorldPosition(new Vector3())
    );
  }

  simulateMotion(): void {
    const t = this._clock.getElapsedTime();

    // oscillate roll pitch and yaw within desired ranges
    const yawRange = Math.PI / 10;
    const pitchRange = Math.PI / 20;
    const rollRange = Math.PI / 30;

    this.setFinalOrientation(
      sinBetween(yawRange, -yawRange, t, 0.5), // yaw
      sinBetween(pitchRange, -pitchRange, 0.5 * t, 0.5), // pitch
      sinBetween(rollRange, -rollRange, t, 5) // roll
    );
  }

  setFinalOrientation(yaw: number, pitch: number, roll: number): void {
    // YAW (accomplished by rotating the platform stand)
    this.platformStand.setRotationFromAxisAngle(pos_yAxis, yaw);
    // Orient the platform stand ball joint
    this.platformStand.ballJoint.lookAt(
      this.servo_Yaw.horn.ballJoint.getWorldPosition(new Vector3())
    );

    // PITCH + Roll (accomplished by rotating the platform)
    this.platform.setRotationFromEuler(new Euler(pitch, 0, roll, 'XYZ'));

    // Orient the platform ball joints
    this.platform.ballJoint_left.lookAt(
      this.servo_PitchRoll_left.horn.ballJoint.getWorldPosition(
        new Vector3()
      )
    );
    this.platform.ballJoint_right.lookAt(
      this.servo_PitchRoll_right.horn.ballJoint.getWorldPosition(
        new Vector3()
      )
    );
  }

  trackTarget(targetWorldPosition: Vector3): void {
    const sourcePoint = this.platform.getWorldPosition(new Vector3());
    const lookAtOrientation = new Euler().setFromRotationMatrix(
      new Matrix4().lookAt(
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

  animate(): void {
    this.updateServos();
  }
}

class Base extends Group { }

/**
 * Represents a platform stand/yaw rod in a mechanism
 */
class PlatformStand extends Group {
  public readonly ballJoint: BallJoint;
  constructor(local_position_ball_joint: Vector3) {
    super();
    // Ball Joint
    this.ballJoint = new BallJoint();
    this.ballJoint.position.copy(local_position_ball_joint);
    this.add(this.ballJoint);
  }
}

/**
 * Represents a platform in a mechanism
 */
class Platform extends Group {
  public readonly ballJoint_left: BallJoint;
  public readonly ballJoint_right: BallJoint;
  constructor(
    local_position_ball_joint_right: Vector3,
    local_position_ball_joint_left: Vector3
  ) {
    super();

    // create children
    this.ballJoint_left = new BallJoint();
    this.ballJoint_left.position.copy(local_position_ball_joint_left);
    this.add(this.ballJoint_left);

    this.ballJoint_right = new BallJoint();
    this.ballJoint_right.position.copy(local_position_ball_joint_right);
    this.add(this.ballJoint_right);
  }
}

/**
 * Represents a servo
 */
class Servo extends Group {
  public readonly horn: ServoHorn;

  constructor(servoHornLength: number) {
    super();
    // create children
    this.horn = new ServoHorn(servoHornLength);
    // this.horn.position.set(0, 5, 0);
    this.add(this.horn);
  }
}

/**
 * Represents a servo horn
 */
class ServoHorn extends Group {
  public readonly ballJoint: BallJoint;
  constructor(length: number) {
    super();

    this.ballJoint = new BallJoint();
    this.ballJoint.position.set(0, 0, length);
    this.add(this.ballJoint);
  }
}

/**
 * Represents a balljoint/anchor
 */
class BallJoint extends Group { }

export { Mechanism3Dof, MechanismParameters3Dof };
