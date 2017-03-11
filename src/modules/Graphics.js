import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OrthographicTrackballControls } from "three/examples/jsm/controls/OrthographicTrackballControls.js";
import { getEnumDefault } from "./Utils";
import { Mechanism } from "./Mechanical";

// const pos_xAxis = new THREE.Vector3(1, 0, 0);
// const neg_xAxis = new THREE.Vector3(-1, 0, 0);
const pos_yAxis = new THREE.Vector3(0, 1, 0);
const neg_yAxis = new THREE.Vector3(0, -1, 0);
const pos_zAxis = new THREE.Vector3(0, 0, 1);
// const neg_zAxis = new THREE.Vector3(0, 0, -1);
// const scene_origin = new THREE.Vector3(0, 0, 0);

const CameraViewEnum = {
  PERSPECTIVE: 1,
  ORTHO_TOP: 2,
  ORTHO_BOTTOM: 3,
  ORTHO_FRONT: 4,
  ORTHO_BACK: 5,
  ORTHO_LEFT: 6,
  ORTHO_RIGHT: 7,

  properties: {
    1: { value: 1, name: "PERSPECTIVE", displayName: "Free Cam" },
    2: { value: 2, name: "ORTHO_TOP", displayName: "Top View" },
    3: { value: 3, name: "ORTHO_BOTTOM", displayName: "Bottom View" },
    4: { value: 4, name: "ORTHO_FRONT", displayName: "Front View" },
    5: { value: 5, name: "ORTHO_BACK", displayName: "Back View" },
    6: { value: 6, name: "ORTHO_LEFT", displayName: "Left View" },
    7: { value: 7, name: "ORTHO_RIGHT", displayName: "Right View" }
  }
};

const BackgroundColorEnum = {
  DARK_BLUE: 1,
  GREY: 2,
  WHITE: 3,

  properties: {
    1: {
      value: 1,
      name: "DARK_BLUE",
      color: 0x151c25,
      displayName: "Dark Blue",
      bIsDefault: true,
      textOverlayColor: { r: 255, g: 255, b: 255, a: 1.0 }
    },
    2: {
      value: 2,
      name: "GREY",
      color: 0xb0b0b0,
      displayName: "Grey",
      bIsDefault: false,
      textOverlayColor: { r: 0, g: 0, b: 0, a: 1.0 }
    },
    3: {
      value: 3,
      name: "WHITE",
      color: 0xffffff,
      displayName: "White",
      bIsDefault: false,
      textOverlayColor: { r: 0, g: 0, b: 0, a: 1.0 }
    }
  }
};

// CameraControlsManager (Class): A StewartSimulator Graphics module class.
// Manages switching between various sets of controls for each view.
class CameraControlsManager {
  constructor(theCameraManager, renderer) {
    this.cameraManager = theCameraManager;
    this.renderer = renderer;
    this.controls = null;
    this.controlsMap = {};
    this.bCameraControlsEnabled = true;
  }

  //update the current camera controls to match the view type specified... create appropriate controls if they don't exist
  updateControlType(theViewType) {
    //if the controls for this view type haven't been initialized, create them
    if (!(theViewType in this.controlsMap)) {
      if (theViewType === CameraViewEnum.PERSPECTIVE) {
        this.controlsMap[theViewType] = new OrbitControls(
          this.cameraManager.camera,
          this.renderer.domElement
        );
        this.controlsMap[theViewType].enableKeys = false;
      } else {
        this.controlsMap[theViewType] = new OrthographicTrackballControls(
          this.cameraManager.camera,
          this.renderer.domElement
        );
        this.controlsMap[theViewType].noRotate = true;
        this.controlsMap[theViewType].zoomSpeed = 0.1;
        this.controlsMap[theViewType].panSpeed = 0.8;
        this.controlsMap[theViewType].staticMoving = true;
        this.controlsMap[theViewType].dynamicDampingFactor = 0.3;
      }
    }

    //special case where the previous and current view types are the same (ie: just resetting the camera)
    if (theViewType === this.cameraManager.previousViewType) {
      this.controls.reset();
      //set the new controls to enabled if not in tool mode
      this.controls.enabled = this.bCameraControlsEnabled;
      return;
    }

    //use the appropriate controls
    this.controls = this.controlsMap[theViewType];
    //reset the appropriate controls
    this.controls.reset();

    //disable the old controls
    let oldViewType = this.cameraManager.previousViewType;
    if (oldViewType in this.controlsMap) {
      this.controlsMap[oldViewType].enabled = false;
    }

    //set the new controls to enabled if not in tool mode
    this.controls.enabled = this.bCameraControlsEnabled;
  }

