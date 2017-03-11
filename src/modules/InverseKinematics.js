/**
 * This is a function.
 *
 * @param {THREE.Vector3} q - base frame vector from origin of base to platform anchor point
 * @param {THREE.Vector3} B - base frame vector from origin of base to center of servo arm rotation
 * @param {number} a - length of servo arm
 * @param {number} l - distance between the center of servo arm rotation and the platform anchor point
 * @param {number} s - length of the connecting rod
 * @param {number} beta - angle of servo horn plane relative to base x-axis
 * @return {number} the calculated servo angle
 */
let calcServoAngle = (q, B, a, l, s, beta) => {
  let L = Math.pow(l, 2) - (Math.pow(s, 2) - Math.pow(a, 2));
  let M = 2 * a * (q.z - B.z);
  let N = 2 * a * (Math.cos(beta) * (q.x - B.x) + Math.sin(beta) * (q.y - B.y));

  return (
    Math.asin(L / Math.sqrt(Math.pow(M, 2) + Math.pow(N, 2))) - Math.atan(N / M)
  );
};

export { calcServoAngle };
