(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.ATAmbient = factory());
}(this, (function () { 'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css = "@charset \"UTF-8\";\n/* 自定义样式 */\n.o2team_ambient_main {\n  z-index: 999;\n  pointer-events: none;\n  width: 100%;\n  height: 100%; }\n";
  styleInject(css);

  const id = 'confetti';
  const ID = id.toUpperCase();
  const O2_AMBIENT_MAIN = `O2_AMBIENT_${ID}_MAIN`;
  const O2_AMBIENT_INIT = `O2_AMBIENT_${ID}_INIT`;
  const O2_AMBIENT_CONFIG = `O2_AMBIENT_${ID}_CONFIG`;
  const O2_AMBIENT_CLASSNAME = `o2_ambient_${id}`;

  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
  // MIT license
  (function () {
    let lastTime = 0;
    const vendors = ['ms', 'moz', 'webkit', 'o'];

    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[`${vendors[x]}RequestAnimationFrame`];
      window.cancelAnimationFrame = window[`${vendors[x]}CancelAnimationFrame`] || window[`${vendors[x]}CancelRequestAnimationFrame`];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback, element) {
        const currTime = new Date().getTime();
        const timeToCall = Math.max(0, 16 - (currTime - lastTime));
        const id = window.setTimeout(function () {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }
  })();

  function getDevicePixelRatio() {
    let result = 1;

    if (window.devicePixelRatio) {
      result = window.devicePixelRatio >= 2 ? 2 : 1;
    }

    return result;
  }

  /* eslint-disable */
  const retina = window.devicePixelRatio,
        // Math shorthands
  PI = Math.PI,
        sqrt = Math.sqrt;

  function Vector2(_x, _y) {
    this.x = _x, this.y = _y;

    this.Length = function () {
      return sqrt(this.SqrLength());
    };

    this.SqrLength = function () {
      return this.x * this.x + this.y * this.y;
    };

    this.Add = function (_vec) {
      this.x += _vec.x;
      this.y += _vec.y;
    };

    this.Sub = function (_vec) {
      this.x -= _vec.x;
      this.y -= _vec.y;
    };

    this.Div = function (_f) {
      this.x /= _f;
      this.y /= _f;
    };

    this.Mul = function (_f) {
      this.x *= _f;
      this.y *= _f;
    };

    this.Normalize = function () {
      var sqrLen = this.SqrLength();

      if (sqrLen != 0) {
        var factor = 1.0 / sqrt(sqrLen);
        this.x *= factor;
        this.y *= factor;
      }
    };

    this.Normalized = function () {
      var sqrLen = this.SqrLength();

      if (sqrLen != 0) {
        var factor = 1.0 / sqrt(sqrLen);
        return new Vector2(this.x * factor, this.y * factor);
      }

      return new Vector2(0, 0);
    };
  }

  Vector2.Lerp = function (_vec0, _vec1, _t) {
    return new Vector2((_vec1.x - _vec0.x) * _t + _vec0.x, (_vec1.y - _vec0.y) * _t + _vec0.y);
  };

  Vector2.Distance = function (_vec0, _vec1) {
    return sqrt(Vector2.SqrDistance(_vec0, _vec1));
  };

  Vector2.SqrDistance = function (_vec0, _vec1) {
    var x = _vec0.x - _vec1.x;
    var y = _vec0.y - _vec1.y;
    return x * x + y * y + z * z;
  };

  Vector2.Scale = function (_vec0, _vec1) {
    return new Vector2(_vec0.x * _vec1.x, _vec0.y * _vec1.y);
  };

  Vector2.Min = function (_vec0, _vec1) {
    return new Vector2(Math.min(_vec0.x, _vec1.x), Math.min(_vec0.y, _vec1.y));
  };

  Vector2.Max = function (_vec0, _vec1) {
    return new Vector2(Math.max(_vec0.x, _vec1.x), Math.max(_vec0.y, _vec1.y));
  };

  Vector2.ClampMagnitude = function (_vec0, _len) {
    var vecNorm = _vec0.Normalized;
    return new Vector2(vecNorm.x * _len, vecNorm.y * _len);
  };

  Vector2.Sub = function (_vec0, _vec1) {
    return new Vector2(_vec0.x - _vec1.x, _vec0.y - _vec1.y, _vec0.z - _vec1.z);
  }; // class Vector2 {

  /* eslint-disable */

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

  /* eslint-disable */
  const retina$1 = window.devicePixelRatio,
        // Math shorthands
  PI$1 = Math.PI,
        sqrt$1 = Math.sqrt,
        round$1 = Math.round,
        random$1 = Math.random,
        cos$1 = Math.cos,
        sin$1 = Math.sin;
  const DEG_TO_RAD = PI$1 / 180,
        colors = [["#df0049", "#660671"], ["#00e857", "#005291"], ["#2bebbc", "#05798a"], ["#ffd200", "#b06c00"]];

  class ConfettiRibbon {
    constructor(_x, _y, _count, _dist, _thickness, _angle, _mass, _drag) {
      this.bounds = new Vector2(0, 0);
      this.particleDist = _dist;
      this.particleCount = _count;
      this.particleMass = _mass;
      this.particleDrag = _drag;
      var ci = round$1(random$1() * (colors.length - 1));
      this.frontColor = colors[ci][0];
      this.backColor = colors[ci][1];
      this.xOff = cos$1(DEG_TO_RAD * _angle) * _thickness;
      this.yOff = sin$1(DEG_TO_RAD * _angle) * _thickness;
      this.position = new Vector2(_x, _y);
      this.prevPosition = new Vector2(_x, _y);
      this.velocityInherit = random$1() * 2 + 4;
      this.time = random$1() * 100;
      this.oscillationSpeed = random$1() * 2 + 2;
      this.oscillationDistance = random$1() * 40 + 40;
      this.ySpeed = random$1() * 40 + 80;
      this.particles = new Array();

      for (var i = 0; i < this.particleCount; i++) {
        this.particles[i] = new EulerMass(_x, _y - i * this.particleDist, this.particleMass, this.particleDrag);
      }
    }

    Update(_dt) {
      var i = 0;
      this.time += _dt * this.oscillationSpeed;
      this.position.y += this.ySpeed * _dt;
      this.position.x += cos$1(this.time) * this.oscillationDistance * _dt;
      this.particles[0].position = this.position;
      var dX = this.prevPosition.x - this.position.x;
      var dY = this.prevPosition.y - this.position.y;
      var delta = sqrt$1(dX * dX + dY * dY);
      this.prevPosition = new Vector2(this.position.x, this.position.y);

      for (i = 1; i < this.particleCount; i++) {
        var dirP = Vector2.Sub(this.particles[i - 1].position, this.particles[i].position);
        dirP.Normalize();
        dirP.Mul(delta / _dt * this.velocityInherit);
        this.particles[i].AddForce(dirP);
      }

      for (i = 1; i < this.particleCount; i++) {
        this.particles[i].Integrate(_dt);
      }

      for (i = 1; i < this.particleCount; i++) {
        var rp2 = new Vector2(this.particles[i].position.x, this.particles[i].position.y);
        rp2.Sub(this.particles[i - 1].position);
        rp2.Normalize();
        rp2.Mul(this.particleDist);
        rp2.Add(this.particles[i - 1].position);
        this.particles[i].position = rp2;
      }

      if (this.position.y > ConfettiRibbon.bounds.y + this.particleDist * this.particleCount) {
        this.Reset();
      }
    }

    Reset() {
      this.position.y = -random$1() * ConfettiRibbon.bounds.y;
      this.position.x = random$1() * ConfettiRibbon.bounds.x;
      this.prevPosition = new Vector2(this.position.x, this.position.y);
      this.velocityInherit = random$1() * 2 + 4;
      this.time = random$1() * 100;
      this.oscillationSpeed = random$1() * 2.0 + 1.5;
      this.oscillationDistance = random$1() * 40 + 40;
      this.ySpeed = random$1() * 40 + 80;
      var ci = round$1(random$1() * (colors.length - 1));
      this.frontColor = colors[ci][0];
      this.backColor = colors[ci][1];
      this.particles = new Array();

      for (var i = 0; i < this.particleCount; i++) {
        this.particles[i] = new EulerMass(this.position.x, this.position.y - i * this.particleDist, this.particleMass, this.particleDrag);
      }
    }

    Draw(_g) {
      for (var i = 0; i < this.particleCount - 1; i++) {
        var p0 = new Vector2(this.particles[i].position.x + this.xOff, this.particles[i].position.y + this.yOff);
        var p1 = new Vector2(this.particles[i + 1].position.x + this.xOff, this.particles[i + 1].position.y + this.yOff);

        if (this.Side(this.particles[i].position.x, this.particles[i].position.y, this.particles[i + 1].position.x, this.particles[i + 1].position.y, p1.x, p1.y) < 0) {
          _g.fillStyle = this.frontColor;
          _g.strokeStyle = this.frontColor;
        } else {
          _g.fillStyle = this.backColor;
          _g.strokeStyle = this.backColor;
        }

        if (i == 0) {
          _g.beginPath();

          _g.moveTo(this.particles[i].position.x * retina$1, this.particles[i].position.y * retina$1);

          _g.lineTo(this.particles[i + 1].position.x * retina$1, this.particles[i + 1].position.y * retina$1);

          _g.lineTo((this.particles[i + 1].position.x + p1.x) * 0.5 * retina$1, (this.particles[i + 1].position.y + p1.y) * 0.5 * retina$1);

          _g.closePath();

          _g.stroke();

          _g.fill();

          _g.beginPath();

          _g.moveTo(p1.x * retina$1, p1.y * retina$1);

          _g.lineTo(p0.x * retina$1, p0.y * retina$1);

          _g.lineTo((this.particles[i + 1].position.x + p1.x) * 0.5 * retina$1, (this.particles[i + 1].position.y + p1.y) * 0.5 * retina$1);

          _g.closePath();

          _g.stroke();

          _g.fill();
        } else if (i == this.particleCount - 2) {
          _g.beginPath();

          _g.moveTo(this.particles[i].position.x * retina$1, this.particles[i].position.y * retina$1);

          _g.lineTo(this.particles[i + 1].position.x * retina$1, this.particles[i + 1].position.y * retina$1);

          _g.lineTo((this.particles[i].position.x + p0.x) * 0.5 * retina$1, (this.particles[i].position.y + p0.y) * 0.5 * retina$1);

          _g.closePath();

          _g.stroke();

          _g.fill();

          _g.beginPath();

          _g.moveTo(p1.x * retina$1, p1.y * retina$1);

          _g.lineTo(p0.x * retina$1, p0.y * retina$1);

          _g.lineTo((this.particles[i].position.x + p0.x) * 0.5 * retina$1, (this.particles[i].position.y + p0.y) * 0.5 * retina$1);

          _g.closePath();

          _g.stroke();

          _g.fill();
        } else {
          _g.beginPath();

          _g.moveTo(this.particles[i].position.x * retina$1, this.particles[i].position.y * retina$1);

          _g.lineTo(this.particles[i + 1].position.x * retina$1, this.particles[i + 1].position.y * retina$1);

          _g.lineTo(p1.x * retina$1, p1.y * retina$1);

          _g.lineTo(p0.x * retina$1, p0.y * retina$1);

          _g.closePath();

          _g.stroke();

          _g.fill();
        }
      }
    }

    Side(x1, y1, x2, y2, x3, y3) {
      return (x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2);
    }

  }

  /* eslint-disable */
  const retina$2 = window.devicePixelRatio,
        // Math shorthands
  PI$2 = Math.PI,
        round$2 = Math.round,
        random$2 = Math.random,
        cos$2 = Math.cos,
        sin$2 = Math.sin;
  const DEG_TO_RAD$1 = PI$2 / 180,
        colors$1 = [["#df0049", "#660671"], ["#00e857", "#005291"], ["#2bebbc", "#05798a"], ["#ffd200", "#b06c00"]];

  class ConfettiPaper {
    constructor(_x, _y) {
      this.pos = new Vector2(_x, _y);
      this.rotationSpeed = random$2() * 600 + 800;
      this.angle = DEG_TO_RAD$1 * random$2() * 360;
      this.rotation = DEG_TO_RAD$1 * random$2() * 360;
      this.cosA = 1.0;
      this.size = 5.0;
      this.oscillationSpeed = random$2() * 1.5 + 0.5;
      this.xSpeed = 40.0;
      this.ySpeed = random$2() * 60 + 50.0;
      this.corners = new Array();
      this.time = random$2();
      var ci = round$2(random$2() * (colors$1.length - 1));
      this.frontColor = colors$1[ci][0];
      this.backColor = colors$1[ci][1];

      for (var i = 0; i < 4; i++) {
        var dx = cos$2(this.angle + DEG_TO_RAD$1 * (i * 90 + 45));
        var dy = sin$2(this.angle + DEG_TO_RAD$1 * (i * 90 + 45));
        this.corners[i] = new Vector2(dx, dy);
      }

      this.bounds = new Vector2(0, 0);
    }

    Update(_dt) {
      this.time += _dt;
      this.rotation += this.rotationSpeed * _dt;
      this.cosA = cos$2(DEG_TO_RAD$1 * this.rotation);
      this.pos.x += cos$2(this.time * this.oscillationSpeed) * this.xSpeed * _dt;
      this.pos.y += this.ySpeed * _dt;

      if (this.pos.y > ConfettiPaper.bounds.y) {
        this.pos.x = random$2() * ConfettiPaper.bounds.x;
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

      _g.moveTo((this.pos.x + this.corners[0].x * this.size) * retina$2, (this.pos.y + this.corners[0].y * this.size * this.cosA) * retina$2);

      for (var i = 1; i < 4; i++) {
        _g.lineTo((this.pos.x + this.corners[i].x * this.size) * retina$2, (this.pos.y + this.corners[i].y * this.size * this.cosA) * retina$2);
      }

      _g.closePath();

      _g.fill();
    }

  }

  /* eslint-disable */
  const ribbonPaperThick = 8.0,
        ribbonPaperCount = 30,
        random$3 = Math.random,
        ribbonPaperDist = 8.0,
        rAF = window.requestAnimationFrame,
        cAF = window.cancelAnimationFrame || window.cancelRequestAnimationFrame;

  class Confetti {
    constructor() {
      this.devicePixelRatio = getDevicePixelRatio();
      this.width = window.innerWidth * this.devicePixelRatio;
      this.height = window.innerHeight * this.devicePixelRatio;
      this.parent = document.body;
      this.FPS = 30;
      this.className = O2_AMBIENT_CLASSNAME;
      this.isPaused = false;
      this.setConfig();
      this.bindEvents();
      this.initDOM();
      this.initConfig();
      this.play();
    }

    setConfig() {
      let config = window[O2_AMBIENT_CONFIG];
      this._config = {
        confettiRibbon: config.confettiRibbon,
        confettiPaperCount: config.confettiPaperCount,
        duration: 1.0 / config.speed
      };
    }

    initDOM() {
      const domMain = document.querySelector('.o2team_ambient_main');
      const canvas = domMain.querySelector('canvas');
      console.log(canvas);
      const devicePixelRatio = this.devicePixelRatio;
      canvas.style.position = 'fixed';
      canvas.style.left = '0';
      canvas.style.top = '0';
      canvas.style.width = `${this.width / devicePixelRatio}px`;
      canvas.style.height = `${this.height / devicePixelRatio}px`;
      canvas.style.zIndex = 2;
      canvas.style.pointerEvents = 'none';
      canvas.className = this.className;
      canvas.width = this.width;
      canvas.height = this.height; // this.parent.appendChild(canvas)

      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
    }

    bindEvents() {
      this.resizeSelf = this.windowResizeHandle.bind(this);
      window.addEventListener('resize', this.resizeSelf, false);
    }

    unbindEvents() {
      window.removeEventListener('resize', this.resizeSelf, false);
    }

    windowResizeHandle(e) {
      const devicePixelRatio = this.devicePixelRatio;
      this.width = window.innerWidth * devicePixelRatio;
      this.height = window.innerHeight * devicePixelRatio;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.canvas.style.width = `${this.width / devicePixelRatio}px`;
      this.canvas.style.height = `${this.height / devicePixelRatio}px`;
      ConfettiPaper.bounds = new Vector2(this.width, this.height);
      ConfettiRibbon.bounds = new Vector2(this.width, this.height);
    }

    pause() {
      this.isPaused = true;
    }

    toggle() {
      this.isPaused ? this.play() : this.stop();
    }

    play() {
      this.isPaused = false;
      this.update();
    }

    initConfig() {
      this.confettiRibbons = [];
      ConfettiRibbon.bounds = new Vector2(this.width, this.height);

      for (let i = 0; i < this._config.confettiRibbon; i++) {
        this.confettiRibbons[i] = new ConfettiRibbon(random$3() * this.width, -random$3() * this.height * 2, ribbonPaperCount, ribbonPaperDist, ribbonPaperThick, 45, 1, 0.05);
      }

      this.confettiPapers = [];
      ConfettiPaper.bounds = new Vector2(this.width, this.height);

      for (let i = 0; i < this._config.confettiPaperCount; i++) {
        this.confettiPapers[i] = new ConfettiPaper(random$3() * this.width, random$3() * this.height);
      }
    }

    reset() {
      this.setConfig();
      this.stop();
      this.initConfig();
      this.play();
    }

    stop() {
      cAF(this.interval);
      this.pause();
    }

    update() {
      let _ = this;

      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this._config.confettiPaperCount; i++) {
        this.confettiPapers[i].Update(this._config.duration);
        this.confettiPapers[i].Draw(this.ctx);
      }

      for (let i = 0; i < this._config.confettiRibbon; i++) {
        this.confettiRibbons[i].Update(this._config.duration);
        this.confettiRibbons[i].Draw(this.ctx);
      }

      this.interval = rAF(function () {
        if (_.isPaused) {
          return;
        }

        _.update();
      });
    }

  }

  let wrapper = document.querySelector('.o2team_ambient_main');

  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'o2team_ambient_main');
    wrapper.setAttribute('id', 'o2team_ambient_main');
    wrapper.insertAdjacentElement('beforeend', document.createElement('canvas'));
    document.body.insertAdjacentElement('beforeend', wrapper);
  }

  wrapper.addEventListener('click', () => {
    wrapper.style.display = 'none';
  }); // 初始化函数

  function initAmbient() {
    const config = window[O2_AMBIENT_CONFIG];
    window[O2_AMBIENT_MAIN] = new Confetti();
  } // 初始化函数

  window[O2_AMBIENT_INIT] = initAmbient;

  window[O2_AMBIENT_CONFIG] = {
    speed: 50,
    confettiRibbon: 11,
    confettiPaperCount: 95
  };

  function rollup_index (opts) {
    opts && Object.keys(window[O2_AMBIENT_CONFIG]).forEach(key => {
      if (typeof opts[key] === 'undefined') return;
      window[O2_AMBIENT_CONFIG][key] = opts[key];
    });
    initAmbient();
  }

  return rollup_index;

})));