  toggleCameraControls() {
    //toggle the camera controls
    this.bCameraControlsEnabled = !this.bCameraControlsEnabled;
    //set the enabled property of the current controls
    this.controls.enabled = this.bCameraControlsEnabled;
  }

  setCameraControlsEnabled(bEnabled) {
    this.bCameraControlsEnabled = bEnabled;
    this.controls.enabled = this.bCameraControlsEnabled;
  }

  updateControls() {
    this.controls.update();
  }
}

// CameraManager (Class): A StewartSimulator Graphics module class.
//  Manages switching between various cameras used for different views.
class CameraManager {
  constructor(width, height) {
    this.WIDTH = width;
    this.HEIGHT = height;
    this.camera = null;
    this.currentViewType = null;
    this.previousViewType = null;
    this.orthoCam = null;
    this.perspectiveCam = null;
    this.startingCamDistance = 100;
  }
  //initialize the camera to a perspective view
  initCamera() {
    this.changeCamera(CameraViewEnum.PERSPECTIVE);
  }

  //Switches the camera type and camera pose to match the view type
  changeCamera(theViewType) {
    switch (theViewType) {
      case CameraViewEnum.PERSPECTIVE:
        this.camera = this.createPerspectiveCamera();
        this.camera.up.set(0, 0, 1);
        this.setCameraView(theViewType);
        break;
      default:
        this.camera = this.createOrthographicCamera();
        this.setCameraView(theViewType);
        break;
    }

    this.previousViewType = this.currentViewType;
    this.currentViewType = theViewType;
  }

  //sets the pose of the camera to match the desired view type
  setCameraView(theViewType) {
    this.camera.rotation.set(0, 0, 0);
    switch (theViewType) {
      case CameraViewEnum.PERSPECTIVE:
        this.camera.position.set(0, 0, this.startingCamDistance);
        break;
      case CameraViewEnum.ORTHO_FRONT:
        this.camera.position.set(0, -this.startingCamDistance, 0);
        this.camera.up = pos_zAxis; //set up vectors so that the pan function from the OrthographicTrackballControls will work properly
        this.camera.rotateX(Math.PI / 2);
        break;
      case CameraViewEnum.ORTHO_BACK:
        this.camera.position.set(0, this.startingCamDistance, 0);
        this.camera.up = pos_zAxis;
        this.camera.rotateX(-Math.PI / 2);
        this.camera.rotateZ(Math.PI);
        break;
      case CameraViewEnum.ORTHO_LEFT:
        this.camera.position.set(-this.startingCamDistance, 0, 0);
        this.camera.up = pos_zAxis;
        this.camera.rotateY(-Math.PI / 2);
        this.camera.rotateZ(-Math.PI / 2);
        break;
      case CameraViewEnum.ORTHO_RIGHT:
        this.camera.position.set(this.startingCamDistance, 0, 0);
        this.camera.up = pos_zAxis;
        this.camera.rotateY(Math.PI / 2);
        this.camera.rotateZ(Math.PI / 2);
        break;
      case CameraViewEnum.ORTHO_TOP:
        this.camera.position.set(0, 0, this.startingCamDistance);
        this.camera.up = pos_yAxis;
        break;
      case CameraViewEnum.ORTHO_BOTTOM:
        this.camera.position.set(0, 0, -this.startingCamDistance);
        this.camera.up = neg_yAxis;
        this.camera.rotateX(Math.PI);
        break;
      default:
        break;
    }
  }

