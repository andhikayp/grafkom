function role() {
    var nameValue = document.getElementById("inputCount").value;
    var speed = document.getElementById("speed").value;
    var variant = document.getElementById("variant").value;
    $('canvas').remove();
    $( "#tulisan" ).empty();
    $( "#divID" ).empty();
    execute_dice (nameValue, speed, variant);
}

function execute_dice (nameValue, speed, variant) {
    var scene = new THREE.Scene();
    scene.background = new THREE.Color('white');
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.set(0,0,120);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(0, -60, 100);
    var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    fillLight.position.set(0, -60, 100);
    var backLight = new THREE.DirectionalLight(0x00000, 1.0);
    backLight.position.set(0, -60, -100).normalize();
    var fromLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(0, -60, 50);

    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);
    scene.add(fromLight);

    var obj = []
    x_posisi = -35*(nameValue-1);
    for(var i = 0; i < nameValue; i++){
        object_loader(i, x_posisi, variant);
        x_posisi = x_posisi + 70;
    }

    function object_loader(nilai, x_posisi, variant) {
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
                obj[nilai] = object;
                obj[nilai].position.y -= -60;
                obj[nilai].position.x -= x_posisi;
                obj[nilai].position.z -= 100;

                if (variant == 1) { feature = "New_Normal_OpenGL.png" }
                else if (variant == 2) { feature = "New_Metallic.png" }
                else if (variant == 3) { feature = "New_RedBase_Color.png" }
                else if (variant == 4) { feature = "floor.png" }
                else if (variant == 5) { feature = "New_BlueBase_Color.png" }
                else if (variant == 6) { feature = "thikness.png" }

                var texture = new THREE.TextureLoader().load(feature);
                obj[nilai].traverse(function (child) {  
                    if (child instanceof THREE.Mesh) {
                        child.material.map = texture;
                    }
                });
                scene.add(obj[nilai]);
            });
        });
    } 

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    // var randomness = random_number();
    var randomness = 200;
    var default_value = 0;

    var animate = function () {
        requestAnimationFrame( animate );
        render(speed);
        controls.enableKeys = true
        controls.keyPanSpeed = 30
        controls.maxPolarAngle = Math.PI /2

        controls.update();
    };

    function render(speed) {
        default_value++;
        if (default_value < randomness) {
            for(var i = 0; i < nameValue; i++){
                if (default_value<150) {putar = Number(speed);}
                else {putar = 0.04}

                if (i%4==0) {
                    obj[i].rotation.y += putar;
                    obj[i].rotation.x += putar;
                }
                else if (i%4==1) {
                    obj[i].rotation.y -= putar;
                    obj[i].rotation.x -= putar;                
                }       
                else if (i%4==2) {
                    obj[i].rotation.y -= putar;
                    obj[i].rotation.x += putar; 
                }         
                else {
                    obj[i].rotation.y += putar;
                    obj[i].rotation.x -= putar; 
                }
            }
        }
        else if (default_value == randomness) {
            var y_value;
            var x_value;
            var final_result = []
            // console.log(final_result)
            for(var i = 0; i < nameValue; i++){
                now = obj[i].rotation.y;
                bulat = now / (Math.PI/2);
                rotasi = (Math.ceil(bulat))*(Math.PI/2) - (now);
                obj[i].rotation.y += rotasi;

                now = obj[i].rotation.x;
                bulat = now / (Math.PI/2);
                rotasi = (Math.ceil(bulat))*(Math.PI/2) - (now);
                obj[i].rotation.x += rotasi;

                obj[i].rotation.y += Math.PI/2*(Math.floor(Math.random() * 10));
                obj[i].rotation.x += Math.PI/2*(Math.floor(Math.random() * 10));
                console.log(obj[i].rotation.x, obj[i].rotation.y)

                y_angka =  Math.floor((obj[i].rotation.y / (Math.PI/2))+0.1);
                x_angka =  Math.floor((obj[i].rotation.x / (Math.PI/2))+0.1);
                console.log(x_angka);

                if (y_angka>0) {
                    if (y_angka%4 == 0) {y_value = 1}
                    else if (y_angka%4 == 1) {y_value = 3}
                    else if (y_angka%4 == 2) {y_value = 6}
                    else if (y_angka%4 == 3) {y_value = 5}
                }
                else {
                    if (y_angka%4 == 0) {y_value = 1}
                    else if (y_angka%4 == -1) {y_value = 5}
                    else if (y_angka%4 == -2) {y_value = 6}
                    else if (y_angka%4 == -3) {y_value = 3}
                }

                if (x_angka>0) {
                    if (x_angka%4 == 0) {x_value = 1}
                    else if (x_angka%4 == 1) {x_value = 4}
                    else if (x_angka%4 == 2) {x_value = 6}
                    else if (x_angka%4 == 3) {x_value = 2}
                }
                else {
                    if (x_angka%4 == 0) {x_value = 1}
                    else if (x_angka%4 == -1) {x_value = 2}
                    else if (x_angka%4 == -2) {x_value = 6}
                    else if (x_angka%4 == -3) {x_value = 4}
                }
                
                if (y_value == 5 && x_value == 6) {final_result[i] = 3}
                else if (y_value == 3 && x_value == 6) {final_result[i] = 5}
                else if (y_value == 6 && x_value == 6) {final_result[i] = 1}
                else if (y_value == 1 && x_value == 6) {final_result[i] = 6}
                else if (x_value == 2 || x_value == 4) {final_result[i] = x_value}
                else if (x_value == 1) {final_result[i] = y_value}
                console.log(y_value, x_value)
            }
            console.log(final_result)
            final_result = final_result.reverse()
            var txt2 = $("#tulisan").text("The Result: "); 
            var div = document.getElementById('divID');
            div.innerHTML += final_result;                        

            return;
        }
        renderer.render( scene, camera );
    }
    animate();
}

function random_number() {
    return Math.floor(Math.random() * 200)
}