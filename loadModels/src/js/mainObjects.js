//Creation elements
var scene = null,
    camera = null,
    renderer = null,
    controls = null;

const size = 20,
    divisions = 20;

function startScene() {
    // Scene, Camera, Renderer
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x33FFC5);
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
    camera.position.set(0, 0, 20);
    controls.update();

    //Grid Helper
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    //Axes Helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
    scene.add( light );

    animate();
    loadModel_objMtl();
}

function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function loadModel_objMtl() {
    // Load MTL
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setResourcePath("../src/models/obj_mtl/escenario/");
    mtlLoader.setPath("../src/models/obj_mtl/escenario/");
    mtlLoader.load("escenario.mtl", function (materials) {
        materials.preload();

        // Load OBJ
        var objLoader = new THREE.OBJLoader();
        objLoader.setPath("../src/models/obj_mtl/escenario/");
        objLoader.setMaterials(materials);
        objLoader.load("escenario.obj", function (object) {
            scene.add(object);
            // object.scale.set(5,5,5);
        });
    });

   
}