import * as THREE from './three.module.js';

import { OrbitControls } from './OrbitControls.js';
import { GLTFLoader } from './GLTFLoader.js';

let controls, camera, scene, model,renderer,elk_m;
let textureCube;
let sphereMesh, sphereMaterial;
var group = new THREE.Group();
var px = 0;
var py = -0.5;
var pz = 1200;
var isSnow = false;
var elk = false;

init();
animate();
music();
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


    //雪地模型
    const loader3 = new GLTFLoader();
    loader3.load( 'models/Snowscape.glb', function ( gltf ) {
        model = gltf.scene;
        model.scale.set(850, 850, 850);
        model.position.set(0,-280,-70);
        scene.add(model);

    });

    //圣诞树模型
    const loader4 = new GLTFLoader();
    loader4.load( 'models/Tree.glb', function ( gltf ) {
        model = gltf.scene;
        model.scale.set(530, 680, 530);
        model.position.set(370,-220,100);
        scene.add(model);

    });

    //松果模型
    const pine1 = new GLTFLoader();
    pine1.load( 'models/Pine.glb', function ( gltf ) {
        model = gltf.scene;
        model.scale.set(500, 500, 500);
        model.position.set(200,-215,-100);
        model.rotateX(Math.PI / 4);
        scene.add(model);
    });

    const pine2 = new GLTFLoader();
    pine2.load( 'models/Pine.glb', function ( gltf ) {
        model = gltf.scene;
        model.scale.set(500, 500, 500);
        model.position.set(210,-220,-120);
        model.rotateY(-Math.PI / 4);
        scene.add(model);
    });

    const pine3 = new GLTFLoader();
    pine3.load( 'models/Pine.glb', function ( gltf ) {
        model = gltf.scene;
        model.scale.set(500, 500, 500);
        model.position.set(50,-210,-160);
        model.rotateX(Math.PI / 2);
        scene.add(model);
    });
    
    //麋鹿模型
    const loader2 = new GLTFLoader();
    loader2.load( 'models/elk.glb', function ( gltf ) {
        elk_m = gltf.scene;
        elk_m.scale.set(300, 300, 300);
        elk_m.position.set(0,-130,0);
    });


    const geometry = new THREE.IcosahedronBufferGeometry(600, 15);
    sphereMaterial = new THREE.MeshLambertMaterial({ envMap: textureCube, opacity: 0.7, transparent: true });
    sphereMesh = new THREE.Mesh(geometry, sphereMaterial);
    scene.add(sphereMesh);


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
    document.addEventListener( 'keydown', onKeyDown, false );

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
            var myaudio=new Audio();
            myaudio.src="音效.mp3";
            myaudio.play();
            document.getElementById("btn1").innerHTML="雪停了";
        }
        else{
            scene.remove(group);
            document.getElementById("btn1").innerHTML="下雪了";
        }
    }
    document.getElementById("btn2").onclick = function () {
        
        var myaudio=new Audio();
        myaudio.src="音效.mp3";
        myaudio.play();
        if (pz == 1200) pz = 200;
        else pz = 1200;
        camera.position.set(px, py, pz);
    }

    document.getElementById("btn3").onclick = function (){
        elk = !elk;
        if(elk){
            scene.add(elk_m);
            var myaudio=new Audio();
            myaudio.src="音效.mp3";
            myaudio.play();
            document.getElementById("btn3").innerHTML="召回麋鹿";
        }
        else{
            scene.remove(elk_m);
            document.getElementById("btn3").innerHTML="召唤麋鹿";
        }
    }

    document.getElementById("btn4").onclick = function (){
        document.getElementById("paper").style.display="none";
        document.getElementById("paper-top").style.display="block";
    }

    document.getElementById("paper-top").onclick = function (){
        document.getElementById("paper").style.display="block";
        document.getElementById("paper-top").style.display="none";
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
          }
    });
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}
function onKeyDown(event) {
    px = camera.position.x;
    py = camera.position.y;
    pz = camera.position.z;
    switch (event.keyCode ) {
        case 33:
            pz-=5;
            break;

        case 34:
            pz+=5;
            break;

        case 37:
            px-=5;
            break;

        case 38:
            py+=5;
            break;

        case 39:
            px+=5;
            break;

        case 40:
            py-=5;
            break;

    }
    camera.position.set(px, py, pz);
}

function music(){
    var audio=new Audio();
    audio.src="Jingle Bell.mp3";
    audio.play();
}