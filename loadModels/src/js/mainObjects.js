// Pato cargado
// Sounds (background(ambient), takeElements, Win, Lost)
// 1 pantalla Win, Lost

//Creation elements
var scene = null,
    camera = null,
    renderer = null,
    controls = null;

const size = 20,
    divisions = 20;

// Avatar
var myPlayer = null,
    input = {left:0, right:0, up:0, down:0},
    rootSpeed = 0.05,
    speed = 0.5;

function startScene() {
    // Scene, Camera, Renderer
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000); //33FFC5
    camera = new THREE.PerspectiveCamera(
        75,                                        //Angulo de visión(Abajo o arriba) 
        window.innerWidth / window.innerHeight,    //Relación de aspecto 16:9
        0.1,                                       //Mas cerca (no renderiza)
        1000);                                    //Mas lejos ()

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('modelsLoad') });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //Orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    //camera.position.set(0, 5, 20);   
    camera.position.set(13, 7, 13);
    controls.update();

    //Grid Helper
    // const gridHelper = new THREE.GridHelper(size, divisions);
    // scene.add(gridHelper);

    //Axes Helper
    // const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);

    const lightAmbient = new THREE.AmbientLight(0xFFFFFF); // soft white light
    scene.add(lightAmbient);

    // const light = new THREE.PointLight( 0xffffff, 1, 100 );
    // light.position.set( 5,10,10 );
    // scene.add( light );

    animate();
    // Escenario
    loadModel_objMtl("../src/models/obj_mtl/escenario/", "escenario.obj", "escenario.mtl", 3);
    // Human Model
    loadModel_objMtl("../src/models/obj_mtl/personaje/", "personaje.obj", "personaje.mtl", 2);
    // Duck Model
    loadGltf('../src/models/gltf/pato/', 'Duck.gltf');

    createCollectibles();
    stateGame('');

    // Establecer la duración del temporizador en segundos (por ejemplo, 60 segundos)
    const duration = 60;
    startTimer(duration);

    // My Player
    createPlayer();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);

    //console.log(camera.position);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function loadModel_objMtl(path, nameObj, nameMtl, size) {
    // Load MTL
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setResourcePath(path);
    mtlLoader.setPath(path);
    mtlLoader.load(nameMtl, function (materials) {
        materials.preload();

        // Load OBJ
        var objLoader = new THREE.OBJLoader();
        objLoader.setPath(path);
        objLoader.setMaterials(materials);
        objLoader.load(nameObj, function (object) {
            scene.add(object);
            object.scale.set(size, size, size);
        });
    });
}

function loadGltf(path, nameGltfGet) {
    var nameGltf = path + nameGltfGet;

    // Instantiate a loader
    const loader = new THREE.GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath(path);
    loader.setDRACOLoader(dracoLoader);

    // Load a glTF resource
    loader.load(
        // resource URL
        nameGltf,
        // called when the resource is loaded
        function (gltf) {

            scene.add(gltf.scene);

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            gltf.scene.position.set(0, 0.5, 2);

        },
        // called while loading is progressing
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        }
    );
}

function createCollectibles() {
    const min = -5;
    const max = 5;
    for (var i = 0; i < 5; i++) {
        var posx = Math.floor(Math.random() * (max - min + 1) + min);
        var posz = Math.floor(Math.random() * (max - min + 1) + min);

        const texture = new THREE.TextureLoader().load('../src/img/paperGift.jpg');
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(posx, 1, posz);
        scene.add(cube);

        console.log(i);
    }
}

// function playSound() {
//     var myBackground = document.getElementById("myBackgroundSound");
//     myBackground.play();
// }


function stateGame(state) {
    switch (state) {
        case 'win':
            // audio & show img
            document.getElementById("winPage").style.display = "block";
            break;
        case 'lose':
            // audio & show img
            document.getElementById("losePage").style.display = "block";
            break;
        default:
            document.getElementById("winPage").style.display = "none";
            document.getElementById("losePage").style.display = "none";
            break;
    }
}

// Define una función para iniciar el temporizador
function startTimer(duration) {
    let timer = duration;
    const countdown = document.getElementById('countdown');

    function updateTimer() {
        countdown.textContent = timer;
        if (timer <= 0) {
            // Detener el temporizador
            clearInterval(interval);
            // Mostrar #losepage
            stateGame("lose");
        }
        timer--;
    }

    // Actualizar el temporizador inicialmente
    updateTimer();

    // Establecer un intervalo para actualizar el temporizador cada 1000 milisegundos (1 segundo)
    const interval = setInterval(updateTimer, 1000);
}

function createPlayer() {
    console.log("create player");

    const geometry = new THREE.BoxGeometry( 3, 6, 3 ); 
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe:true} ); 
    const cube = new THREE.Mesh( geometry, material ); 
    scene.add( cube );
    cube.position.y = 3;
}