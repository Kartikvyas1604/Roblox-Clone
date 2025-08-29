import * as THREE from 'three';

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue background

// Create camera
const camera = new THREE.PerspectiveCamera(
  75, // fov
  window.innerWidth / window.innerHeight, // aspect
  0.1, // near
  1000 // far
);
camera.position.z = 2.5;

// Create a simple "man" using basic geometries
const man = new THREE.Group();
man.position.z = -5;

// Body
const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1, 16);
const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = 1.1;
man.add(body);

// Head
const headGeometry = new THREE.SphereGeometry(0.18, 16, 16);
const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffcc99 });
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.y = 1.7;
man.add(head);

// Left leg
const leftLegGeometry = new THREE.CylinderGeometry(0.09, 0.09, 0.8, 12);
const legMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
const leftLeg = new THREE.Mesh(leftLegGeometry, legMaterial);
leftLeg.position.x = -0.13;
leftLeg.position.y = 0.4;
man.add(leftLeg);

// Right leg
const rightLeg = new THREE.Mesh(leftLegGeometry, legMaterial);
rightLeg.position.x = 0.13;
rightLeg.position.y = 0.4;
man.add(rightLeg);

// Left arm
const armGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.7, 12);
const armMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
const leftArm = new THREE.Mesh(armGeometry, armMaterial);
leftArm.position.x = -0.32;
leftArm.position.y = 1.35;
leftArm.rotation.z = Math.PI / 8;
man.add(leftArm);

// Right arm
const rightArm = new THREE.Mesh(armGeometry, armMaterial);
rightArm.position.x = 0.32;
rightArm.position.y = 1.35;
rightArm.rotation.z = -Math.PI / 8;
man.add(rightArm);
scene.add(man);

// Add garden ground
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Forest green
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);

// Renderer setup (moved above animate)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
// Update animate function to animate walking
function animate() {
  requestAnimationFrame(animate);

  walkTime += 0.07;

  // Legs swing (more natural walk)
  leftLeg.rotation.x = Math.sin(walkTime) * 0.5;
  rightLeg.rotation.x = -Math.sin(walkTime) * 0.5;

  // Arms swing opposite to legs
  leftArm.rotation.x = -Math.sin(walkTime) * 0.4;
  rightArm.rotation.x = Math.sin(walkTime) * 0.4;

  // Slight up/down movement for body
  man.position.y = 0.1 + Math.abs(Math.sin(walkTime) * 0.05);

  // Move man towards the camera
  if (man.position.z < 1) {
    man.position.z += 0.02;
  }

  renderer.render(scene, camera);
}
scene.add(directionalLight);

// Animation parameters
let walkTime = 0;

// Update animate function to animate walking
animate();

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
