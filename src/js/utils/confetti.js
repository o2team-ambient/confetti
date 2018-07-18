/* eslint-disable */


import { O2_AMBIENT_CLASSNAME, O2_AMBIENT_CONFIG } from './const'
import { getDevicePixelRatio } from './util'


import Vector2 from './vector2'
import ConfettiRibbon from './confettiRibbon'
import ConfettiPaper from './confettiPaper'

const ribbonPaperThick = 8.0,
  ribbonPaperCount = 30,
  random = Math.random,
  ribbonPaperDist = 8.0,
  rAF = window.requestAnimationFrame,
  cAF = window.cancelAnimationFrame || window.cancelRequestAnimationFrame

class Confetti {
  constructor() {

    this.devicePixelRatio = getDevicePixelRatio()
    this.width = window.innerWidth * this.devicePixelRatio
    this.height = window.innerHeight * this.devicePixelRatio
    this.parent = document.body
    this.FPS = 30
    this.className = O2_AMBIENT_CLASSNAME
    this.isPaused = false

    this.setConfig()

    this.bindEvents()
    this.initDOM()
    this.initConfig()
    this.play()
  }
  setConfig() {
    let config = window[O2_AMBIENT_CONFIG]
    this._config = {
      confettiRibbon: config.confettiRibbon,
      confettiPaperCount: config.confettiPaperCount,
      duration: 1.0 / config.speed
    }
  }
  initDOM() {
    const canvas = document.createElement('canvas')
    const devicePixelRatio = this.devicePixelRatio
    canvas.style.position = 'fixed'
    canvas.style.left = '0'
    canvas.style.top = '0'
    canvas.style.width = `${this.width / devicePixelRatio}px`
    canvas.style.height = `${this.height / devicePixelRatio}px`
    canvas.style.zIndex = 2
    canvas.style.pointerEvents = 'none'
    canvas.className = this.className
    canvas.width = this.width
    canvas.height = this.height
    this.parent.appendChild(canvas)
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }

  bindEvents() {
    this.resizeSelf = this.windowResizeHandle.bind(this)
    window.addEventListener('resize', this.resizeSelf, false)
  }

  unbindEvents() {
    window.removeEventListener('resize', this.resizeSelf, false)
  }

  windowResizeHandle(e) {
    const devicePixelRatio = this.devicePixelRatio

    this.width = window.innerWidth * devicePixelRatio
    this.height = window.innerHeight * devicePixelRatio
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.canvas.style.width = `${this.width / devicePixelRatio}px`
    this.canvas.style.height = `${this.height / devicePixelRatio}px`

    ConfettiPaper.bounds = new Vector2(this.width, this.height);
    ConfettiRibbon.bounds = new Vector2(this.width, this.height);
  }

  pause() {
    this.isPaused = true
  }

  toggle() {
    this.isPaused ?
      this.play() :
      this.stop()
  }

  play() {
    this.isPaused = false
    this.update();

  }

  initConfig() {
    this.confettiRibbons = []
    ConfettiRibbon.bounds = new Vector2(this.width, this.height);
    for (let i = 0; i < this._config.confettiRibbon; i++) {
      this.confettiRibbons[i] = new ConfettiRibbon(random() * this.width, -random() * this.height * 2, ribbonPaperCount, ribbonPaperDist, ribbonPaperThick, 45, 1, 0.05);
    }
    this.confettiPapers = []
    ConfettiPaper.bounds = new Vector2(this.width, this.height);
    for (let i = 0; i < this._config.confettiPaperCount; i++) {
      this.confettiPapers[i] = new ConfettiPaper(random() * this.width, random() * this.height);
    }
  }

  reset() {
    this.setConfig()
    this.stop()
    this.initConfig()
    this.play()
  }

  stop() {
    cAF(this.interval);
    this.pause()
  }

  update() {
    let _ = this
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this._config.confettiPaperCount; i++) {
      this.confettiPapers[i].Update(this._config.duration);
      this.confettiPapers[i].Draw(this.ctx);
    }
    for (let i = 0; i < this._config.confettiRibbon; i++) {
      this.confettiRibbons[i].Update(this._config.duration);
      this.confettiRibbons[i].Draw(this.ctx);
    }
    this.interval = rAF(function() {
      if (_.isPaused) {
        return;
      }
      _.update();
    });
  }
}

export default Confetti