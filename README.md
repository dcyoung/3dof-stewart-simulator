# 3dof-stewart-simulator

An interactive graphical simulator for the inverse kinematics of a 3DOF stewart platform.

[CLICK HERE FOR A LIVE DEMO](https://dcyoung.github.io/3dof-stewart-simulator/)

---

[![docs/images/motion.gif](docs/images/motion.gif)](https://dcyoung.github.io/3dof-stewart-simulator/)

Also includes HUD support for realtime debug info.

[![docs/images/debug_hud.jpg](docs/images/debug_hud.jpg)](https://dcyoung.github.io/3dof-stewart-simulator/)

## Quickstart

```bash
git clone https://github.com/dcyoung/3dof-stewart-simulator.git

cd 3dof-stewart-simulator

yarn upgrade
yarn start

# or alternatively
npm install
npm start
```

## npm package

This repository hosts only the interactive GUI app. The underlying mechanism and simulation is provided in a standalone npm package: [stewart-platform-simulator](https://github.com/dcyoung/stewart-platform-simulator)