/* eslint-disable */


import Vector2 from './vector2'

const retina = window.devicePixelRatio,
  // Math shorthands
  PI = Math.PI,
  round = Math.round,
  random = Math.random,
  cos = Math.cos,
  sin = Math.sin;

const DEG_TO_RAD = PI / 180,
  colors = [
    ["#df0049", "#660671"],
    ["#00e857", "#005291"],
    ["#2bebbc", "#05798a"],
    ["#ffd200", "#b06c00"]
  ];

class ConfettiPaper {
  constructor(_x, _y) {
    this.pos = new Vector2(_x, _y);
    this.rotationSpeed = (random() * 600 + 800);
    this.angle = DEG_TO_RAD * random() * 360;
    this.rotation = DEG_TO_RAD * random() * 360;
    this.cosA = 1.0;
    this.size = 5.0;
    this.oscillationSpeed = (random() * 1.5 + 0.5);
    this.xSpeed = 40.0;
    this.ySpeed = (random() * 60 + 50.0);
    this.corners = new Array();
    this.time = random();
    var ci = round(random() * (colors.length - 1));
    this.frontColor = colors[ci][0];
    this.backColor = colors[ci][1];

    for (var i = 0; i < 4; i++) {
      var dx = cos(this.angle + DEG_TO_RAD * (i * 90 + 45));
      var dy = sin(this.angle + DEG_TO_RAD * (i * 90 + 45));
      this.corners[i] = new Vector2(dx, dy);
    }

    this.bounds = new Vector2(0, 0);
  }

  Update(_dt) {
    this.time += _dt;
    this.rotation += this.rotationSpeed * _dt;
    this.cosA = cos(DEG_TO_RAD * this.rotation);
    this.pos.x += cos(this.time * this.oscillationSpeed) * this.xSpeed * _dt
    this.pos.y += this.ySpeed * _dt;
    if (this.pos.y > ConfettiPaper.bounds.y) {
      this.pos.x = random() * ConfettiPaper.bounds.x;
      this.pos.y = 0;
    }
  }

  Draw(_g) {
    if (this.cosA > 0) {
      _g.fillStyle = this.frontColor;
    } else {
      _g.fillStyle = this.backColor;
    }
    _g.beginPath();
    _g.moveTo((this.pos.x + this.corners[0].x * this.size) * retina, (this.pos.y + this.corners[0].y * this.size * this.cosA) * retina);
    for (var i = 1; i < 4; i++) {
      _g.lineTo((this.pos.x + this.corners[i].x * this.size) * retina, (this.pos.y + this.corners[i].y * this.size * this.cosA) * retina);
    }
    _g.closePath();
    _g.fill();
  }

}

export default ConfettiPaper