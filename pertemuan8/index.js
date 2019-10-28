
function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);


  const fov = 60;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 200;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 30;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  // put the camera on a pole (parent it to an object)
  // so we can spin the pole to move the camera around the scene
  const cameraPole = new THREE.Object3D();
  scene.add(cameraPole);
  cameraPole.add(camera);

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    camera.add(light);
  }

  function rand(min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return min + (max - min) * Math.random();
  }

  function randomColor() {
    return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
  }

  function random_number() {
    return Math.floor(Math.random() * 10)
  }

  var loader = new THREE.FontLoader();
  var font = loader.parse(fontJSON);
    
  const numObjects = 20;
  for (let i = 0; i < numObjects; ++i) {
    var random_value = random_number()
    mesh = make_text(random_value)
    mesh.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
    // mesh.rotation.set(rand(Math.PI/2), rand(Math.PI/2), 0);
    mesh.scale.set(rand(3, 5), rand(3, 5), rand(3, 5));
  }

  function make_text(random_value) {
    var geometry1 = new THREE.TextGeometry(random_value.toString(), {
      font: font, 
      size: 2,
      height: 0.2, 
      material: 0, 
      extrudeMaterial: 1,
      curveSegments: 1,
      bevelEnabled: false,
    });
    var material = new THREE.MeshPhongMaterial({
      color: randomColor(),
    });
    var mesh = new THREE.Mesh(geometry1, material);
    scene.add(mesh);
    return mesh
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  var x
  var last 
  class PickHelper {
    constructor() {
      this.raycaster = new THREE.Raycaster();
      this.pickedObject = null;
      this.pickedObjectSavedColor = 0;
    }
    pick(normalizedPosition, scene, camera, time) {
      // restore the color if there is a picked object
      if (this.pickedObject) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }

      // cast a ray through the frustum
      this.raycaster.setFromCamera(normalizedPosition, camera);
      // get the list of objects the ray intersected
      const intersectedObjects = this.raycaster.intersectObjects(scene.children);
      if (intersectedObjects.length) {
        // pick the first object. It's the closest one
        this.pickedObject = intersectedObjects[0].object;
        if (x == null) {
          x = this.pickedObject 
        }
        else if (x == this.pickedObject) {
        }
        else {
          if (this.pickedObject.geometry.parameters.text == x.geometry.parameters.text) {
            scene.remove(x)
            last = this.pickedObject
            scene.remove(this.pickedObject)
            mesh = make_text(this.pickedObject.geometry.parameters.text * 2)
            mesh.position.set(last.position.x, last.position.y, last.position.z);
            // mesh.rotation.set(rand(Math.PI/2), rand(Math.PI/2), 0);
            mesh.scale.set(last.scale.x, last.scale.y, last.scale.z);
          }
          else {
            x = this.pickedObject
          }
        }
        // console.log(this.pickedObject.geometry.parameters.text, x.geometry.parameters.text)
        // save its color
        this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
        // set its emissive color to flashing red/yellow
        this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
      }
    }
  }

  const pickPosition = {x: 0, y: 0};
  const pickHelper = new PickHelper();
  clearPickPosition();

  function render(time) {
    time *= 0.001;  // convert to seconds;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cameraPole.rotation.y = time * .1;

    pickHelper.pick(pickPosition, scene, camera, time);

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / canvas.clientWidth ) *  2 - 1;
    pickPosition.y = (pos.y / canvas.clientHeight) * -2 + 1;  // note we flip Y
  }

  function clearPickPosition() {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }
  // window.addEventListener('mousemove', setPickPosition);
  window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);
  window.addEventListener('mousedown', setPickPosition);

  window.addEventListener('touchstart', (event) => {
    // prevent the window from scrolling
    event.preventDefault();
    setPickPosition(event.touches[0]);
  }, {passive: false});

  window.addEventListener('touchmove', (event) => {
    setPickPosition(event.touches[0]);
  });

  window.addEventListener('touchend', clearPickPosition);

}

main();
