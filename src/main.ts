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

// River (centered horizontally, runs across the scene)
const riverGeometry = new THREE.PlaneGeometry(100, 12);
const riverMaterial = new THREE.MeshPhongMaterial({ color: 0x1e90ff, transparent: true, opacity: 0.8 });
const river = new THREE.Mesh(riverGeometry, riverMaterial);
river.rotation.x = -Math.PI / 2;
river.position.z = 0;
river.position.y = 1.01; // slightly above ground
scene.add(river);

// Bridge (crosses river at center)
const bridgeGeometry = new THREE.BoxGeometry(20, 0.5, 3);
const bridgeMaterial = new THREE.MeshPhongMaterial({ color: 0x8B5A2B });
const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
bridge.position.set(0, 1.3, 0); // above river
scene.add(bridge);

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
  // Store limbs for animation
  (group as any).limbs = { leftLeg, rightLeg, leftArm, rightArm };
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
  const legs: THREE.Mesh[] = [];
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
      legs.push(leg);
    }
  }
  (group as any).legs = legs;
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
// Amazon jungle: lots of trees
for (let i = 0; i < 120; i++) {
  // Avoid placing trees on the river or bridge
  let x, z;
  do {
    x = Math.random() * 90 - 45;
    z = Math.random() * 90 - 45;
  } while (Math.abs(z) < 8 && Math.abs(x) < 12); // keep river and bridge clear
  addTree(x, z);
}

// Controls
const keys: Record<string, boolean> = {};
let velocityY = 0;
let isOnGround = true;

document.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
document.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

let walkTime = 0;
function animate() {
  requestAnimationFrame(animate);

  // Movement
  let moveX = 0, moveZ = 0;
  const speed = keys['shift'] ? 0.2 : 0.1;
  let isMoving = false;
  if (keys['w'] || keys['arrowup']) { moveZ -= speed; isMoving = true; }
  if (keys['s'] || keys['arrowdown']) { moveZ += speed; isMoving = true; }
  if (keys['a'] || keys['arrowleft']) { moveX -= speed; isMoving = true; }
  if (keys['d'] || keys['arrowright']) { moveX += speed; isMoving = true; }

  character.position.x += moveX;
  character.position.z += moveZ;

  // Gravity and jump for player
  velocityY -= 0.02; // stronger gravity
  character.position.y += velocityY;

  // Check if on ground or bridge
  let onBridge = Math.abs(character.position.x) < 10 && Math.abs(character.position.z) < 1.5;
  let groundLevel = onBridge ? 1.55 : 1;
  if (character.position.y <= groundLevel) {
    character.position.y = groundLevel;
    velocityY = 0;
    isOnGround = true;
  }
  // Jump
  if ((keys[' '] || keys['space']) && isOnGround) {
    velocityY = 0.22;
    isOnGround = false;
  }

  // Animate player limbs if moving
  walkTime += isMoving ? 0.15 : 0.05;
  const limbs = (character as any).limbs;
  if (limbs) {
    limbs.leftLeg.rotation.x = Math.sin(walkTime) * (isMoving ? 0.7 : 0.1);
    limbs.rightLeg.rotation.x = -Math.sin(walkTime) * (isMoving ? 0.7 : 0.1);
    limbs.leftArm.rotation.x = -Math.sin(walkTime) * (isMoving ? 0.5 : 0.05);
    limbs.rightArm.rotation.x = Math.sin(walkTime) * (isMoving ? 0.5 : 0.05);
  }

  // Animate NPCs (walk in place)
  npcs.forEach((npc, i) => {
    npc.position.y = 1 + Math.abs(Math.sin(Date.now() * 0.001 + i) * 0.2);
    npc.rotation.y += 0.005;
    const limbs = (npc as any).limbs;
    if (limbs) {
      limbs.leftLeg.rotation.x = Math.sin(walkTime + i) * 0.7;
      limbs.rightLeg.rotation.x = -Math.sin(walkTime + i) * 0.7;
      limbs.leftArm.rotation.x = -Math.sin(walkTime + i) * 0.5;
      limbs.rightArm.rotation.x = Math.sin(walkTime + i) * 0.5;
    }
  });
  // Animate animals (walk in circles, animate legs)
  animals.forEach((animal, i) => {
    animal.position.x += Math.sin(Date.now() * 0.001 + i) * 0.02;
    animal.position.z += Math.cos(Date.now() * 0.001 + i) * 0.02;
    animal.rotation.y += 0.01;
    const legs = (animal as any).legs;
    if (legs) {
      legs[0].rotation.x = Math.sin(walkTime + i) * 0.7;
      legs[1].rotation.x = -Math.sin(walkTime + i) * 0.7;
      legs[2].rotation.x = -Math.sin(walkTime + i) * 0.7;
      legs[3].rotation.x = Math.sin(walkTime + i) * 0.7;
    }
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
