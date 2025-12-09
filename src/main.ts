import * as THREE from 'three';
import './style.css';

console.log("Starting game initialization...");

try {
    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    scene.fog = new THREE.Fog(0x87CEEB, 10, 50);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Ensure canvas is visible
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '1';
    document.body.appendChild(renderer.domElement);


// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(20, 50, 20);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 100;
dirLight.shadow.camera.left = -50;
dirLight.shadow.camera.right = 50;
dirLight.shadow.camera.top = 50;
dirLight.shadow.camera.bottom = -50;
scene.add(dirLight);

// --- Environment ---
// Ground
const groundGeometry = new THREE.PlaneGeometry(200, 200);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x4CAF50 }); // Green grass
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// River
const riverGeometry = new THREE.PlaneGeometry(200, 20);
const riverMaterial = new THREE.MeshStandardMaterial({ color: 0x2196F3, transparent: true, opacity: 0.8 });
const river = new THREE.Mesh(riverGeometry, riverMaterial);
river.rotation.x = -Math.PI / 2;
river.position.y = 0.1;
river.position.z = -15;
scene.add(river);

// Bridge
const bridgeGroup = new THREE.Group();
const bridgePlankGeo = new THREE.BoxGeometry(4, 0.2, 1);
const bridgePlankMat = new THREE.MeshStandardMaterial({ color: 0x8D6E63 });
for (let i = 0; i < 20; i++) {
    const plank = new THREE.Mesh(bridgePlankGeo, bridgePlankMat);
    plank.position.set(0, 0.5, -25 + i * 1.1);
    plank.castShadow = true;
    plank.receiveShadow = true;
    bridgeGroup.add(plank);
}
scene.add(bridgeGroup);

// Trees
function createTree(x: number, z: number) {
    const treeGroup = new THREE.Group();
    
    const trunkGeo = new THREE.CylinderGeometry(0.5, 0.7, 3, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x795548 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.5;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    treeGroup.add(trunk);

    const leavesGeo = new THREE.ConeGeometry(2.5, 5, 8);
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2E7D32 });
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.y = 4;
    leaves.castShadow = true;
    leaves.receiveShadow = true;
    treeGroup.add(leaves);

    treeGroup.position.set(x, 0, z);
    scene.add(treeGroup);
}

// Random trees
for (let i = 0; i < 30; i++) {
    const x = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    // Avoid river area
    if (z > -25 && z < -5) continue;
    createTree(x, z);
}

// --- Character (Roblox-style) ---
class Character {
    mesh: THREE.Group;
    head: THREE.Mesh;
    torso: THREE.Mesh;
    leftArm: THREE.Mesh;
    rightArm: THREE.Mesh;
    leftLeg: THREE.Mesh;
    rightLeg: THREE.Mesh;
    
    velocity = new THREE.Vector3();
    onGround = false;
    speed = 0.2;
    jumpForce = 0.4;
    