  //retrieves the perspective camera or creates one if it doesn't exist
  createPerspectiveCamera() {
    if (!this.perspectiveCam) {
      // set some camera attributes
      let FOV = 90,
        ASPECT = this.WIDTH / this.HEIGHT,
        NEAR = 0.1,
        FAR = 10000;

      this.perspectiveCam = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
    }
    return this.perspectiveCam;
  }

  //retrieves the orthographic camera or creates one if it doesn't exist
  createOrthographicCamera() {
    if (!this.orthoCam) {
      this.orthoCam = new THREE.OrthographicCamera(
        this.WIDTH / -2,
        this.WIDTH / 2,
        this.HEIGHT / 2,
        this.HEIGHT / -2,
        0.1,
        10000
      );
    }
    return this.orthoCam;
  }

  //update the aspect ratio of cameras, for use in the event of a resized window
  updateAspectRatio(theNewWidth, theNewHeight) {
    //note the new dimensions
    this.WIDTH = theNewWidth;
    this.HEIGHT = theNewHeight;

    //update the perspective camera if it's been created
    if (this.perspectiveCam) {
      this.perspectiveCam.aspect = this.WIDTH / this.HEIGHT;
      this.perspectiveCam.updateProjectionMatrix();
    }

    //update the orthographic camera if it's been created
    if (this.orthoCam) {
      this.orthoCam.left = this.WIDTH / -2;
      this.orthoCam.right = this.WIDTH / 2;
      this.orthoCam.top = this.HEIGHT / 2;
      this.orthoCam.bottom = this.HEIGHT / -2;
      this.orthoCam.updateProjectionMatrix();
    }
  }
}

// VisualizerSettings (Class): A StewartSimulator Graphics module class.
//  Maintains all the settings for a visualizer.
class VisualizerSettings {
  constructor() {
    this.currentBackgroundColor = getEnumDefault(BackgroundColorEnum);
    this.distanceScale = 1.0;
  }

  getCurrentBackgroundColorValue() {
    return BackgroundColorEnum.properties[this.currentBackgroundColor].color;
  }

  getDefaultBackgroundColorValue() {
    return BackgroundColorEnum.properties[getEnumDefault(BackgroundColorEnum)]
      .color;
  }

  setBackgroundColor(colorChoice) {
    this.currentBackgroundColor = colorChoice;
  }
}

// Visualizer (Class): A StewartSimulator Graphics module class.
// Manages the graphical visualization of the platform. Uses WebGL via THREE.js
class Visualizer {
  constructor() {
    this._settings = new VisualizerSettings();
    this._clock = new THREE.Clock();
    this._width = null;
    this._height = null;
    this._scene = null;
    this._renderer = null;
    this._mount = null;
    this._cameraManager = null;
    this._cameraControlsManager = null;
    this._mechanism = null;
  }

  init(mount) {
    window.addEventListener("resize", () => this.onCanvasResize(), false);

    this._mount = mount;
    this._width = this._mount.clientWidth;
    this._height = this._mount.clientHeight;

    this._scene = new THREE.Scene();

    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setClearColor(
      this._settings.getDefaultBackgroundColorValue()
    );
    this._renderer.setSize(this._width, this._height);

    this._mount.append(this._renderer.domElement);

    ////////////////////////////////////////////////////////////////////
    //Initialize the camera manager which will manage switching between various camera views
    this._cameraManager = new CameraManager(this._width, this._height);
    this._cameraManager.initCamera();
    this._scene.add(this._cameraManager.camera);

    ////////////////////////////////////////////////////////////////////
    //Initialize the camera controls manager which will manage the controls for each camera view
    this._cameraControlsManager = new CameraControlsManager(
      this._cameraManager,
      this._renderer
    );
    this._cameraControlsManager.updateControlType(
      this._cameraManager.currentViewType
    );

    ////////////////////////////////////////////////////////////////////
    //Initialize the lighting for the scene
    //create an ambient light
    let ambientLight = new THREE.AmbientLight(0xffffff);
    this._scene.add(ambientLight);

    ////////////////////////////////////////////////////////////////////
    //Setup the actual world geometry using the template meshes where appropriate
    //An axis object to visualize the the 3 axes in a simple way.
    //The X axis is red. The Y axis is green. The Z axis is blue.
    let axisHelper = new THREE.AxesHelper(250 * this._settings.distanceScale);
    this._scene.add(axisHelper);

    this.animate();
  }

