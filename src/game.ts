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

// Character (simple box)
const charGeometry = new THREE.BoxGeometry(1, 2, 1);
const charMaterial = new THREE.MeshPhongMaterial({ color: 0x00aaff });
const character = new THREE.Mesh(charGeometry, charMaterial);
character.position.y = 1;
character.castShadow = true;
scene.add(character);

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

    // Jump
    if ((keys[' '] || keys['space']) && isOnGround) {
        velocityY = 0.25;
        isOnGround = false;
    }
    velocityY -= 0.01; // gravity
    character.position.y += velocityY;
    if (character.position.y <= 1) {
        character.position.y = 1;
        velocityY = 0;
        isOnGround = true;
    }

    // Camera follows character
    camera.position.x = character.position.x;
    camera.position.z = character.position.z + 5;
    camera.position.y = character.position.y + 4;
    camera.lookAt(character.position);

    renderer.render(scene, camera);
}
animate();
