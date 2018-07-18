/* eslint-disable */

const retina = window.devicePixelRatio,

  // Math shorthands
  PI = Math.PI,
  sqrt = Math.sqrt,
  round = Math.round,
  random = Math.random,
  cos = Math.cos,
  sin = Math.sin


function Vector2(_x, _y) {
  this.x = _x, this.y = _y;
  this.Length = function() {
    return sqrt(this.SqrLength());
  }
  this.SqrLength = function() {
    return this.x * this.x + this.y * this.y;
  }
  this.Add = function(_vec) {
    this.x += _vec.x;
    this.y += _vec.y;
  }
  this.Sub = function(_vec) {
    this.x -= _vec.x;
    this.y -= _vec.y;
  }
  this.Div = function(_f) {
    this.x /= _f;
    this.y /= _f;
  }
  this.Mul = function(_f) {
    this.x *= _f;
    this.y *= _f;
  }
  this.Normalize = function() {
    var sqrLen = this.SqrLength();
    if (sqrLen != 0) {
      var factor = 1.0 / sqrt(sqrLen);
      this.x *= factor;
      this.y *= factor;
    }
  }
  this.Normalized = function() {
    var sqrLen = this.SqrLength();
    if (sqrLen != 0) {
      var factor = 1.0 / sqrt(sqrLen);
      return new Vector2(this.x * factor, this.y * factor);
    }
    return new Vector2(0, 0);
  }
}
Vector2.Lerp = function(_vec0, _vec1, _t) {
  return new Vector2((_vec1.x - _vec0.x) * _t + _vec0.x, (_vec1.y - _vec0.y) * _t + _vec0.y);
}
Vector2.Distance = function(_vec0, _vec1) {
  return sqrt(Vector2.SqrDistance(_vec0, _vec1));
}
Vector2.SqrDistance = function(_vec0, _vec1) {
  var x = _vec0.x - _vec1.x;
  var y = _vec0.y - _vec1.y;
  return (x * x + y * y + z * z);
}
Vector2.Scale = function(_vec0, _vec1) {
  return new Vector2(_vec0.x * _vec1.x, _vec0.y * _vec1.y);
}
Vector2.Min = function(_vec0, _vec1) {
  return new Vector2(Math.min(_vec0.x, _vec1.x), Math.min(_vec0.y, _vec1.y));
}
Vector2.Max = function(_vec0, _vec1) {
  return new Vector2(Math.max(_vec0.x, _vec1.x), Math.max(_vec0.y, _vec1.y));
}
Vector2.ClampMagnitude = function(_vec0, _len) {
  var vecNorm = _vec0.Normalized;
  return new Vector2(vecNorm.x * _len, vecNorm.y * _len);
}
Vector2.Sub = function(_vec0, _vec1) {
  return new Vector2(_vec0.x - _vec1.x, _vec0.y - _vec1.y, _vec0.z - _vec1.z);
}

// class Vector2 {
//   constructor(_x, _y) {
//     this.x = _x, this.y = _y;
//   }

//   Length() {
//     return sqrt(this.SqrLength());
//   }
//   SqrLength() {
//     return this.x * this.x + this.y * this.y;
//   }
//   Add(_vec) {
//     this.x += _vec.x;
//     this.y += _vec.y;
//   }
//   Sub(_vec) {
//     this.x -= _vec.x;
//     this.y -= _vec.y;
//   }
//   Div(_f) {
//     this.x /= _f;
//     this.y /= _f;
//   }
//   Mul(_f) {
//     this.x *= _f;
//     this.y *= _f;
//   }
//   Normalize() {
//     var sqrLen = this.SqrLength();
//     if (sqrLen != 0) {
//       var factor = 1.0 / sqrt(sqrLen);
//       this.x *= factor;
//       this.y *= factor;
//     }
//   }
//   Normalized() {
//     var sqrLen = this.SqrLength();
//     if (sqrLen != 0) {
//       var factor = 1.0 / sqrt(sqrLen);
//       return new Vector2(this.x * factor, this.y * factor);
//     }
//     return new Vector2(0, 0);
//   }
//   Lerp(_vec0, _vec1, _t) {
//     return new Vector2((_vec1.x - _vec0.x) * _t + _vec0.x, (_vec1.y - _vec0.y) * _t + _vec0.y);
//   }
//   Distance(_vec0, _vec1) {
//     return sqrt(Vector2.SqrDistance(_vec0, _vec1));
//   }
//   SqrDistance(_vec0, _vec1) {
//     var x = _vec0.x - _vec1.x;
//     var y = _vec0.y - _vec1.y;
//     return (x * x + y * y + z * z);
//   }
//   Scale(_vec0, _vec1) {
//     return new Vector2(_vec0.x * _vec1.x, _vec0.y * _vec1.y);
//   }
//   Min(_vec0, _vec1) {
//     return new Vector2(Math.min(_vec0.x, _vec1.x), Math.min(_vec0.y, _vec1.y));
//   }
//   Max(_vec0, _vec1) {
//     return new Vector2(Math.max(_vec0.x, _vec1.x), Math.max(_vec0.y, _vec1.y));
//   }
//   ClampMagnitude(_vec0, _len) {
//     var vecNorm = _vec0.Normalized;
//     return new Vector2(vecNorm.x * _len, vecNorm.y * _len);
//   }
//   Sub(_vec0, _vec1) {
//     return new Vector2(_vec0.x - _vec1.x, _vec0.y - _vec1.y, _vec0.z - _vec1.z);
//   }
// }


export default Vector2
