import * as THREE from 'three';
import Scene from '../../../base/scene';

var vx = 0.1, 
    vy = 0.1;

class App extends Scene {
  setup(){
    this.camera.position.z = 100;
    this.ball = new THREE.Mesh( 
      new THREE.SphereGeometry( 5, 8, 8 ), 
      new THREE.MeshBasicMaterial( { color: 0x0000ff } )
    );
    this.scene.add( this.ball );
  }
  
  draw(){
    this.ball.position.x += vx;
    this.ball.position.y += vy;
    this.ball.rotation.x += 0.02;
    this.ball.rotation.y += 0.02;
    this.ball.rotation.z += 0.02;
  }
}

export default new App();