import * as THREE from 'three';

const defaultParams = {
  fov: 75,
  width: window.innerWidth,
  height: window.innerHeight,
  near: 0.1,
  far: 1000,
  container: document.body
};

export default class Scene {
  constructor(params={}){
    this.params = {
      ...defaultParams,
      ...params
    };
    this.animate = this.animate.bind(this);
    this.init();
  }
  init(){
    const { fov, width, height, near, far, container } = this.params;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( fov, width/height, near, far );
    this.camera.lookAt(this.scene.position);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( width, height );
    container.appendChild( this.renderer.domElement );
    this.setup();
    this.animate();
  }
  animate(){
    window.requestAnimationFrame(this.animate);
    this.draw();
    this.renderer.render(this.scene, this.camera);
  }
  setup(){
    //
  }
  draw(){
    //
  }
}
