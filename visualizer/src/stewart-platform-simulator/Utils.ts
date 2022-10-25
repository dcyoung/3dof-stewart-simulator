import { Vector3 } from 'three';

function lerpVector(
  a: Vector3,
  b: Vector3,
  normValue: number
): Vector3 {
  let dir = b.clone().sub(a);
  const len = dir.length();
  dir = dir.normalize().multiplyScalar(len * normValue);
  return a.clone().add(dir);
}

function sinBetween(min: number, max: number, t: number, speed = 1.0): number {
  const halfRange = (max - min) / 2;
  return min + halfRange + Math.sin(speed * t) * halfRange;
}

function sinBetweenVectors(
  a: Vector3,
  b: Vector3,
  t: number,
  speed: number
): Vector3 {
  const normValue = sinBetween(0, 1, t, speed);
  return lerpVector(a, b, normValue);
}

export { lerpVector, sinBetween, sinBetweenVectors };
