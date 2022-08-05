import * as THREE from "three";
import { getEnumDefault } from "./Utils";

function vectorToFixedString(v, fractionDigits = 1) {
    return `${v.x.toFixed(fractionDigits)},${v.y.toFixed(fractionDigits)},${v.z.toFixed(fractionDigits)}`
}

//  Converts radians to degrees 
let rad2Deg = (rad) => {
    return rad * 180 / Math.PI;
}

// Forces range to [0:360) 
let capToAngularRangeDeg = (deg) => {
    deg = deg % 360.0;
    return Math.abs(deg >= 0 ? deg : deg + 360);
}

// Forces range to [0:2PI) 
let capToAngularRangeRad = (rad) => {
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

class MechanismDebugHudComponent {
    constructor() {
        this._isDisposed = false;
        this._mount = null;
        this._visualizer = null;
        this._mechanism = null;

        this._dispServoLeft = null;
        this._dispServoHornLeft = null;
        this._dispPlatformAnchorLeft = null;
        this._dispConnectingRodLeft = null;

        this._dispServoRight = null;
        this._dispServoHornRight = null;
        this._dispPlatformAnchorRight = null;
        this._dispConnectingRodRight = null;

        this._dispServoYaw = null;
        this._dispServoHornYaw = null;
        this._dispPlatformStandAnchorYaw = null
        this._dispConnectingRodYaw = null;

        // this._dispExtra = null;

        this._angleDisplayFormat = getEnumDefault(AngleDisplayFormatEnum);
    }

    dispose() {
        if (this._isDisposed) {
            return;
        }

        this._isDisposed = true;

        [
            this._dispServoLeft,
            this._dispServoHornLeft,
            this._dispPlatformAnchorLeft,
            this._dispConnectingRodLeft,
            this._dispServoRight,
            this._dispServoHornRight,
            this._dispPlatformAnchorRight,
            this._dispConnectingRodRight,
            this._dispServoYaw,
            this._dispServoHornYaw,
            this._dispPlatformStandAnchorYaw,
            this._dispConnectingRodYaw,
            // this._dispExtra,
        ].forEach(elem => {
            this._mount.removeChild(elem);
            elem.remove();
        });

        this._dispServoLeft = null;
        this._dispServoHornLeft = null;
        this._dispPlatformAnchorLeft = null;
        this._dispConnectingRodLeft = null;

        this._dispServoRight = null;
        this._dispServoHornRight = null;
        this._dispPlatformAnchorRight = null;
        this._dispConnectingRodRight = null;

        this._dispServoYaw = null;
        this._dispServoHornYaw = null;
        this._dispPlatformStandAnchorYaw = null
        this._dispConnectingRodYaw = null;


        this._mount = null;
        this._visualizer = null;
        this._mechanism = null;
    }

    init(mount, visualizer) {
        if (this._isDisposed) {
            return;
        }

        this._mount = mount;
        this._visualizer = visualizer;
        this._mechanism = visualizer._mechanism;

        ////////////////////////////////////////////////////////////////////
        this._dispServoLeft = document.createElement("div");
        this._dispServoHornLeft = document.createElement("div");
        this._dispPlatformAnchorLeft = document.createElement("div");
        this._dispConnectingRodLeft = document.createElement("div");

        this._dispServoRight = document.createElement("div");
        this._dispServoHornRight = document.createElement("div");
        this._dispPlatformAnchorRight = document.createElement("div");
        this._dispConnectingRodRight = document.createElement("div");

        this._dispServoYaw = document.createElement("div");
        this._dispServoHornYaw = document.createElement("div");
        this._dispPlatformStandAnchorYaw = document.createElement("div");
        this._dispConnectingRodYaw = document.createElement("div");
        // this._dispExtra = document.createElement("div");

        [
            this._dispServoLeft,
            this._dispServoHornLeft,
            this._dispPlatformAnchorLeft,
            this._dispConnectingRodLeft,
            this._dispServoRight,
            this._dispServoHornRight,
            this._dispPlatformAnchorRight,
            this._dispConnectingRodRight,
            this._dispServoYaw,
            this._dispServoHornYaw,
            this._dispPlatformStandAnchorYaw,
            this._dispConnectingRodYaw,
            // this._dispExtra,
        ].forEach(elem => {
            elem.textContent = "placeholder";
            this._mount.appendChild(elem);
        });
    }

    formatAngle(rad) {
        switch (this._angleDisplayFormat) {
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

    animate() {
        if (this._isDisposed) {
            return;
        }

        ////////////////////////////////////////////////////////////////////
        // update the display text for left and right servo
        this.updateElement(
            this._dispServoLeft,
            this._mechanism.servo_PitchRoll_left.getWorldPosition(new THREE.Vector3()),
            `Rotation: ${this.formatAngle(this._mechanism.getServoAngle_Left())}`
        )
        this.updateElement(
            this._dispServoRight,
            this._mechanism.servo_PitchRoll_right.getWorldPosition(new THREE.Vector3()),
            `Rotation: ${this.formatAngle(this._mechanism.getServoAngle_Right())}`
        )

        ////////////////////////////////////////////////////////////////////
        // update the display text for left and right connecting rods
        this.updateElement(
            this._dispConnectingRodLeft,
            this._mechanism.getConnectingRodMidPoint_Left_WorldPosition(),
            `Len: ${this._mechanism.getConnectingRodLength_Left().toFixed(2)}`
        )
        this.updateElement(
            this._dispConnectingRodRight,
            this._mechanism.getConnectingRodMidPoint_Right_WorldPosition(),
            `Len: ${this._mechanism.getConnectingRodLength_Right().toFixed(2)}`
        )

        ////////////////////////////////////////////////////////////////////
        // update the display text for left and right servo horn anchors
        const hornBjLeft = this._mechanism.servo_PitchRoll_left
            .horn
            .ballJoint
            .getWorldPosition(new THREE.Vector3());
        this.updateElement(
            this._dispServoHornLeft,
            hornBjLeft,
            vectorToFixedString(hornBjLeft)
        )
        const hornBjRight = this._mechanism.servo_PitchRoll_right
            .horn
            .ballJoint
            .getWorldPosition(new THREE.Vector3());
        this.updateElement(
            this._dispServoHornRight,
            hornBjRight,
            vectorToFixedString(hornBjRight)
        )

        ////////////////////////////////////////////////////////////////////
        // update the display text for left and right platform anchors
        const platformAnchorLeft = this._mechanism.platform
            .ballJoint_left
            .getWorldPosition(new THREE.Vector3());
        this.updateElement(
            this._dispPlatformAnchorLeft,
            platformAnchorLeft,
            vectorToFixedString(platformAnchorLeft)
        )
        const platformAnchorRight = this._mechanism.platform
            .ballJoint_right
            .getWorldPosition(new THREE.Vector3());
        this.updateElement(
            this._dispPlatformAnchorRight,
            platformAnchorRight,
            vectorToFixedString(platformAnchorRight)
        )

        ////////////////////////////////////////////////////////////////////
        // update the display text for yaw components
        this.updateElement(
            this._dispServoYaw,
            this._mechanism.servo_Yaw.getWorldPosition(new THREE.Vector3()),
            `Rotation: ${this.formatAngle(this._mechanism.getYawServoAngle())}`
        )
        this.updateElement(
            this._dispConnectingRodYaw,
            this._mechanism.getYawConnectingRodMidPoint_WorldPosition(),
            `Len: ${this._mechanism.getYawConnectingRodLength().toFixed(2)}`
        )
        const hornBjYaw = this._mechanism.servo_Yaw
            .horn
            .ballJoint
            .getWorldPosition(new THREE.Vector3());
        this.updateElement(
            this._dispServoHornYaw,
            hornBjYaw,
            vectorToFixedString(hornBjYaw)
        )
        const platformStandAnchor = this._mechanism.platformStand
            .ballJoint
            .getWorldPosition(new THREE.Vector3());
        this.updateElement(
            this._dispPlatformStandAnchorYaw,
            platformStandAnchor,
            vectorToFixedString(platformStandAnchor)
        )
        ////////////////////////////////////////////////////////////////////
        // this.updateElement(
        //   this._dispExtra,
        //   new THREE.Vector3(),
        //   "origin"
        // )
    }

    updateElement(dispElem, worldPosition, msg) {
        // get the normalized screen coordinate of that position
        // x and y will be in the -1 to +1 range with x = -1 being
        // on the left and y = -1 being on the bottom
        worldPosition.project(this._visualizer._cameraManager.camera);
        // convert the normalized position to CSS coordinates
        const x = (worldPosition.x * .5 + .5) * this._visualizer._width;
        const y = (worldPosition.y * -.5 + .5) * this._visualizer._height;
        // move the elem to that position
        dispElem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
        dispElem.textContent = msg
    }
}

class DebugHUD {
    constructor() {
        this._mount = null;
        this._visualizer = null;
        this._componentsByName = []
    }

    init(mount, visualizer) {
        this._mount = mount;
        this._visualizer = visualizer;
        this.animate();
    }

    hasComponent(name) {
        return name in this._componentsByName;
    }

    addOrReplaceHUDComponentByName(name, component) {
        this.removeHudComponentByName(name);
        component.init(this._mount, this._visualizer)
        this._componentsByName[name] = component;
    }

    removeHudComponentByName(name) {
        if (this.hasComponent(name)) {
            this._componentsByName[name].dispose();
            delete this._componentsByName[name];
        }
    }

    animate() {
        for (const [key, component] of Object.entries(this._componentsByName)) {
            component.animate();
        }
    }
}

export { DebugHUD, MechanismDebugHudComponent };
