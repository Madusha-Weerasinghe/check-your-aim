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
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Set alpha to true for transparency
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Set clearAlpha to 0 for transparent background
document.body.appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Create a loader for GLTF files
const loader = new THREE.GLTFLoader();

// Create model group for the first model
const modelGroup1 = new THREE.Group();
modelGroup1.position.set(-10, 0, 0); // Initial position for the first model

// Load the GLTF model
loader.load(
    'archer2/scene.gltf',
    function (gltf) {
        // After loading, access the root object (usually a Group)
        const model = gltf.scene;

        // Optionally, you can scale, rotate, or position the model
        model.scale.set(0.00025, 0.00025, 0.00025);
        model.rotation.set(0, Math.PI * 0.5, 0);// Example rotation
        model.position.set(0, 0, 0);
        
        //model.scale(1, 1, 1);// Example position - Remove this line

        // Add the model to your model group
        modelGroup1.add(model);

        // Add the model group to the scene
        scene.add(modelGroup1);
    },
    undefined,
    function (error) {
        console.error('Error loading model:', error);
    }
);

const modelGroup2 = new THREE.Group();
modelGroup2.position.set(10, 0, 0); // Initial position for the second model

// Load the GLTF model for the second model
loader.load(
    'target2/scene.gltf', // Replace 'second_model/scene.gltf' with the path to your second model
    function (gltf) {
        const model = gltf.scene;

        // Scale, rotate, or position the model as needed
        model.scale.set(0.3, 0.35, 0.3); // Example scale
        model.rotation.set(0, -Math.PI / 2.3, 0); // Example rotation
        model.position.set(0, 0, 0); // Example position
        

        // Add the model to the group
        modelGroup2.add(model);

        // Add the group to the scene
        scene.add(modelGroup2);
    },
    undefined,
    function (error) {
        console.error('Error loading model:', error);
    }
);


const modelGroup3 = new THREE.Group();
modelGroup3.position.set(10, 0, 0); // Initial position for the third model

// Load the GLTF model for the third model
loader.load(
    'arrow/scene.gltf', // Replace 'arrow/scene.gltf' with the path to your third model
    function (gltf) {
        const model = gltf.scene;

        // Scale, rotate, or position the model as needed
        model.scale.set(0.01, 0.01, 0.01); // Example scale
        model.position.set(-20.1, 3.4, -1); // Example position
        model.rotateY(Math.PI);

        // Add the model to the group
        modelGroup3.add(model);

        // Add the group to the scene
        scene.add(modelGroup3);
    },
    undefined,
    function (error) {
        console.error('Error loading model:', error);
    }
);


const modelGroup4 = new THREE.Group();
modelGroup4.position.set(10, 0, 0); // Initial position for the third model

// Load the GLTF model for the third model
loader.load(
    'noticeboard/scene.gltf', // Replace 'arrow/scene.gltf' with the path to your third model
    function (gltf) {
        const model = gltf.scene;

        // Scale, rotate, or position the model as needed
        model.scale.set(3.5, 2.5, 2.5); // Example scale
        model.position.set(-10, 2.5, -2); // Example position
        // model.rotateY(Math.PI);

        // Add the model to the group
        modelGroup4.add(model);

        // Add the group to the scene
        scene.add(modelGroup4);
    },
    undefined,
    function (error) {
        console.error('Error loading model:', error);
    }
);

let rotationAngle = 0;
let rotateClockwise = true;

// Define snow variables
let snowParticles;
let snowGeometry;
let snowMaterial;

function animate() {
    requestAnimationFrame(animate);

    // Update rotation angle based on direction
    if (rotateClockwise) {
        rotationAngle += 0.005; // Rotate clockwise
    } else {
        rotationAngle -= 0.005; // Rotate counterclockwise
    }

    // Check if half rotation is completed
    if (Math.abs(rotationAngle) >= Math.PI/18) {
        // Toggle rotation direction
        rotateClockwise = !rotateClockwise;
    }

    // Apply rotation to the model
    modelGroup1.rotation.y = rotationAngle;

    TWEEN.update();

    renderer.render(scene, camera);

    if (snowParticles) {

        
        
        snowParticles.position.y -= 0.03; // Adjust the falling speed as needed
        if (snowParticles.position.y < -1) {
            snowParticles.position.y = 10; // Reset position when particles fall below a certain point
        }
    }
}
animate();

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Event listener for the button click

