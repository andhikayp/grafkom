function role() {
    var nameValue = document.getElementById("inputCount").value;
    // console.log(nameValue);
    $('canvas').remove();
    // for(var i = 0; i < nameValue; i++){
    //     console.log("wkwk");
    //     execute_dice (i);
    // }
    execute_dice (nameValue);
}

function execute_dice (i) {
    var scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
     
    var renderer = new THREE.WebGLRenderer();
    renderer.domElement.id = i;
    renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.setSize( 300, 400 );
    document.body.appendChild( renderer.domElement );
    camera.position.set(0,0,80);

    var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(-50, 0, 100);
     
    var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    fillLight.position.set(100, 0, 100);
     
    var backLight = new THREE.DirectionalLight(0x00000, 1.0);
    backLight.position.set(100, 0, -100).normalize();
     
    scene.add(keyLight);
    // scene.add(fillLight);
    scene.add(backLight);

    var fromLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(100, 0, 50);
    scene.add(fromLight);

    var object_obj = 'dice.obj';
    var object_mtl = 'dice.mtl';   
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath('./assets/');
    mtlLoader.setPath('./assets/');
    mtlLoader.load(object_mtl, function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('./assets/');
        objLoader.load(object_obj, function (object) {

            obj = object;
            // object.scale.set(10, 10, 10);
            obj.position.y -= 0;
            obj.position.x -= 0;
            obj.position.z -= 50;

            // obj1.scene.add(obj);

            scene.add(obj);
            // object.rotation.x(256);

            // object.position.y -= 0;
            // object.position.x -= 40;
            // object.position.z -= 30;
            // object.rotateX( 45 * Math.PI / 180 );
            // object.rotateX += 45 * Math.PI / 180 ;
        });
    });
    console.log(mtlLoader);

    // Cahaya
    // var pointLight = new THREE.PointLight( 0xffffff, 1 );
    // pointLight.position.set( 0, 30, 20 );
    // pointLight.castShadow = true;
    // pointLight.shadow.mapSize.width = 1024;
    // pointLight.shadow.mapSize.height = 1024;
    // pointLight.intensity = 1;
    // scene.add( pointLight );

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    var randomness = random_number();
    console.log(randomness)
    var default_value = 0;

    var animate = function () {
        // myObj.rotation.y = Date.now()*.002;
        requestAnimationFrame( animate );
        render();
        controls.enableKeys = true
        controls.keyPanSpeed = 30
        controls.maxPolarAngle = Math.PI /2

        controls.update();
    };
    function render() {
        default_value++;
        // console.log(default_value, randomness);
        if (default_value < randomness) {
            obj.rotation.x += Math.PI/2;
            // obj.rotation.y += Math.PI*3/2;
            obj.rotation.y += 1;
            // console.log(obj.rotation.y);
            // 1.5707963267948965
            // obj.rotation.y += Math.PI/2;
        }
        else if (default_value == randomness) {
            now = obj.rotation.y;
            bulat = now / (Math.PI/2);
            rotasi = (Math.ceil(bulat))*(Math.PI/2) - (now);

            obj.rotation.y += rotasi;
        }
        // else return;
        // obj.rotation.x += (0.2*(Math.PI / 180));
        // obj.rotation.x %=360;
        // console.log(obj.rotation.x);
        renderer.render( scene, camera );
    }
    animate();
}

function random_number() {
    return Math.floor(Math.random() * 100)
}
