/**
 * Calculates the servo horn angle for a pitch/roll servos
 * using closed form inverse kinematic solution.
 *
 * @param {THREE.Vector3} q - base frame vector pointing to desired end effector (assume z up)
 * @param {THREE.Vector3} B - base frame vector pointing to center of servo arm rotation (assume z up)
 * @param {number} a - length of servo arm
 * @param {number} l - distance between the center of servo arm rotation and the desired end effector
 * @param {number} s - length of the connecting rod
 * @param {number} beta - angle of servo horn plane relative to the forward axis of the base
 * @return {number} the calculated servo angle
 */
let calcServoAngle = (q, B, a, s, beta) => {
  const l = q.distanceTo(B); // dist between the center of servo arm rotation and the desired end effector
  // Compute IK
  let L = Math.pow(l, 2) - (Math.pow(s, 2) - Math.pow(a, 2));
  let M = 2 * a * (q.z - B.z);
  let N = 2 * a * (Math.cos(beta) * (q.x - B.x) + Math.sin(beta) * (q.y - B.y));

  return (
    Math.asin(L / Math.sqrt(Math.pow(M, 2) + Math.pow(N, 2))) - Math.atan(N / M)
  );
};

/**
 * Calculates the 2 possible sets of joint angles for a 2 joint planar linkage
 * using closed form inverse kinematic solution.
 *
 * @param {THREE.Vector2} p - the desired position of the end effector (relative to the linkage origin, ex: servo horn pivot)
 * @param {number} a1 - length of the first linkage arm
 * @param {number} a2 - length of the second linkage arm
 * @return {Array.<{q1: Number, q2: Number}>} the 2 possible combinations of both joint angles (q1 and q2)
 */
let solveIk2JointPlanar = (p, a1, a2) => {
  // soln 1
  let results = []
  let q2 = Math.acos((p.x*p.x + p.y*p.y - a1*a1 - a2*a2)/(2*a1*a2)); 

  let q1 = Math.atan(p.y/p.x) - Math.atan((a2*Math.sin(q2))/(a1 + a2*Math.cos(q2)));
  results.push({"q1": q1,"q2": q2});
  
  // soln 2
  q2 = -q2;
  q1 = Math.atan(p.y/p.x) + Math.atan((a2*Math.sin(q2))/(a1 + a2*Math.cos(q2)));
  results.push({"q1": q1,"q2": q2});
  return results;
};

export { calcServoAngle, solveIk2JointPlanar };
