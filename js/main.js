import * as THREE from './three.module.js';

import { OrbitControls } from './OrbitControls.js';

let controls, camera, scene, renderer;
let textureCube;
let sphereMesh, sphereMaterial;
var group = new THREE.Group();
var px = 0;
var py = -0.5;
var pz = 1200;
var isSnow = false;

init();
animate();
function init() {
    // CAMERAS

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.set(px, py, pz);

    // SCENE

    scene = new THREE.Scene();

    // Lights

    const ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);

    // Textures

    const loader = new THREE.CubeTextureLoader();
    loader.setPath('textures/skybox/');

    textureCube = loader.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
    textureCube.encoding = THREE.sRGBEncoding;

    scene.background = textureCube;
    textureCube.mapping = THREE.CubeRefractionMapping;

    //

    const geometry = new THREE.IcosahedronBufferGeometry(600, 15);
    sphereMaterial = new THREE.MeshLambertMaterial({ envMap: textureCube, opacity: 0.7, transparent: true });
    sphereMesh = new THREE.Mesh(geometry, sphereMaterial);
    scene.add(sphereMesh);

    var geometry1 = new THREE.BoxGeometry(50, 50, 50);
    var material1 = new THREE.MeshLambertMaterial({
        color: 0x0000ff
    }); //材质对象Material
    var mesh1 = new THREE.Mesh(geometry1, material1); //网格模型对象Mesh
    scene.add(mesh1); //网格模型添加到场景中

    //


    var textureTree = new THREE.TextureLoader().load("textures/snow.png");

    
    // 批量创建雨滴精灵模型
    for (let i = 0; i < 1000; i++) {
        var spriteMaterial = new THREE.SpriteMaterial({
            map: textureTree,//设置精灵纹理贴图
        });
        // 创建精灵模型对象
        var sprite = new THREE.Sprite(spriteMaterial);
        scene.add(sprite);
        // 控制精灵大小,
        sprite.scale.set(10, 10, 1); //// 只需要设置x、y两个分量就可以
        var k1,k2,k3;
        do{
            var k1 = 2*(Math.random() - 0.5);
            var k2 = 2*(Math.random() - 0.5);
            var k3 = 2*(Math.random() - 0.5);
        }while(k1*k1+k2*k2+k3*k3>1);
        
        sprite.position.set(600 * k1, 600 * k2, 600 * k3)
        group.add(sprite);
    }


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    //

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 2500;

    //

    window.addEventListener('resize', onWindowResize, false);

    document.getElementById("btn1").onclick = function () {
        isSnow = !isSnow;
        if(isSnow){
            scene.add(group);
        }
        else{
            scene.remove(group);
        }
    }
    document.getElementById("btn2").onclick = function () {
        if (pz == 1200) pz = 200;
        else pz = 1200;
        camera.position.set(px, py, pz);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    group.children.forEach(sprite => {
        sprite.position.y -= 1;
        
        if ((sprite.position.x*sprite.position.x+sprite.position.y*sprite.position.y+sprite.position.z*sprite.position.z) > 600*600) {
            sprite.position.y = Math.sqrt(600*600-sprite.position.x*sprite.position.x-sprite.position.z*sprite.position.z)-2;
            //sprite.position.y = 0;
          }
    });
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}