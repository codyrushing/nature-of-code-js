import Vec2 from './vector';

export default class Mover {
  constructor({position, velocity, mass, acceleration=new Vec2(0,0), i=null}){
    this.position = position;
    this.velocity = velocity;
    this.initialVelocity = velocity.clone();
    this.acceleration = acceleration;
    this.mass = mass;
    this.i = i;
  }
  update(){
    // add the two forces together to get net force, which is used to derive acceleration
    this.skipMove = false;
    this.checkEdges();
    this.acceleration = this.getAcceleration();
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.draw();
  }
  getAcceleration(){
    // override this
  }
  checkEdges([width, height], groundElasticFactor){
    if(this.position.x >= width || this.position.x <= 0){
      let overlap = this.position.x > 0
        ? this.position.x - width
        : this.position.x;

      // set the velocity to what it was at zero
      if(this.velocity.x){
        let prevVelocity = this.velocity.x - this.acceleration.x;
        let prevPosition = this.position.x - this.velocity.x;
        this.velocity.x = prevVelocity + (
            this.acceleration.x
            *
            (this.velocity.x - prevVelocity)
            /
            (this.position.x - prevPosition)
          );

      }
      // flip the velocity with elasticity factor
      this.velocity.x *= -(groundElasticFactor || 1);
      this.velocity.x -= this.acceleration.x;
      // set position to the edge
      this.position.x -= overlap;
    }
    if(this.position.y >= height || this.position.y <= 0){
      let overlap = this.position.y > 0
        ? this.position.y - height
        : this.position.y;

      // set the velocity to what it was at zero
      if(this.velocity.y){
        let prevVelocity = this.velocity.y - this.acceleration.y;
        let prevPosition = this.position.y - this.velocity.y;
        this.velocity.y = prevVelocity + (
            this.acceleration.y
            *
            (this.velocity.y - prevVelocity)
            /
            (this.position.y - prevPosition)
          );

      }
      // flip the velocity with elasticity factor
      this.velocity.y *= -(groundElasticFactor || 1);
      this.velocity.y -= this.acceleration.y;
      // set position to the edge
      this.position.y -= overlap;
    }
  }
  draw(context){
    context.beginPath();
    context.fillStyle = 'red';
    context.arc(this.position.x, this.position.y, this.mass, 0, 2 * Math.PI);
    context.fill();
    context.strokeStyle = 'black';
    context.stroke();
  }
}
