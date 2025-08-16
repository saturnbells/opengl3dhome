// scene config
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// house config
function createHouse() {
    const houseGroup = new THREE.Group();
    
    const wallGeometry = new THREE.BoxGeometry(2, 1.5, 2);
    const wallMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xe0b090,
        wireframe: false
    });
    const walls = new THREE.Mesh(wallGeometry, wallMaterial);
    walls.position.y = 0.75;
    houseGroup.add(walls);
    
    // roof
    const roofGeometry = new THREE.ConeGeometry(1.8, 1, 4);
    const roofMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xDB7093,
        wireframe: false
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 1.5 + 0.5;
    houseGroup.add(roof);
    
    // door
    const doorGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.1);
    const doorMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 0.35, 1.01);
    houseGroup.add(door);
    
    // windows
    const windowGeometry = new THREE.PlaneGeometry(0.4, 0.4);
    const windowMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x87CEEB,
        side: THREE.DoubleSide
    });
    
    const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
    window1.position.set(-0.6, 0.8, 1.01);
    houseGroup.add(window1);
    
    const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
    window2.position.set(0.6, 0.8, 1.01);
    houseGroup.add(window2);
    
    // floor
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x3cb371,
        side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.75;
    houseGroup.add(ground);
    
    return { houseGroup, walls, roof, door, windows: [window1, window2] };
}

const house = createHouse();
scene.add(house.houseGroup);

// controls
let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

// mouse rotation
document.addEventListener('mousedown', (e) => {
    isDragging = true;
});

document.addEventListener('mousemove', (e) => {
    const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
    };
    
    if (isDragging) {
        const deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 1),
                toRadians(deltaMove.x * 1),
                0,
                'XYZ'
            ));
        
        house.houseGroup.quaternion.multiplyQuaternions(
            deltaRotationQuaternion,
            house.houseGroup.quaternion
        );
    }
    
    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    };
});

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const moveSpeed = 0.3;
    const zoomSpeed = 0.3;

    switch(key) {
        case 'w':
            camera.position.y += moveSpeed;
            break;
        case 's':
            camera.position.y -= moveSpeed;
            break;
        case 'a':
            house.houseGroup.rotation.y += moveSpeed;
            break;
        case 'd':
            house.houseGroup.rotation.y -= moveSpeed;
            break;
        case 'z':
            camera.position.z -= zoomSpeed;
            break;
        case 'x':
            camera.position.z += zoomSpeed;
            break;
    }

    // min/max zoom limit
    camera.position.z = Math.min(Math.max(camera.position.z, 3), 10);
    
    // height limit
    camera.position.y = Math.min(Math.max(camera.position.y, -2), 5);
    
    // scene update
    renderer.render(scene, camera);
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// mouse zoom
document.addEventListener('wheel', (e) => {
    camera.position.z += e.deltaY * 0.01;
    camera.position.z = Math.min(Math.max(camera.position.z, 3), 10);
});

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

// custom colors
document.getElementById('roof-pink').addEventListener('click', () => {
    house.roof.material.color.set(0xDB7093);
});

document.getElementById('roof-blue').addEventListener('click', () => {
    house.roof.material.color.set(0x4444ff);
});

document.getElementById('roof-green').addEventListener('click', () => {
    house.roof.material.color.set(0x44ff44);
});

document.getElementById('wall-beige').addEventListener('click', () => {
    house.walls.material.color.set(0xe0b090);
});

document.getElementById('wall-gray').addEventListener('click', () => {
    house.walls.material.color.set(0xb0b0b0);
});

document.getElementById('wall-yellow').addEventListener('click', () => {
    house.walls.material.color.set(0xffff80);
});

// wireframe mode
document.getElementById('toggle-wireframe').addEventListener('click', () => {
    house.walls.material.wireframe = !house.walls.material.wireframe;
    house.roof.material.wireframe = !house.roof.material.wireframe;
});

// reset
document.getElementById('reset-view').addEventListener('click', () => {
    house.houseGroup.rotation.set(0, 0, 0);
    camera.position.set(0, 0, 5);
});

function animate() {
    requestAnimationFrame(animate);
    
    renderer.render(scene, camera);
}

// window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
