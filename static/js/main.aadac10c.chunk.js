(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{103:function(t,e,n){},129:function(t,e,n){"use strict";n.r(e);var i=n(1),a=n.n(i),o=n(17),r=n.n(o),s=(n(88),n(89),n(78)),l=n(31),h=n(3),c=n(4),_=n(2),u=n(5),d=n(0),m=n(75),g=n(76),p=n(77),v=function(t){for(var e in t){if("properties"===e)break;if(t.properties[t[e]].bIsDefault)return t[e]}return null},f=function(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1,a=(e-t)/2;return t+a+Math.sin(i*n)*a},w=n(15),b=n(74),C=function(t,e,n,i,a,o){var r=Math.pow(i,2)-(Math.pow(a,2)-Math.pow(n,2)),s=2*n*(t.z-e.z),l=2*n*(Math.cos(o)*(t.x-e.x)+Math.sin(o)*(t.y-e.y));return Math.asin(r/Math.sqrt(Math.pow(s,2)+Math.pow(l,2)))-Math.atan(l/s)},y=new b.a,R=new d.J(0,1,0),P={dist_plat_height:20,dist_plat_ball_joint_long:25,dist_plat_ball_joint_lat:10,long_dist_base_2_servo_pitch_roll:20,lat_dist_base_2_servo_pitch_roll:20,angle_base_2_servo_pitch_roll_mount:Math.PI/6,length_servo_horn_pitch_roll:12,length_connecting_rod_pitch_roll:20.80511073997235,long_dist_base_2_servo_yaw:0,lat_dist_base_2_servo_yaw:10,angle_base_2_servo_yaw_mount:Math.PI/2,length_servo_horn_yaw:8,length_connecting_rod_yaw:10,long_dist_plat_stand_anchor:8,lat_dist_plat_stand_anchor:0,vertical_dist_plat_stand_anchor:5},k=function(t){Object(h.a)(n,t);var e=Object(c.a)(n);function n(t){var i;return Object(_.a)(this,n),(i=e.call(this))._parameters=void 0===t?P:t,i._base=new O,i._servo_PitchRoll_left=new H(i._parameters.length_servo_horn_pitch_roll),i._servo_PitchRoll_right=new H(i._parameters.length_servo_horn_pitch_roll),i._servo_Yaw=new H(i._parameters.length_servo_horn_yaw),i._platformStand=new E(i._parameters.dist_plat_height,i._parameters.long_dist_plat_stand_anchor,i._parameters.lat_dist_plat_stand_anchor,i._parameters.vertical_dist_plat_stand_anchor),i._platform=new M(i._parameters.dist_plat_ball_joint_long,i._parameters.dist_plat_ball_joint_lat),i._platform.position.set(0,i._parameters.dist_plat_height,0),i._platformStand.add(i._platform),i._platformStand.position.set(0,0,0),i._base.add(i._platformStand),i._servo_Yaw.position.set(i._parameters.lat_dist_base_2_servo_yaw,0,i._parameters.long_dist_base_2_servo_yaw),i._servo_Yaw.rotateY(i._parameters.angle_base_2_servo_yaw_mount),i._base.add(i._servo_Yaw),i._servo_PitchRoll_left.position.set(i._parameters.lat_dist_base_2_servo_pitch_roll,0,-i._parameters.long_dist_base_2_servo_pitch_roll),i._servo_PitchRoll_left.rotateX(-Math.PI/2),i._servo_PitchRoll_left.rotateZ(-i._parameters.angle_base_2_servo_pitch_roll_mount),i._base.add(i._servo_PitchRoll_left),i._servo_PitchRoll_right.position.set(-i._parameters.lat_dist_base_2_servo_pitch_roll,0,-i._parameters.long_dist_base_2_servo_pitch_roll),i._servo_PitchRoll_right.rotateX(-Math.PI/2),i._servo_PitchRoll_right.rotateZ(i._parameters.angle_base_2_servo_pitch_roll_mount),i._base.add(i._servo_PitchRoll_right),i.add(i._base),i.updateMatrixWorld(),i._clock=new d.f,i}return Object(u.a)(n,[{key:"getPlatform",value:function(){return this._platform}},{key:"getBase",value:function(){return this._base}},{key:"getYawConnectingRodLength",value:function(){return this._servo_Yaw.getHorn().getBallJoint().getWorldPosition(new d.J).distanceTo(this._platformStand.getBallJoint().getWorldPosition(new d.J))}},{key:"getYawConnectingRodMidPoint_WorldPosition",value:function(){return S(this._servo_Yaw.getHorn().getBallJoint().getWorldPosition(new d.J),this._platformStand.getBallJoint().getWorldPosition(new d.J),.5)}},{key:"getConnectingRodLength_Left",value:function(){return this._servo_PitchRoll_left.getHorn().getBallJoint().getWorldPosition(new d.J).distanceTo(this._platform.getBallJointLeft().getWorldPosition(new d.J))}},{key:"getConnectingRodLength_Right",value:function(){return this._servo_PitchRoll_right.getHorn().getBallJoint().getWorldPosition(new d.J).distanceTo(this._platform.getBallJointRight().getWorldPosition(new d.J))}},{key:"getConnectingRodMidPoint_Left_WorldPosition",value:function(){return S(this._servo_PitchRoll_left.getHorn().getBallJoint().getWorldPosition(new d.J),this._platform.getBallJointLeft().getWorldPosition(new d.J),.5)}},{key:"getConnectingRodMidPoint_Right_WorldPosition",value:function(){return S(this._servo_PitchRoll_right.getHorn().getBallJoint().getWorldPosition(new d.J),this._platform.getBallJointRight().getWorldPosition(new d.J),.5)}},{key:"getQVec_Left",value:function(){return this._base.worldToLocal(this._platform.getBallJointLeft().getWorldPosition(new d.J))}},{key:"getQVec_Right",value:function(){return this._base.worldToLocal(this._platform.getBallJointRight().getWorldPosition(new d.J))}},{key:"getBVec_Left",value:function(){return this._base.worldToLocal(this._servo_PitchRoll_left.getHorn().getWorldPosition(new d.J))}},{key:"getBVec_Right",value:function(){return this._base.worldToLocal(this._servo_PitchRoll_right.getHorn().getWorldPosition(new d.J))}},{key:"getlDist_Left",value:function(){return this._servo_PitchRoll_left.getHorn().getWorldPosition(new d.J).distanceTo(this._platform.getBallJointLeft().getWorldPosition(new d.J))}},{key:"getlDist_Right",value:function(){return this._servo_PitchRoll_right.getHorn().getWorldPosition(new d.J).distanceTo(this._platform.getBallJointRight().getWorldPosition(new d.J))}},{key:"getServoAngle_Left",value:function(){var t=this.getQVec_Left(),e=this.getBVec_Left(),n=this._parameters.length_servo_horn_pitch_roll,i=this.getlDist_Left(),a=this._parameters.length_connecting_rod_pitch_roll,o=-this._parameters.angle_base_2_servo_pitch_roll_mount;return Math.PI+C(new d.J(-t.x,t.z,t.y),new d.J(-e.x,e.z,e.y),n,i,a,o)}},{key:"getServoAngle_Right",value:function(){var t=this.getQVec_Right(),e=this.getBVec_Right(),n=this._parameters.length_servo_horn_pitch_roll,i=this.getlDist_Right(),a=this._parameters.length_connecting_rod_pitch_roll,o=-this._parameters.angle_base_2_servo_pitch_roll_mount;return-C(new d.J(t.x,t.z,t.y),new d.J(e.x,e.z,e.y),n,i,a,o)}},{key:"getYawServoAngle",value:function(){var t=this._parameters.length_servo_horn_yaw,e=this._parameters.length_connecting_rod_yaw,n=this._platformStand.getBallJoint().getWorldPosition(new d.J),i=this._servo_Yaw.getHorn().getWorldPosition(new d.J),a=new d.J;return a.subVectors(n,i),function(t,e,n){var i=[],a=Math.acos((t.x*t.x+t.y*t.y-e*e-n*n)/(2*e*n)),o=Math.atan(t.y/t.x)-Math.atan(n*Math.sin(a)/(e+n*Math.cos(a)));return i.push({q1:o,q2:a}),a=-a,o=Math.atan(t.y/t.x)+Math.atan(n*Math.sin(a)/(e+n*Math.cos(a))),i.push({q1:o,q2:a}),i}(a=new d.I(-a.z,-a.x),t,e)[0].q1}},{key:"updateServos",value:function(){this._servo_PitchRoll_left.getHorn().setRotationFromAxisAngle(R,this.getServoAngle_Left()),this._servo_PitchRoll_left.getHorn().getBallJoint().lookAt(this._platform.getBallJointLeft().getWorldPosition(new d.J)),this._servo_PitchRoll_right.getHorn().setRotationFromAxisAngle(R,this.getServoAngle_Right()),this._servo_PitchRoll_right.getHorn().getBallJoint().lookAt(this._platform.getBallJointRight().getWorldPosition(new d.J)),this._servo_Yaw.getHorn().setRotationFromAxisAngle(R,this.getYawServoAngle()),this._servo_Yaw.getHorn().getBallJoint().lookAt(this._platformStand.getBallJoint().getWorldPosition(new d.J))}},{key:"simulateMotion",value:function(){var t=this._clock.getElapsedTime(),e=Math.PI/10,n=Math.PI/20,i=Math.PI/30;this.setFinalOrientation(f(e,-e,t,.5),f(n,-n,.5*t,.5),f(i,-i,t,5))}},{key:"setFinalOrientation",value:function(t,e,n){this._platformStand.setRotationFromAxisAngle(R,t),this._platformStand.getBallJoint().lookAt(this._servo_Yaw.getHorn().getBallJoint().getWorldPosition(new d.J)),this._platform.setRotationFromEuler(new d.j(e,0,n,"XYZ")),this._platform.getBallJointLeft().lookAt(this._servo_PitchRoll_left.getHorn().getBallJoint().getWorldPosition(new d.J)),this._platform.getBallJointRight().lookAt(this._servo_PitchRoll_right.getHorn().getBallJoint().getWorldPosition(new d.J))}},{key:"trackTarget",value:function(t){var e=this._platform.getWorldPosition(new d.J),n=(new d.j).setFromRotationMatrix((new d.t).lookAt(e,t,R));this.setFinalOrientation(-n.y,Math.PI+n.x,Math.PI+n.z)}},{key:"animate",value:function(){this.updateServos()}}]),n}(d.n),O=function(t){Object(h.a)(n,t);var e=Object(c.a)(n);function n(){return Object(_.a)(this,n),e.call(this,new d.h(25,25,1,20,32),new d.v({color:5855577,opacity:.25,transparent:!0}))}return n}(d.u),E=function(t){Object(h.a)(n,t);var e=Object(c.a)(n);function n(t,i,a,o){var r;Object(_.a)(this,n);var s=new d.h(4,4,t,20,32);s.translate(0,t/2,0);var l=new d.v({color:8474819,opacity:.5,transparent:!0});return(r=e.call(this,s,l))._ballJoint=new T,r._ballJoint.position.set(a,o,-i),r.add(r._ballJoint),r.add(new d.b(25)),r}return Object(u.a)(n,[{key:"getBallJoint",value:function(){return this._ballJoint}}]),n}(d.u),M=function(t){Object(h.a)(n,t);var e=Object(c.a)(n);function n(t,i){var a;Object(_.a)(this,n),a=e.call(this);var o=new d.c(2*i,1,2*t),r=new d.v({color:5280451,opacity:.5,transparent:!0}),s=new d.u(o,r);return a.add(s),a._ballJoint_left=new T,a._ballJoint_left.position.set(i,0,-t),a.add(a._ballJoint_left),a._ballJoint_right=new T,a._ballJoint_right.position.set(-i,0,-t),a.add(a._ballJoint_right),a.add(new d.b(30)),a}return Object(u.a)(n,[{key:"getBallJointLeft",value:function(){return this._ballJoint_left}},{key:"getBallJointRight",value:function(){return this._ballJoint_right}}]),n}(d.n),H=function(t){Object(h.a)(n,t);var e=Object(c.a)(n);function n(t){var i;Object(_.a)(this,n),i=e.call(this);var a=Object(w.a)(i);return y.load("/3dof-stewart-simulator/models/servo/MG955.stl",function(t){var e=new d.v({color:4210752,opacity:.5,transparent:!0}),n=new d.u(t,e);n.position.set(3,0,0),n.rotation.set(Math.PI/2,0,0);n.scale.set(7.5,7.5,7.5),a.add(n)}),i._horn=new J(t),i._horn.position.set(0,5,0),i.add(i._horn),i.add(new d.b(8)),i}return Object(u.a)(n,[{key:"getHorn",value:function(){return this._horn}}]),n}(d.n),J=function(t){Object(h.a)(n,t);var e=Object(c.a)(n);function n(t){var i;Object(_.a)(this,n),i=e.call(this);var a=Object(w.a)(i);return y.load("/3dof-stewart-simulator/models/horn/MG90s_arm.stl",function(e){var n=new d.v({color:16119285,opacity:.5,transparent:!0}),i=new d.u(e,n);i.position.set(0,0,0),i.rotation.set(Math.PI,-Math.PI/2,0);i.scale.set(.75*t/12,.75,.75*t/12),a.add(i)}),i._ball_joint=new T,i._ball_joint.position.set(t,0,0),i.add(i._ball_joint),i.add(new d.b(8)),i}return Object(u.a)(n,[{key:"getBallJoint",value:function(){return this._ball_joint}}]),n}(d.n),T=function(t){Object(h.a)(n,t);var e=Object(c.a)(n);function n(){var t,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3158064;Object(_.a)(this,n),t=e.call(this);var a=Object(w.a)(t);return y.load("/3dof-stewart-simulator/models/ball-joint/m3_ball_joint.stl",function(t){var e=new d.v({color:i,opacity:.5,transparent:!0}),n=new d.u(t,e);n.position.set(0,0,0),n.rotation.set(-Math.PI/2,0,0);n.scale.set(.15,.15,.15),a.add(n)}),t.add(new d.b(5)),t}return n}(d.n);function S(t,e,n){var i=e.clone().sub(t),a=i.length();return i=i.normalize().multiplyScalar(a*n),t.clone().add(i)}var B=new d.J(0,1,0),j=new d.J(0,0,1),L={PERSPECTIVE:1,ORTHO_TOP:2,ORTHO_BOTTOM:3,ORTHO_FRONT:4,ORTHO_BACK:5,ORTHO_LEFT:6,ORTHO_RIGHT:7,properties:{1:{value:1,name:"PERSPECTIVE",displayName:"Free Cam"},2:{value:2,name:"ORTHO_TOP",displayName:"Top View"},3:{value:3,name:"ORTHO_BOTTOM",displayName:"Bottom View"},4:{value:4,name:"ORTHO_FRONT",displayName:"Front View"},5:{value:5,name:"ORTHO_BACK",displayName:"Back View"},6:{value:6,name:"ORTHO_LEFT",displayName:"Left View"},7:{value:7,name:"ORTHO_RIGHT",displayName:"Right View"}}},W={DARK_BLUE:1,GREY:2,WHITE:3,properties:{1:{value:1,name:"DARK_BLUE",color:1383461,displayName:"Dark Blue",bIsDefault:!0,textOverlayColor:{r:255,g:255,b:255,a:1}},2:{value:2,name:"GREY",color:11579568,displayName:"Grey",bIsDefault:!1,textOverlayColor:{r:0,g:0,b:0,a:1}},3:{value:3,name:"WHITE",color:16777215,displayName:"White",bIsDefault:!1,textOverlayColor:{r:0,g:0,b:0,a:1}}}},x=function(){function t(e,n){Object(_.a)(this,t),this.cameraManager=e,this.renderer=n,this.controls=null,this.controlsMap={},this.bCameraControlsEnabled=!0}return Object(u.a)(t,[{key:"updateControlType",value:function(t){if(t in this.controlsMap||(t===L.PERSPECTIVE?(this.controlsMap[t]=new m.a(this.cameraManager.camera,this.renderer.domElement),this.controlsMap[t].enableKeys=!1):(this.controlsMap[t]=new g.a(this.cameraManager.camera,this.renderer.domElement),this.controlsMap[t].noRotate=!0,this.controlsMap[t].zoomSpeed=1,this.controlsMap[t].panSpeed=.8,this.controlsMap[t].staticMoving=!0,this.controlsMap[t].dynamicDampingFactor=.3)),t===this.cameraManager.previousViewType)return this.controls.reset(),void(this.controls.enabled=this.bCameraControlsEnabled);this.controls=this.controlsMap[t],this.controls.reset();var e=this.cameraManager.previousViewType;e in this.controlsMap&&(this.controlsMap[e].enabled=!1),this.controls.enabled=this.bCameraControlsEnabled}},{key:"toggleCameraControls",value:function(){this.bCameraControlsEnabled=!this.bCameraControlsEnabled,this.controls.enabled=this.bCameraControlsEnabled}},{key:"setCameraControlsEnabled",value:function(t){this.bCameraControlsEnabled=t,this.controls.enabled=this.bCameraControlsEnabled}},{key:"updateControls",value:function(){this.controls.update()}}]),t}(),A=function(){function t(e,n){Object(_.a)(this,t),this.WIDTH=e,this.HEIGHT=n,this.camera=null,this.currentViewType=null,this.previousViewType=null,this.orthoCam=null,this.perspectiveCam=null,this.startingCamDistance=75}return Object(u.a)(t,[{key:"initCamera",value:function(){this.changeCamera(L.PERSPECTIVE)}},{key:"changeCamera",value:function(t){switch(t){case L.PERSPECTIVE:this.camera=this.getOrCreatePerspectiveCamera(),this.setCameraView(t);break;default:this.camera=this.getOrCreateOrthographicCamera(),this.setCameraView(t)}this.previousViewType=this.currentViewType,this.currentViewType=t}},{key:"setCameraView",value:function(t){switch(this.camera.rotation.set(0,0,0),t){case L.PERSPECTIVE:this.camera.position.set(0,this.startingCamDistance,0);break;case L.ORTHO_FRONT:this.camera.position.set(0,0,this.startingCamDistance),this.camera.up=B;break;case L.ORTHO_BACK:this.camera.position.set(0,0,-this.startingCamDistance),this.camera.up=B;break;case L.ORTHO_LEFT:this.camera.position.set(-this.startingCamDistance,0,0),this.camera.up=B;break;case L.ORTHO_RIGHT:this.camera.position.set(this.startingCamDistance,0,0),this.camera.up=B;break;case L.ORTHO_TOP:this.camera.position.set(0,this.startingCamDistance,0),this.camera.up=j;break;case L.ORTHO_BOTTOM:this.camera.position.set(0,-this.startingCamDistance,0),this.camera.up=j;break;default:throw Error("Unexpected viewtype: ".concat(t,"."))}}},{key:"getOrCreatePerspectiveCamera",value:function(){if(!this.perspectiveCam){var t=this.WIDTH/this.HEIGHT;this.perspectiveCam=new d.z(90,t,.1,1e4)}return this.perspectiveCam}},{key:"getOrCreateOrthographicCamera",value:function(){return this.orthoCam||(this.orthoCam=new d.y(this.WIDTH/-2,this.WIDTH/2,this.HEIGHT/2,this.HEIGHT/-2,.1,1e4),this.orthoCam.zoom=12),this.orthoCam}},{key:"updateAspectRatio",value:function(t,e){this.WIDTH=t,this.HEIGHT=e,this.perspectiveCam&&(this.perspectiveCam.aspect=this.WIDTH/this.HEIGHT,this.perspectiveCam.updateProjectionMatrix()),this.orthoCam&&(this.orthoCam.left=this.WIDTH/-2,this.orthoCam.right=this.WIDTH/2,this.orthoCam.top=this.HEIGHT/2,this.orthoCam.bottom=this.HEIGHT/-2,this.orthoCam.updateProjectionMatrix())}}]),t}(),I=function(){function t(){Object(_.a)(this,t),this.currentBackgroundColor=v(W),this.distanceScale=1}return Object(u.a)(t,[{key:"getCurrentBackgroundColorValue",value:function(){return W.properties[this.currentBackgroundColor].color}},{key:"getDefaultBackgroundColorValue",value:function(){return W.properties[v(W)].color}},{key:"setBackgroundColor",value:function(t){this.currentBackgroundColor=t}}]),t}(),D=function(t){Object(h.a)(n,t);var e=Object(c.a)(n);function n(){return Object(_.a)(this,n),e.call(this,new d.E(5,32,32),new d.v({color:16776960}))}return n}(d.u),Y=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new I;Object(_.a)(this,t),this._settings=e,this._width=null,this._height=null,this._scene=null,this._renderer=null,this._mount=null,this._cameraManager=null,this._cameraControlsManager=null,this._mechanism=null,this._target=null,this._animHooks=null,this._simulateMotion=!1}return Object(u.a)(t,[{key:"init",value:function(t){var e=this;window.addEventListener("resize",function(){return e.onCanvasResize()},!1),this._mount=t,this._width=this._mount.clientWidth,this._height=this._mount.clientHeight,this._scene=new d.D,this._renderer=new d.K,this._renderer.setClearColor(this._settings.getDefaultBackgroundColorValue()),this._renderer.setSize(this._width,this._height),this._mount.append(this._renderer.domElement),this._cameraManager=new A(this._width,this._height),this._cameraManager.initCamera(),this._scene.add(this._cameraManager.camera),this._cameraControlsManager=new x(this._cameraManager,this._renderer),this._cameraControlsManager.updateControlType(this._cameraManager.currentViewType);var n=new d.a(16777215);this._scene.add(n);var i=new d.b(250*this._settings.distanceScale);this._scene.add(i),this._target=new D,this._target.position.set(0,25,100),this._scene.add(this._target),this._transformControls=null,this._animHooks=[],this._mechanism=new k,this._scene.add(this._mechanism),this.animate()}},{key:"toggleMechanismSimulatedMotion",value:function(){this._simulateMotion=!this._simulateMotion}},{key:"resetMechanismOrientation",value:function(){void 0!==this._mechanism&&null!==this._mechanism&&this._mechanism.setFinalOrientation(0,0,0)}},{key:"addAnimHook",value:function(t){this._animHooks.push(t)}},{key:"activateTargetMode",value:function(){this.deactivateTargetMode(),this._cameraControlsManager.setCameraControlsEnabled(!1),this._transformControls=new p.a(this._cameraManager.camera,this._mount),this._transformControls.attach(this._target),this._scene.add(this._transformControls)}},{key:"deactivateTargetMode",value:function(){void 0!==this._transformControls&&null!==this._transformControls&&(this._transformControls.detach(),this._scene.remove(this._transformControls),this._transformControls.dispose(),this._transformControls=null,this._cameraControlsManager.setCameraControlsEnabled(!0))}},{key:"changeView",value:function(t){this._scene.remove(this._cameraManager.camera),this._cameraManager.changeCamera(t),this._scene.add(this._cameraManager.camera),this._cameraControlsManager.updateControlType(t)}},{key:"onCanvasResize",value:function(){this._width=this._mount.clientWidth,this._height=this._mount.clientHeight,this._cameraManager.updateAspectRatio(this._width,this._height),this._renderer.setSize(this._width,this._height)}},{key:"changeBackgroundColor",value:function(t){this._settings.setBackgroundColor(t),this.updateBackgroundColor()}},{key:"updateBackgroundColor",value:function(){var t=this._settings.getCurrentBackgroundColorValue();this._renderer.setClearColor(t)}},{key:"animate",value:function(){var t=this;requestAnimationFrame(function(){return t.animate()}),this._cameraControlsManager.bCameraControlsEnabled&&this._cameraControlsManager.updateControls(),this.animateMechanism(),this._animHooks.forEach(function(t){t.animate()}),this.render()}},{key:"animateMechanism",value:function(){null!=this._mechanism&&void 0!==this._mechanism&&(null==this._transformControls||void 0===this._transformControls?this._simulateMotion&&this._mechanism.simulateMotion():this._mechanism.trackTarget(this._target.getWorldPosition(new d.J)),this._mechanism.animate())}},{key:"render",value:function(){this._renderer.render(this._scene,this._cameraManager.camera)}}]),t}();function z(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return"".concat(t.x.toFixed(e),",").concat(t.y.toFixed(e),",").concat(t.z.toFixed(e))}var V=function(){function t(){Object(_.a)(this,t),this._isDisposed=!1,this._mount=null,this._visualizer=null,this._mechanism=null,this._dispServoLeft=null,this._dispServoHornLeft=null,this._dispPlatformAnchorLeft=null,this._dispConnectingRodLeft=null,this._dispServoRight=null,this._dispServoHornRight=null,this._dispPlatformAnchorRight=null,this._dispConnectingRodRight=null,this._dispServoYaw=null,this._dispServoHornYaw=null,this._dispPlatformStandAnchorYaw=null,this._dispConnectingRodYaw=null}return Object(u.a)(t,[{key:"dispose",value:function(){var t=this;this._isDisposed||(this._isDisposed=!0,[this._dispServoLeft,this._dispServoHornLeft,this._dispPlatformAnchorLeft,this._dispConnectingRodLeft,this._dispServoRight,this._dispServoHornRight,this._dispPlatformAnchorRight,this._dispConnectingRodRight,this._dispServoYaw,this._dispServoHornYaw,this._dispPlatformStandAnchorYaw,this._dispConnectingRodYaw].forEach(function(e){t._mount.removeChild(e),e.remove()}),this._dispServoLeft=null,this._dispServoHornLeft=null,this._dispPlatformAnchorLeft=null,this._dispConnectingRodLeft=null,this._dispServoRight=null,this._dispServoHornRight=null,this._dispPlatformAnchorRight=null,this._dispConnectingRodRight=null,this._dispServoYaw=null,this._dispServoHornYaw=null,this._dispPlatformStandAnchorYaw=null,this._dispConnectingRodYaw=null,this._mount=null,this._visualizer=null,this._mechanism=null)}},{key:"init",value:function(t,e){var n=this;this._isDisposed||(this._mount=t,this._visualizer=e,this._mechanism=e._mechanism,this._dispServoLeft=document.createElement("div"),this._dispServoHornLeft=document.createElement("div"),this._dispPlatformAnchorLeft=document.createElement("div"),this._dispConnectingRodLeft=document.createElement("div"),this._dispServoRight=document.createElement("div"),this._dispServoHornRight=document.createElement("div"),this._dispPlatformAnchorRight=document.createElement("div"),this._dispConnectingRodRight=document.createElement("div"),this._dispServoYaw=document.createElement("div"),this._dispServoHornYaw=document.createElement("div"),this._dispPlatformStandAnchorYaw=document.createElement("div"),this._dispConnectingRodYaw=document.createElement("div"),[this._dispServoLeft,this._dispServoHornLeft,this._dispPlatformAnchorLeft,this._dispConnectingRodLeft,this._dispServoRight,this._dispServoHornRight,this._dispPlatformAnchorRight,this._dispConnectingRodRight,this._dispServoYaw,this._dispServoHornYaw,this._dispPlatformStandAnchorYaw,this._dispConnectingRodYaw].forEach(function(t){t.textContent="placeholder",n._mount.appendChild(t)}))}},{key:"animate",value:function(){if(!this._isDisposed){this.updateElement(this._dispServoLeft,this._mechanism._servo_PitchRoll_left.getWorldPosition(new d.J),"Rotation: ".concat(this._mechanism.getServoAngle_Left().toFixed(2),"rad")),this.updateElement(this._dispServoRight,this._mechanism._servo_PitchRoll_right.getWorldPosition(new d.J),"Rotation: ".concat(this._mechanism.getServoAngle_Right().toFixed(2),"rad")),this.updateElement(this._dispConnectingRodLeft,this._mechanism.getConnectingRodMidPoint_Left_WorldPosition(),"Len: ".concat(this._mechanism.getConnectingRodLength_Left().toFixed(2))),this.updateElement(this._dispConnectingRodRight,this._mechanism.getConnectingRodMidPoint_Right_WorldPosition(),"Len: ".concat(this._mechanism.getConnectingRodLength_Right().toFixed(2)));var t=this._mechanism._servo_PitchRoll_left.getHorn().getBallJoint().getWorldPosition(new d.J);this.updateElement(this._dispServoHornLeft,t,z(t));var e=this._mechanism._servo_PitchRoll_right.getHorn().getBallJoint().getWorldPosition(new d.J);this.updateElement(this._dispServoHornRight,e,z(e));var n=this._mechanism._platform.getBallJointLeft().getWorldPosition(new d.J);this.updateElement(this._dispPlatformAnchorLeft,n,z(n));var i=this._mechanism._platform.getBallJointRight().getWorldPosition(new d.J);this.updateElement(this._dispPlatformAnchorRight,i,z(i)),this.updateElement(this._dispServoYaw,this._mechanism._servo_Yaw.getWorldPosition(new d.J),"Rotation: ".concat(this._mechanism.getYawServoAngle().toFixed(2),"rad")),this.updateElement(this._dispConnectingRodYaw,this._mechanism.getYawConnectingRodMidPoint_WorldPosition(),"Len: ".concat(this._mechanism.getYawConnectingRodLength().toFixed(2)));var a=this._mechanism._servo_Yaw.getHorn().getBallJoint().getWorldPosition(new d.J);this.updateElement(this._dispServoHornYaw,a,z(a));var o=this._mechanism._platformStand.getBallJoint().getWorldPosition(new d.J);this.updateElement(this._dispPlatformStandAnchorYaw,o,z(o))}}},{key:"updateElement",value:function(t,e,n){e.project(this._visualizer._cameraManager.camera);var i=(.5*e.x+.5)*this._visualizer._width,a=(-.5*e.y+.5)*this._visualizer._height;t.style.transform="translate(-50%, -50%) translate(".concat(i,"px,").concat(a,"px)"),t.textContent=n}}]),t}(),F=function(){function t(){Object(_.a)(this,t),this._mount=null,this._visualizer=null,this._componentsByName=[]}return Object(u.a)(t,[{key:"init",value:function(t,e){this._mount=t,this._visualizer=e,this.animate()}},{key:"hasComponent",value:function(t){return t in this._componentsByName}},{key:"addOrReplaceHUDComponentByName",value:function(t,e){this.removeHudComponentByName(t),e.init(this._mount,this._visualizer),this._componentsByName[t]=e}},{key:"removeHudComponentByName",value:function(t){this.hasComponent(t)&&(this._componentsByName[t].dispose(),delete this._componentsByName[t])}},{key:"animate",value:function(){for(var t=0,e=Object.entries(this._componentsByName);t<e.length;t++){var n=Object(l.a)(e[t],2);n[0];n[1].animate()}}}]),t}(),N=a.a.createContext(),G=a.a.createContext();function U(t,e){switch(e.type){case"init":return t.visualizer.init(e.visualizerMount),t.debugHUD.init(e.hudMount,t.visualizer),t.visualizer.addAnimHook(t.debugHUD),t;case"change_view":return t.visualizer.changeView(e.view),t;case"change_background_color":return t.visualizer.changeBackgroundColor(e.color),t;case"activate_target_control":return t.visualizer.activateTargetMode(),t;case"deactivate_target_control":return t.visualizer.deactivateTargetMode(),t;case"toggle_debug_info":return t.debugHUD.hasComponent("debug")?t.debugHUD.removeHudComponentByName("debug"):t.debugHUD.addOrReplaceHUDComponentByName("debug",new V),t;default:throw new Error("Unhandled action type: ".concat(e.type))}}function K(t){var e=t.children,n=a.a.useReducer(U,{visualizer:new Y,debugHUD:new F}),i=Object(l.a)(n,2),o=i[0],r=i[1];return a.a.createElement(N.Provider,{value:o},a.a.createElement(G.Provider,{value:r},e))}var q=function(){var t=Object(i.useContext)(G),e=Object(i.useContext)(N);return a.a.createElement("div",null,a.a.createElement("h1",null,"Settings..."),a.a.createElement(s.a,{variant:"primary",size:"lg",block:!0,onClick:function(){t({type:"toggle_debug_info"})}},"Toggle Debug Info"),a.a.createElement(s.a,{variant:"primary",size:"lg",block:!0,onClick:function(){e.visualizer.toggleMechanismSimulatedMotion()}},"Toggle Simulated Motion"),a.a.createElement(s.a,{variant:"primary",size:"lg",block:!0,onClick:function(){e.visualizer.resetMechanismOrientation()}},"Reset Orientation"))},Q=n(137),X=n(131);var Z=function(){return a.a.createElement("div",null,a.a.createElement(Q.a,{defaultActiveKey:"settings",id:"uncontrolled-tab-example"},a.a.createElement(X.a,{eventKey:"settings",title:"Settings"},a.a.createElement(q,null)),a.a.createElement(X.a,{eventKey:"disabled_example",title:"Disabled",disabled:!0},"Disabled example text...")))},$=(n(103),function(t){Object(h.a)(n,t);var e=Object(c.a)(n);function n(){return Object(_.a)(this,n),e.apply(this,arguments)}return Object(u.a)(n,[{key:"componentDidMount",value:function(){(0,this.context)({type:"init",visualizerMount:this.visualizerMount,hudMount:this.hudMount})}},{key:"render",value:function(){var t=this;return a.a.createElement("div",{className:"Visualizer-window",ref:function(e){t.visualizerMount=e}},a.a.createElement("div",{id:"debug-hud",ref:function(e){t.hudMount=e}}))}}]),n}(a.a.Component));$.contextType=G;var tt=$,et=n(135),nt=n(136),it=n(82);function at(){var t=Object(i.useContext)(G);return a.a.createElement(et.a,{title:"Camera View",id:"basic-nav-dropdown"},Object.keys(L.properties).map(function(e,n){return a.a.createElement(et.a.Item,{key:n,onClick:function(){return t({type:"change_view",view:L.properties[e].value})}},L.properties[e].displayName)}))}function ot(){var t=Object(i.useContext)(G);return a.a.createElement(et.a,{title:"Background Color",id:"basic-nav-dropdown"},Object.keys(W.properties).map(function(e,n){return a.a.createElement(et.a.Item,{key:n,onClick:function(){return t({type:"change_background_color",color:W.properties[e].value})}},W.properties[e].displayName)}))}function rt(){var t=Object(i.useContext)(G);return a.a.createElement(et.a,{title:"Target Control",id:"basic-nav-dropdown"},a.a.createElement(et.a.Item,{onClick:function(){return t({type:"deactivate_target_control"})}},"Off"),a.a.createElement(et.a.Item,{onClick:function(){return t({type:"activate_target_control"})}},"On"))}var st=function(){return a.a.createElement(nt.a,{bg:"light",expand:"lg"},a.a.createElement(nt.a.Brand,null,"Stewart Simulator"),a.a.createElement(nt.a.Toggle,{"aria-controls":"basic-navbar-nav"}),a.a.createElement(nt.a.Collapse,{id:"basic-navbar-nav"},a.a.createElement(it.a,{className:"mr-auto"},a.a.createElement(at,null),a.a.createElement(ot,null),a.a.createElement(rt,null))))},lt=n(132),ht=n(133),ct=n(134);var _t=function(){return a.a.createElement("div",{className:"App"},a.a.createElement(K,null,a.a.createElement(lt.a,{fluid:!0},a.a.createElement(ht.a,null,a.a.createElement(ct.a,null,a.a.createElement(Z,null)),a.a.createElement(ct.a,{xs:9},a.a.createElement(st,null),a.a.createElement(tt,null))))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(128);r.a.render(a.a.createElement(_t,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})},83:function(t,e,n){t.exports=n(129)},88:function(t,e,n){},89:function(t,e,n){}},[[83,1,2]]]);
//# sourceMappingURL=main.aadac10c.chunk.js.map