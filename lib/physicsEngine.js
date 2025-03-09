import Matter from 'matter-js';

export class PhysicsEngine {
  constructor() {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.bodies = [];
  }

  init() {
    Matter.Engine.run(this.engine);
  }

  update(delta) {
    Matter.Engine.update(this.engine, delta);
  }

  createBody(x, y, width, height, options = {}) {
    const body = Matter.Bodies.rectangle(x, y, width, height, options);
    Matter.World.add(this.world, body);
    this.bodies.push(body);
    return body;
  }

  applyForce(body, force) {
    Matter.Body.applyForce(body, body.position, force);
  }

  setVelocity(body, velocity) {
    Matter.Body.setVelocity(body, velocity);
  }

  removeBody(body) {
    Matter.World.remove(this.world, body);
    this.bodies = this.bodies.filter(b => b !== body);
  }

  setGravity(x, y) {
    this.world.gravity.x = x;
    this.world.gravity.y = y;
  }

  addCollisionFilter(categoryA, categoryB, callback) {
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        if (
          (pair.bodyA.collisionFilter.category === categoryA && pair.bodyB.collisionFilter.category === categoryB) ||
          (pair.bodyA.collisionFilter.category === categoryB && pair.bodyB.collisionFilter.category === categoryA)
        ) {
          callback(pair.bodyA, pair.bodyB);
        }
      }
    });
  }
}