    constructor(color: number = 0xFFC107) {
        this.mesh = new THREE.Group();

        const skinMat = new THREE.MeshStandardMaterial({ color: 0xFFCC80 }); // Skin tone
        const shirtMat = new THREE.MeshStandardMaterial({ color: color });
        const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1565C0 }); // Blue pants

        // Torso (2x2x1)
        this.torso = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 1), shirtMat);
        this.torso.position.y = 2;
        this.torso.castShadow = true;
        this.mesh.add(this.torso);

        // Head (1.2x1.2x1.2)
        this.head = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), skinMat);
        this.head.position.y = 3.6;
        this.head.castShadow = true;
        this.mesh.add(this.head);

        // Arms (1x2x1)
        const armGeo = new THREE.BoxGeometry(1, 2, 1);
        this.leftArm = new THREE.Mesh(armGeo, shirtMat);
        this.leftArm.position.set(-1.5, 2, 0);
        this.leftArm.castShadow = true;
        this.mesh.add(this.leftArm);

        this.rightArm = new THREE.Mesh(armGeo, shirtMat);
        this.rightArm.position.set(1.5, 2, 0);
        this.rightArm.castShadow = true;
        this.mesh.add(this.rightArm);

        // Legs (1x2x1)
        const legGeo = new THREE.BoxGeometry(1, 2, 1);
        this.leftLeg = new THREE.Mesh(legGeo, pantsMat);
        this.leftLeg.position.set(-0.5, 0, 0); // Pivot at top
        this.leftLeg.geometry.translate(0, -1, 0); // Move geometry so pivot is at top
        this.leftLeg.position.y = 1;
        this.leftLeg.castShadow = true;
        this.mesh.add(this.leftLeg);

        this.rightLeg = new THREE.Mesh(legGeo, pantsMat);
        this.rightLeg.position.set(0.5, 0, 0);
        this.rightLeg.geometry.translate(0, -1, 0);
        this.rightLeg.position.y = 1;
        this.rightLeg.castShadow = true;
        this.mesh.add(this.rightLeg);

        scene.add(this.mesh);
    }

    update(keys: Record<string, boolean>, dt: number) {
        // Movement
        let moveX = 0;
        let moveZ = 0;
        let isMoving = false;

        if (keys['w'] || keys['arrowup']) { moveZ -= 1; isMoving = true; }
        if (keys['s'] || keys['arrowdown']) { moveZ += 1; isMoving = true; }
        if (keys['a'] || keys['arrowleft']) { moveX -= 1; isMoving = true; }
        if (keys['d'] || keys['arrowright']) { moveX += 1; isMoving = true; }

        // Normalize movement vector
        if (moveX !== 0 || moveZ !== 0) {
            const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
            moveX /= len;
            moveZ /= len;
            
            this.mesh.position.x += moveX * this.speed;
            this.mesh.position.z += moveZ * this.speed;
            
            // Rotate character to face direction
            const angle = Math.atan2(moveX, moveZ);
            this.mesh.rotation.y = angle;
        }

        // Jump
        if (keys[' '] && this.onGround) {
            this.velocity.y = this.jumpForce;
            this.onGround = false;
        }

        // Gravity
        this.velocity.y -= 0.02;
        this.mesh.position.y += this.velocity.y;

        // Ground collision
        if (this.mesh.position.y < 0) {
            this.mesh.position.y = 0;
            this.velocity.y = 0;
            this.onGround = true;
        }

        // Animation
        if (isMoving) {
            const time = Date.now() * 0.01;
            this.leftLeg.rotation.x = Math.sin(time) * 0.5;
            this.rightLeg.rotation.x = Math.sin(time + Math.PI) * 0.5;
            this.leftArm.rotation.x = Math.sin(time + Math.PI) * 0.5;
            this.rightArm.rotation.x = Math.sin(time) * 0.5;
        } else {
            this.leftLeg.rotation.x = 0;
            this.rightLeg.rotation.x = 0;
            this.leftArm.rotation.x = 0;
            this.rightArm.rotation.x = 0;
        }
    }
}

const player = new Character(0xE53935); // Red shirt

// --- NPCs ---
const npcs: Character[] = [];
for (let i = 0; i < 5; i++) {
    const npc = new Character(Math.random() * 0xffffff);
    npc.mesh.position.set((Math.random() - 0.5) * 50, 0, (Math.random() - 0.5) * 50);
    npcs.push(npc);
}

// --- Input Handling ---
const keys: Record<string, boolean> = {};
window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    player.update(keys, 0.016);

    // Simple NPC behavior (idle animation)
    const time = Date.now() * 0.005;
    npcs.forEach((npc, i) => {
        npc.leftArm.rotation.z = Math.sin(time + i) * 0.1;
        npc.rightArm.rotation.z = -Math.sin(time + i) * 0.1;
    });

    // Camera Follow
    const targetPos = player.mesh.position.clone();
    targetPos.y += 2;
    
    const cameraOffset = new THREE.Vector3(0, 10, 15);
    // Rotate offset based on player rotation? No, fixed camera angle is easier for now
    // Or maybe smooth follow
    
    camera.position.lerp(targetPos.clone().add(cameraOffset), 0.1);
    camera.lookAt(targetPos);

    renderer.render(scene, camera);
}

    animate();

    // --- Resize Handler ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

} catch (error) {
    console.error("Game initialization error:", error);
    const overlay = document.getElementById('error-overlay');
    if (overlay) {
        overlay.style.display = 'block';
        overlay.textContent += 'Initialization Error: ' + error + '\n';
    }
}