  addMechanism() {
    if (this._mechanism === undefined || this._mechanism === null) {
      this._mechanism = new Mechanism();
      this._scene.add(this._mechanism.getGroup());
    }
  }

  //Change the camera to the specified view and udpate the controls
  changeView(theViewType) {
    //remove the camera from the scene, change it and then add it back
    this._scene.remove(this._cameraManager.camera);
    this._cameraManager.changeCamera(theViewType);
    this._scene.add(this._cameraManager.camera);

    //update the camera controls
    this._cameraControlsManager.updateControlType(theViewType);
  }

  //update the canvas and camera whenever the window is resized
  onCanvasResize() {
    //retrieve the new dimensions of the canvas' parent div
    this._width = this._mount.clientWidth;
    this._height = this._mount.clientHeight;

    //update the aspect ratio of the cameras
    this._cameraManager.updateAspectRatio(this._width, this._height);

    //update the size of the canvas to fill its parent div
    this._renderer.setSize(this._width, this._height);
  }

  //Change the background color settings
  changeBackgroundColor(theBackgroundColor) {
    this._settings.setBackgroundColor(theBackgroundColor);
    this.updateBackgroundColor();
  }

  //Update the visibility of the new background color
  updateBackgroundColor() {
    let newColorVal = this._settings.getCurrentBackgroundColorValue();
    this._renderer.setClearColor(newColorVal);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    //update the controls
    if (this._cameraControlsManager.bCameraControlsEnabled) {
      this._cameraControlsManager.updateControls();
    }

    this.updateMechanism();

    this.render();
  }

  sinBetween(min, max, t, speed = 1.0) {
    let halfRange = (max - min) / 2;
    return min + halfRange + Math.sin(speed * t) * halfRange;
  }

  updateMechanism() {
    if (this._mechanism == null || this._mechanism === undefined) {
      return;
    }

    let t = this._clock.getElapsedTime();

    // YAW (oscillate base)
    // let yawRange = Math.PI / 4;
    // this._mechanism
    //   .getGroup()
    //   .setRotationFromAxisAngle(
    //     pos_zAxis,
    //     this.sinBetween(yawRange, -yawRange, t, 0.5)
    //   );

    // PITCH + Roll (oscillate platform)
    let pitchRange = Math.PI / 20;
    let rollRange = Math.PI / 30;
    this._mechanism._base._platform_stand._platform
      .getGroup()
      .setRotationFromEuler(
        new THREE.Euler(
          this.sinBetween(rollRange, -rollRange, t, 5),
          this.sinBetween(pitchRange, -pitchRange, t, 0.5),
          0,
          "XYZ"
        )
      );

    // Animate servo horns
    let angleServoLeft = this._mechanism.getServoAngle_Left();
    this._mechanism._base._servo_PitchRoll_left._horn
      .getGroup()
      .setRotationFromAxisAngle(pos_yAxis, angleServoLeft);

    let angleServoRight = this._mechanism.getServoAngle_Right();
    this._mechanism._base._servo_PitchRoll_right._horn
      .getGroup()
      .setRotationFromAxisAngle(pos_yAxis, -angleServoRight);
  }

  render() {
    this._renderer.render(this._scene, this._cameraManager.camera);
  }
}
export { Visualizer, BackgroundColorEnum, CameraViewEnum };
