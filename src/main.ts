import * as THREE from 'three';

// Basic setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ground
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Main player character (humanoid)
function createHuman(color = 0x00aaff) {
  const group = new THREE.Group();
  // Body
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 1.2, 16),
    new THREE.MeshPhongMaterial({ color })
  );
  body.position.y = 1.2;
  group.add(body);
  // Head
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffcc99 })
  );
  head.position.y = 2;
  group.add(head);
  // Left leg
  const leftLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.8, 12),
    new THREE.MeshPhongMaterial({ color: 0x333333 })
  );
  leftLeg.position.x = -0.18;
  leftLeg.position.y = 0.4;
  group.add(leftLeg);
  // Right leg
  const rightLeg = leftLeg.clone();
  rightLeg.position.x = 0.18;
  group.add(rightLeg);
  // Left arm
  const leftArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.7, 12),
    new THREE.MeshPhongMaterial({ color })
  );
  leftArm.position.x = -0.5;
  leftArm.position.y = 1.5;
  leftArm.rotation.z = Math.PI / 8;
  group.add(leftArm);
  // Right arm
  const rightArm = leftArm.clone();
  rightArm.position.x = 0.5;
  rightArm.position.y = 1.5;
  rightArm.rotation.z = -Math.PI / 8;
  group.add(rightArm);
  return group;
}

const character = createHuman(0x00aaff);
character.position.y = 1;
character.castShadow = true;
scene.add(character);

// NPC Humans
const npcs: THREE.Group[] = [];
for (let i = 0; i < 5; i++) {
  const npc = createHuman(0xff4444 + i * 0x1111);
  npc.position.set(Math.random() * 80 - 40, 1, Math.random() * 80 - 40);
  scene.add(npc);
  npcs.push(npc);
}

// Animal NPCs (simple quadrupeds)
function createAnimal(color = 0x996633) {
  const group = new THREE.Group();
  // Body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.5, 0.4),
    new THREE.MeshPhongMaterial({ color })
  );
  body.position.y = 0.5;
  group.add(body);
  // Head
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 12, 12),
    new THREE.MeshPhongMaterial({ color: 0xffcc99 })
  );
  head.position.y = 0.8;
  head.position.x = 0.6;
  group.add(head);
  // Legs
  for (let i = -1; i <= 1; i += 2) {
    for (let j = -1; j <= 1; j += 2) {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8),
        new THREE.MeshPhongMaterial({ color: 0x333333 })
      );
      leg.position.x = 0.35 * i;
      leg.position.z = 0.15 * j;
      leg.position.y = 0.25;
      group.add(leg);
    }
  }
  return group;
}

const animals: THREE.Group[] = [];
for (let i = 0; i < 4; i++) {
  const animal = createAnimal(0x996633 + i * 0x2222);
  animal.position.set(Math.random() * 80 - 40, 1, Math.random() * 80 - 40);
  scene.add(animal);
  animals.push(animal);
}

// Trees
function addTree(x: number, z: number) {
  const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2);
  const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(x, 1, z);
  scene.add(trunk);

  const leavesGeometry = new THREE.SphereGeometry(0.8, 8, 8);
  const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.set(x, 2.2, z);
  scene.add(leaves);
}
for (let i = 0; i < 20; i++) {
  addTree(Math.random() * 80 - 40, Math.random() * 80 - 40);
}

// Controls
const keys: Record<string, boolean> = {};
let velocityY = 0;
let isOnGround = true;

document.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
document.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

function animate() {
  requestAnimationFrame(animate);

  // Movement
  let moveX = 0, moveZ = 0;
  const speed = keys['shift'] ? 0.2 : 0.1;
  if (keys['w'] || keys['arrowup']) moveZ -= speed;
  if (keys['s'] || keys['arrowdown']) moveZ += speed;
  if (keys['a'] || keys['arrowleft']) moveX -= speed;
  if (keys['d'] || keys['arrowright']) moveX += speed;

  character.position.x += moveX;
  character.position.z += moveZ;

  // Gravity and jump for player
  velocityY -= 0.01; // gravity
  character.position.y += velocityY;
  if (character.position.y <= 1) {
    character.position.y = 1;
    velocityY = 0;
    isOnGround = true;
  }
  // Jump
  if ((keys[' '] || keys['space']) && isOnGround) {
    velocityY = 0.22;
    isOnGround = false;
  }

  // Animate NPCs (simple idle bounce)
  npcs.forEach((npc, i) => {
    npc.position.y = 1 + Math.abs(Math.sin(Date.now() * 0.001 + i) * 0.2);
    npc.rotation.y += 0.005;
  });
  // Animate animals (walk in circles)
  animals.forEach((animal, i) => {
    animal.position.x += Math.sin(Date.now() * 0.001 + i) * 0.02;
    animal.position.z += Math.cos(Date.now() * 0.001 + i) * 0.02;
    animal.rotation.y += 0.01;
  });

  // Camera follows character
  camera.position.x = character.position.x;
  camera.position.z = character.position.z + 5;
  camera.position.y = character.position.y + 4;
  camera.lookAt(character.position);

  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
