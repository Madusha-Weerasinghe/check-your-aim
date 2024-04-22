const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 8;
camera.position.y = 4;
camera.position.x = 0;
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

const loader = new THREE.GLTFLoader();

const modelGroup1 = new THREE.Group();
modelGroup1.position.set(-10, 0, 0);

loader.load(
    'archer2/scene.gltf',
    function (gltf) {
        const model = gltf.scene;
        model.scale.set(0.00025, 0.00025, 0.00025);
        model.rotation.set(0, Math.PI * 0.5, 0);
        model.position.set(0, 0, 0);
        modelGroup1.add(model);
        scene.add(modelGroup1);
    },
    undefined,
    function (error) {
        console.error('Error loading model:', error);
    }
);

const modelGroup2 = new THREE.Group();
modelGroup2.position.set(10, 0, 0);

loader.load(
    'target2/scene.gltf',
    function (gltf) {
        const model = gltf.scene;
        model.scale.set(0.3, 0.35, 0.3);
        model.rotation.set(0, -Math.PI / 2.3, 0);
        model.position.set(0, 0, 0);
        modelGroup2.add(model);
        scene.add(modelGroup2);
    },
    undefined,
    function (error) {
        console.error('Error loading model:', error);
    }
);


const modelGroup3 = new THREE.Group();
modelGroup3.position.set(10, 0, 0);

loader.load(
    'arrow/scene.gltf',
    function (gltf) {
        const model = gltf.scene;
        model.scale.set(0.01, 0.01, 0.01);
        model.position.set(-20.1, 3.4, -1);
        model.rotateY(Math.PI);
        modelGroup3.add(model);
        scene.add(modelGroup3);
    },
    undefined,
    function (error) {
        console.error('Error loading model:', error);
    }
);


const modelGroup4 = new THREE.Group();
modelGroup4.position.set(10, 0, 0);

loader.load(
    'noticeboard/scene.gltf',
    function (gltf) {
        const model = gltf.scene;
        model.scale.set(3.5, 2.5, 2.5);
        model.position.set(-10, 2.5, -2);
        modelGroup4.add(model);
        scene.add(modelGroup4);
    },
    undefined,
    function (error) {
        console.error('Error loading model:', error);
    }
);

const modelGroup5 = new THREE.Group();
modelGroup5.position.set(10, 0, 0);

loader.load(
    'bird/scene.gltf',
    function (gltf) {
        const model = gltf.scene;
        model.scale.set(0.12, 0.12, 0.12);
        model.position.set(0.8, 4.3, 0);
        // model.rotation.y = Math.PI / 2;
        modelGroup5.add(model);
        scene.add(modelGroup5);
    },
    undefined,
    function (error) {
        console.error('Error loading model5:', error);
    }
);

let rotationAngle = 0;
let rotateClockwise = true;

let snowParticles;
let snowGeometry;
let snowMaterial;

const clock = new THREE.Clock();

let isMovingUp = true; 

function rotateAndMoveModelGroup5() {
    const deltaTime = clock.getDelta(); 
    const angularSpeed = 1; 
    const verticalSpeed = 0.4; 

    
    const deltaYaw = angularSpeed * deltaTime;

    
    modelGroup5.rotation.y -= deltaYaw;

    
    const deltaY = verticalSpeed * deltaTime;

    if (isMovingUp) {
        
        modelGroup5.position.y += deltaY;

        
        if (modelGroup5.position.y >= 0.8) {
            isMovingUp = false; 
        }
    } else {
        
        modelGroup5.position.y -= deltaY;

        
        if (modelGroup5.position.y <= 0) {
            isMovingUp = true; 
        }
    }

   
}


function animate() {
    requestAnimationFrame(animate);
    if (rotateClockwise) {
        rotationAngle += 0.005;
    } else {
        rotationAngle -= 0.005;
    }
    if (Math.abs(rotationAngle) >= Math.PI/18) {
        rotateClockwise = !rotateClockwise;
    }
    modelGroup1.rotation.y = rotationAngle;


    rotateAndMoveModelGroup5()

    TWEEN.update();
    renderer.render(scene, camera);

    if (snowParticles) {
        snowParticles.position.y -= 0.03;
        if (snowParticles.position.y < -1) {
            snowParticles.position.y = 10;
        }
    }
}
animate();

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.getElementById('myButton').addEventListener('click', function() {
    modelGroup3.position.set(10, -0.1, -1);
    var randomNumber = getRandomNumber(1, 5);
    var word = displayWord(randomNumber);
    console.log("Random Number:", randomNumber, "Word:", word);

    setTimeout(function() {
        document.getElementById('wordDisplay').innerText =  word;
    }, 1200);
    
    document.getElementById('wordDisplay').classList.add('show');

   function initSnow() {
    console.log("Initializing snow particles...");
    snowGeometry = new THREE.BufferGeometry();
    snowMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.3,
        transparent: true,
        opacity: 1
    });
    const vertices = [];
    const numParticles = 1000;
    const rotationSpeeds = [];
    for (let i = 0; i < numParticles; i++) {
        const x = Math.random() * 20 - 10;
        const y = Math.random() * 20 - 10;
        const z = Math.random() * 20 - 10;
        const rotationSpeed = (Math.random() - 0.5) * 0.05;
        vertices.push(x, y, z);
        rotationSpeeds.push(rotationSpeed);
    }
    snowGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const textureLoader = new THREE.TextureLoader();
    const crepeTexture = textureLoader.load('celebration.png');
    snowMaterial.map = crepeTexture;
    snowParticles = new THREE.Points(snowGeometry, snowMaterial);
    snowParticles.rotationSpeeds = rotationSpeeds;
    scene.add(snowParticles);
}

    if (snowParticles) {
        scene.remove(snowParticles);
        snowParticles = null;
    }

    if (randomNumber === 1) {
        new TWEEN.Tween(modelGroup3.position)
            .to({ x: 29.5, y: -0.29, z: 1.2 }, 1500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

            setTimeout(function() {
                initSnow();
            }, 1200);

    } else if (randomNumber === 2) {
        new TWEEN.Tween(modelGroup3.position)
            .to({ x: 40, y: 1, z: -1.2 }, 1500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
    } else if (randomNumber === 3) {
        new TWEEN.Tween(modelGroup3.position)
            .to({ x: 40, y: -1, z: 3 }, 1500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
    } else if (randomNumber === 4) {
        new TWEEN.Tween(modelGroup3.position)
            .to({ x: 29.9, y: 1, z: 1.2 }, 1500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
    } else if (randomNumber === 5) {
        new TWEEN.Tween(modelGroup3.position)
            .to({ x: 29.8, y: -0.5, z: 1.3 }, 1500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
    }
});


function displayWord(randomNumber) {
    switch (randomNumber) {
        case 1:
            return "clear hit";
        case 2:
            return "that was a close one";
        case 3:
            return "unlucky this time";
        case 4:
            return "hit the head";
        case 5:
            return "just miss by inch";
        default:
            return "Unknown";
    }
}




