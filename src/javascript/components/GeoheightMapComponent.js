
import _ from 'underscore';

import { TweenLite } from 'gsap/TweenLite';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class GeoheightMapComponent {

  constructor() {

    _.bindAll(
        this,
        '_tickHandler',
        '_resizeHandler'
    );

    this.ui = {
      canvas: document.querySelector('.js-geoheightmap-component')
    }

    console.log(this.ui.canvas)

    this._setup();

  }

  _setup() {
    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(75, this._width/this._height, 1, 10000); 
    this._camera.position.y = 10;//Look Down   
    this._camera.lookAt(0, 0, 0);
    this._renderer = new THREE.WebGLRenderer({
        canvas: this.ui.canvas,
        antialias: true,
    });
    this._setupEventListener();
    this._resize();
    // this._loadTexture();
    this._build();
    this._setupLights();
    this._setupControls();
}

// _loadTexture() {
//     this._image = 'assets/img/noise.jpg';
//     return new Promise(resolve => {
//         this._texture = new THREE.TextureLoader().load(this._image, resolve);
//     }).then(() => {
//         this._build();
//     });
// }

_build() {
    this._vertexShader = document.getElementById('vertexShader1').textContent;
    this._fragmentShader = document.getElementById('fragmentShader1').textContent;

    this._uniforms = {
        uTime: {
            value: 0.0
        }, 
        scale: {
            value: 2.3
        }, 
        frequency: { type: 'f', value: 8 },
        noiseScale: { type: 'f', value: 50 },
        ringScale: { type: 'f', value: 1 },
        color1: { type: 'c', value: new THREE.Color(0xffffff) },
        color2: { type: 'c', value: new THREE.Color(0x000000) }
    };

    this._material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: this._uniforms,
        vertexShader: this._vertexShader,
        fragmentShader: this._fragmentShader,

    });

    this._geometry = new THREE.SphereGeometry(10, 100, 100);
    // this._geometry = new THREE.PlaneGeometry(80, 80);

    this._delta = 0;

    this._plane = new THREE.Mesh(this._geometry, this._material);
    this._plane.emissive = new THREE.Color(0x0000ff);
    this._plane.emissiveIntensity = 1;
    this._plane.position.set(0, 0, 0);
    this._plane.rotation.x = -1.55;

    this._addMeshesToScene();
}

_setupLights() {
    this._frontLight = new THREE.DirectionalLight(0xffffff, 1);
    this._frontLight.position.set(0, 0, 1000);
    this._backLight = new THREE.DirectionalLight(0xffffff, 1);
    this._backLight.position.set(0, 0, -1000);
    this._leftLight = new THREE.DirectionalLight(0xffffff, 1);
    this._leftLight.position.set(-1000, 0, 0);
    this._rightLight = new THREE.DirectionalLight(0xffffff, 1);
    this._rightLight.position.set(1000, 0, 0);
    this._bottomLight = new THREE.DirectionalLight(0xffffff, 1);
    this._bottomLight.position.set(0, -1000, 0);
    this._topLight = new THREE.DirectionalLight(0xffffff, 1);
    this._topLight.position.set(0, 1000, 0);

    this._addLightsToScene();
}

_draw() {
    this._renderer.render(this._scene, this._camera);
}

_addMeshesToScene() {
    this._scene.add(this._plane);
}

_addLightsToScene() {
    this._scene.add(this._frontLight);
    this._scene.add(this._backLight);
    this._scene.add(this._leftLight);
    this._scene.add(this._rightLight);
    this._scene.add(this._bottomLight);
    this._scene.add(this._topLight);
}

_setupControls() {
    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    var gui = new dat.GUI();

    if (this._uniforms != undefined) {
        gui.add(this._uniforms.scale, 'value', 1, 100).onChange(() => {
            this._material.uniforms.scale.value = this._uniforms.scale;
        });
    }
}

_tick() {
    if (this._material != undefined) {
        // this._plane.rotation.x += 0.01;
        // this._plane.rotation.y += 0.01;
        this._delta += 0.005;
        this._material.uniforms.scale.value = Math.cos(this._delta);
        this._material.uniforms.frequency.value = Math.sin(this._delta);
        // console.log(this._material.uniforms.frequency.value);
    }
    this._draw();
    this._controls.update();
}

_resize() {
    this._width = window.innerWidth;
    this._height = window.window.innerHeight;
    this._camera.aspect = this._width/this._height;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(this._width, this._height); 
}

_setupEventListener() {
    window.addEventListener('resize', this._resizeHandler);

    TweenLite.ticker.addEventListener('tick', this._tickHandler);
}

_tickHandler() {
    this._tick();
}

_resizeHandler() {
    this._resize();
}

}

export default new GeoheightMapComponent();
