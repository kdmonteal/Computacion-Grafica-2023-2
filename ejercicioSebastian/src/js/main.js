/* Author: Jhoan Sebastian Ortiz Alvarez
   Date of creation: 23/08/2023
   Last Modification: 26/08/2023 
*/

//Creation elements
var scene = null,
    camera = null,
    renderer = null,
    controls = null,
    cube = null,
    torus = null,
    cone = null,
    shapesArray = [];

const size = 20,
      divisions = 20;

function startScene() {
    // Scene, Camera, Renderer
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x524E4E)
    camera = new THREE.PerspectiveCamera( 
        75,                                        //Angulo de visión(Abajo o arriba) 
        window.innerWidth / window.innerHeight,    //Relación de aspecto 16:9
        0.1,                                       //Mas cerca (no renderiza)
        1000 );                                    //Mas lejos ()

    renderer = new THREE.WebGLRenderer({canvas: document.getElementById('app')});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //Orbit controls
    controls = new THREE.OrbitControls(camera,renderer.domElement);
    camera.position.set(0,0,0);
    controls.update();

    camera.position.z = 20;

    //Grid Helper
    const gridHelper = new THREE.GridHelper( size, divisions);
    scene.add( gridHelper );

    //Axes Helper
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );    

    animate();
}

function addShape(shapeType){
    var geometry, material, mesh;

    switch (shapeType) {
        case 'cube':
            geometry = new THREE.BoxGeometry(1, 1, 1);
            material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe:true });
            mesh = new THREE.Mesh(geometry, material);
            break;
        case 'torus':
            geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
            material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe:true });
            mesh = new THREE.Mesh(geometry, material);
            break;
        case 'cone':
            geometry = new THREE.ConeGeometry(0.5, 1, 16);
            material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe:true });
            mesh = new THREE.Mesh(geometry, material);
            break;
        default:
            return; 
    }

    const x = (Math.random() - 0.5) * size;
    const y = Math.random() * 5;
    const z = (Math.random() - 0.5) * size;

    mesh.position.set(x, y, z);
    scene.add(mesh);

    shapesArray.push(mesh);
}

function clearScene() {
    // Remove all shapes from the scene.
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
            scene.remove(child);
        }
    });
}


function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);

    shapesArray.forEach(shape => {
        shape.rotation.x += 0.01;
        shape.rotation.y += 0.01;
    });
}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize( window.innerWidth, window.innerHeight );

}



