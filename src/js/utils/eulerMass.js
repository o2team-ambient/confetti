/* eslint-disable */


import Vector2 from './vector2'


class EulerMass {
  constructor(_x, _y, _mass, _drag) {
    this.position = new Vector2(_x, _y);
    this.mass = _mass;
    this.drag = _drag;
    this.force = new Vector2(0, 0);
    this.velocity = new Vector2(0, 0);
  }
  AddForce(_f) {
    this.force.Add(_f);
  }
  Integrate(_dt) {
    var acc = this.CurrentForce(this.position);
    acc.Div(this.mass);
    var posDelta = new Vector2(this.velocity.x, this.velocity.y);
    posDelta.Mul(_dt);
    this.position.Add(posDelta);
    acc.Mul(_dt);
    this.velocity.Add(acc);
    this.force = new Vector2(0, 0);
  }
  CurrentForce(_pos, _vel) {
    var totalForce = new Vector2(this.force.x, this.force.y);
    var speed = this.velocity.Length();
    var dragVel = new Vector2(this.velocity.x, this.velocity.y);
    dragVel.Mul(this.drag * this.mass * speed);
    totalForce.Sub(dragVel);
    return totalForce;
  }

}

export default EulerMass