document.getElementById('myButton').addEventListener('click', function() {
    // Reset the position of modelGroup3 to its initial position
    modelGroup3.position.set(10, -0.1, -1);

    // Generate a random number between 1 and 3
    var randomNumber = getRandomNumber(1, 5);
    var word = displayWord(randomNumber);
    // Log the random number to the console (you can modify this part)
    console.log("Random Number:", randomNumber, "Word:", word);
    document.getElementById('wordDisplay').innerText =  word;

    // Add the 'show' class to trigger the fade-in animation
    document.getElementById('wordDisplay').classList.add('show');

   function initSnow() {
    console.log("Initializing snow particles...");
    
    // Create snow geometry
    snowGeometry = new THREE.BufferGeometry();
    
    // Create snow material
    snowMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.3, // Adjust the size to your preference
        transparent: true,
        opacity: 1
    });
    
    // Create snow particles
    const vertices = [];
    const numParticles = 1000;
    const rotationSpeeds = []; // Array to hold rotation speeds for each particle
    for (let i = 0; i < numParticles; i++) {
        const x = Math.random() * 20 - 10;
        const y = Math.random() * 20 - 10;
        const z = Math.random() * 20 - 10;
        const rotationSpeed = (Math.random() - 0.5) * 0.05; // Random rotation speed between -0.025 and 0.025
        vertices.push(x, y, z);
        rotationSpeeds.push(rotationSpeed);
    }
    snowGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    // Load texture for celebration crepes
    const textureLoader = new THREE.TextureLoader();
    const crepeTexture = textureLoader.load('celebration.png'); // Replace 'path_to_your_texture_image.png' with the actual path to your texture image
    
    // Apply texture to snow material
    snowMaterial.map = crepeTexture;
    
    // Create snow particles system
    snowParticles = new THREE.Points(snowGeometry, snowMaterial);

    // Set rotation speeds for each particle
    snowParticles.rotationSpeeds = rotationSpeeds;
    
    console.log("Snow particles created:", snowParticles);
    
    // Add snow particles to the scene
    scene.add(snowParticles);
    
    console.log("Snow particles added to scene.");
}

    
    
    if (snowParticles) {
        scene.remove(snowParticles);
        snowParticles = null;
    }

    if (randomNumber === 1) {
        // Initialize snow particles
        
        // Smoothly move modelGroup3 to the new position
        new TWEEN.Tween(modelGroup3.position)
            .to({ x: 29.5, y: -0.29, z: 1.2 }, 1500) // Specify the target position and duration
            .easing(TWEEN.Easing.Quadratic.InOut) // Specify the easing function
            .start(); // Start the tween animation

            initSnow();
    } else if (randomNumber === 2) {
        // Smoothly move modelGroup3 to the new position
        new TWEEN.Tween(modelGroup3.position)
            .to({ x: 40, y: 1, z: -1.2 }, 1500) // Specify the target position and duration
            .easing(TWEEN.Easing.Quadratic.InOut) // Specify the easing function
            .start();
    } else if (randomNumber === 3) {
        // Smoothly move modelGroup3 to the new position
        new TWEEN.Tween(modelGroup3.position)
            .to({ x: 40, y: -1, z: 3 }, 1500) // Specify the target position and duration
            .easing(TWEEN.Easing.Quadratic.InOut) // Specify the easing function
            .start();
    } else if (randomNumber === 4) {
        // Smoothly move modelGroup3 to the new position
        new TWEEN.Tween(modelGroup3.position)
            .to({ x: 29.9, y: 1, z: 1.2 }, 1500) // Specify the target position and duration
            .easing(TWEEN.Easing.Quadratic.InOut) // Specify the easing function
            .start();
    } else if (randomNumber === 5) {
        // Smoothly move modelGroup3 to the new position
        new TWEEN.Tween(modelGroup3.position)
            .to({ x: 29.8, y: -0.5, z: 1.3 }, 1500) // Specify the target position and duration
            .easing(TWEEN.Easing.Quadratic.InOut) // Specify the easing function
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
