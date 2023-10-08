'use strict';

/*
 * Fastest md5 implementation around (JKM md5).
 * Credits: Joseph Myers
 *
 * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
 * @see http://jsperf.com/md5-shootout/7
 */

const hex_chr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

function md5cycle(x, k) {
  let a = x[0];
  let b = x[1];
  let c = x[2];
  let d = x[3];

  a += (b & c | ~b & d) + k[0] - 680876936 | 0;
  a = (a << 7 | a >>> 25) + b | 0;
  d += (a & b | ~a & c) + k[1] - 389564586 | 0;
  d = (d << 12 | d >>> 20) + a | 0;
  c += (d & a | ~d & b) + k[2] + 606105819 | 0;
  c = (c << 17 | c >>> 15) + d | 0;
  b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
  b = (b << 22 | b >>> 10) + c | 0;
  a += (b & c | ~b & d) + k[4] - 176418897 | 0;
  a = (a << 7 | a >>> 25) + b | 0;
  d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
  d = (d << 12 | d >>> 20) + a | 0;
  c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
  c = (c << 17 | c >>> 15) + d | 0;
  b += (c & d | ~c & a) + k[7] - 45705983 | 0;
  b = (b << 22 | b >>> 10) + c | 0;
  a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
  a = (a << 7 | a >>> 25) + b | 0;
  d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
  d = (d << 12 | d >>> 20) + a | 0;
  c += (d & a | ~d & b) + k[10] - 42063 | 0;
  c = (c << 17 | c >>> 15) + d | 0;
  b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
  b = (b << 22 | b >>> 10) + c | 0;
  a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
  a = (a << 7 | a >>> 25) + b | 0;
  d += (a & b | ~a & c) + k[13] - 40341101 | 0;
  d = (d << 12 | d >>> 20) + a | 0;
  c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
  c = (c << 17 | c >>> 15) + d | 0;
  b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
  b = (b << 22 | b >>> 10) + c | 0;

  a += (b & d | c & ~d) + k[1] - 165796510 | 0;
  a = (a << 5 | a >>> 27) + b | 0;
  d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
  d = (d << 9 | d >>> 23) + a | 0;
  c += (d & b | a & ~b) + k[11] + 643717713 | 0;
  c = (c << 14 | c >>> 18) + d | 0;
  b += (c & a | d & ~a) + k[0] - 373897302 | 0;
  b = (b << 20 | b >>> 12) + c | 0;
  a += (b & d | c & ~d) + k[5] - 701558691 | 0;
  a = (a << 5 | a >>> 27) + b | 0;
  d += (a & c | b & ~c) + k[10] + 38016083 | 0;
  d = (d << 9 | d >>> 23) + a | 0;
  c += (d & b | a & ~b) + k[15] - 660478335 | 0;
  c = (c << 14 | c >>> 18) + d | 0;
  b += (c & a | d & ~a) + k[4] - 405537848 | 0;
  b = (b << 20 | b >>> 12) + c | 0;
  a += (b & d | c & ~d) + k[9] + 568446438 | 0;
  a = (a << 5 | a >>> 27) + b | 0;
  d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
  d = (d << 9 | d >>> 23) + a | 0;
  c += (d & b | a & ~b) + k[3] - 187363961 | 0;
  c = (c << 14 | c >>> 18) + d | 0;
  b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
  b = (b << 20 | b >>> 12) + c | 0;
  a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
  a = (a << 5 | a >>> 27) + b | 0;
  d += (a & c | b & ~c) + k[2] - 51403784 | 0;
  d = (d << 9 | d >>> 23) + a | 0;
  c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
  c = (c << 14 | c >>> 18) + d | 0;
  b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
  b = (b << 20 | b >>> 12) + c | 0;

  a += (b ^ c ^ d) + k[5] - 378558 | 0;
  a = (a << 4 | a >>> 28) + b | 0;
  d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
  d = (d << 11 | d >>> 21) + a | 0;
  c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
  c = (c << 16 | c >>> 16) + d | 0;
  b += (c ^ d ^ a) + k[14] - 35309556 | 0;
  b = (b << 23 | b >>> 9) + c | 0;
  a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
  a = (a << 4 | a >>> 28) + b | 0;
  d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
  d = (d << 11 | d >>> 21) + a | 0;
  c += (d ^ a ^ b) + k[7] - 155497632 | 0;
  c = (c << 16 | c >>> 16) + d | 0;
  b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
  b = (b << 23 | b >>> 9) + c | 0;
  a += (b ^ c ^ d) + k[13] + 681279174 | 0;
  a = (a << 4 | a >>> 28) + b | 0;
  d += (a ^ b ^ c) + k[0] - 358537222 | 0;
  d = (d << 11 | d >>> 21) + a | 0;
  c += (d ^ a ^ b) + k[3] - 722521979 | 0;
  c = (c << 16 | c >>> 16) + d | 0;
  b += (c ^ d ^ a) + k[6] + 76029189 | 0;
  b = (b << 23 | b >>> 9) + c | 0;
  a += (b ^ c ^ d) + k[9] - 640364487 | 0;
  a = (a << 4 | a >>> 28) + b | 0;
  d += (a ^ b ^ c) + k[12] - 421815835 | 0;
  d = (d << 11 | d >>> 21) + a | 0;
  c += (d ^ a ^ b) + k[15] + 530742520 | 0;
  c = (c << 16 | c >>> 16) + d | 0;
  b += (c ^ d ^ a) + k[2] - 995338651 | 0;
  b = (b << 23 | b >>> 9) + c | 0;

  a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
  a = (a << 6 | a >>> 26) + b | 0;
  d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
  d = (d << 10 | d >>> 22) + a | 0;
  c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
  c = (c << 15 | c >>> 17) + d | 0;
  b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
  b = (b << 21 | b >>> 11) + c | 0;
  a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
  a = (a << 6 | a >>> 26) + b | 0;
  d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
  d = (d << 10 | d >>> 22) + a | 0;
  c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
  c = (c << 15 | c >>> 17) + d | 0;
  b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
  b = (b << 21 | b >>> 11) + c | 0;
  a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
  a = (a << 6 | a >>> 26) + b | 0;
  d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
  d = (d << 10 | d >>> 22) + a | 0;
  c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
  c = (c << 15 | c >>> 17) + d | 0;
  b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
  b = (b << 21 | b >>> 11) + c | 0;
  a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
  a = (a << 6 | a >>> 26) + b | 0;
  d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
  d = (d << 10 | d >>> 22) + a | 0;
  c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
  c = (c << 15 | c >>> 17) + d | 0;
  b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
  b = (b << 21 | b >>> 11) + c | 0;

  x[0] = a + x[0] | 0;
  x[1] = b + x[1] | 0;
  x[2] = c + x[2] | 0;
  x[3] = d + x[3] | 0;
}

function md5blk(s) {
  const md5blks = [];
  for (let i = 0; i < 64; i += 4) {
    md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
  }
  return md5blks;
}

function md51(s) {
  const n = s.length;
  const state = [1732584193, -271733879, -1732584194, 271733878];
  let i;
  let length;
  let tail;
  let tmp;
  let lo;
  let hi;

  for (i = 64; i <= n; i += 64) {
    md5cycle(state, md5blk(s.substring(i - 64, i)));
  }
  s = s.substring(i - 64);
  length = s.length;
  tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (i = 0; i < length; i += 1) {
    tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
  }
  tail[i >> 2] |= 0x80 << ((i % 4) << 3);
  if (i > 55) {
    md5cycle(state, tail);
    for (i = 0; i < 16; i += 1) {
      tail[i] = 0;
    }
  }

  // Beware that the final length might not fit in 32 bits so we take care of that
  tmp = n * 8;
  tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
  lo = parseInt(tmp[2], 16);
  hi = parseInt(tmp[1], 16) || 0;

  tail[14] = lo;
  tail[15] = hi;

  md5cycle(state, tail);
  return state;
}

function rhex(n) {
  let s = '';
  for (let j = 0; j < 4; j += 1) {
    s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
  }
  return s;
}

function hex(x) {
  for (let i = 0; i < x.length; i += 1) {
    x[i] = rhex(x[i]);
  }
  return x.join('');
}

// ---------------------------------------------------

/**
 * Helpers.
 */

function toUtf8(str) {
  if (/[\u0080-\uFFFF]/.test(str)) {
    str = unescape(encodeURIComponent(str));
  }
  return str;
}

function hexToBinaryString(hex) {
  var bytes = [],
    length = hex.length,
    x;

  for (x = 0; x < length - 1; x += 2) {
    bytes.push(parseInt(hex.substr(x, 2), 16));
  }

  return String.fromCharCode.apply(String, bytes);
}

// ---------------------------------------------------

/**
 * SparkMD5 OOP implementation.
 *
 * Use this class to perform an incremental md5, otherwise use the
 * static methods instead.
 */

class SparkMD5 {

  constructor() {
    // call reset to init the instance
    this.reset();
  }

  /**
   * Appends a string.
   * A conversion will be applied if an utf8 string is detected.
   *
   * @param {String} str The string to be appended
   *
   * @return {SparkMD5} The instance itself
   */
  append(str) {
    // Converts the string to utf8 bytes if necessary
    // Then append as binary
    this.appendBinary(toUtf8(str));

    return this;
  }

  /**
   * Appends a binary string.
   *
   * @param {String} contents The binary string to be appended
   *
   * @return {SparkMD5} The instance itself
   */
  appendBinary(contents) {
    this._buff += contents;
    this._length += contents.length;

    var length = this._buff.length,
      i;

    for (i = 64; i <= length; i += 64) {
      md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
    }

    this._buff = this._buff.substring(i - 64);

    return this;
  }

  /**
   * Finishes the incremental computation, reseting the internal state and
   * returning the result.
   *
   * @param {Boolean} raw True to get the raw string, false to get the hex string
   *
   * @return {String} The result
   */
  end(raw) {
    var buff = this._buff,
      length = buff.length,
      i,
      tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ret;

    for (i = 0; i < length; i += 1) {
      tail[i >> 2] |= buff.charCodeAt(i) << ((i % 4) << 3);
    }

    this._finish(tail, length);
    ret = hex(this._hash);

    if (raw) {
      ret = hexToBinaryString(ret);
    }

    this.reset();

    return ret;
  }

  /**
   * Resets the internal state of the computation.
   *
   * @return {SparkMD5} The instance itself
   */
  reset() {
    this._buff = '';
    this._length = 0;
    this._hash = [1732584193, -271733879, -1732584194, 271733878];

    return this;
  }

  /**
   * Finish the final calculation based on the tail.
   *
   * @param {Array}  tail   The tail (will be modified)
   * @param {Number} length The length of the remaining buffer
   */
  _finish(tail, length) {
    var i = length,
      tmp,
      lo,
      hi;

    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      md5cycle(this._hash, tail);
      for (i = 0; i < 16; i += 1) {
        tail[i] = 0;
      }
    }

    // Do the final computation based on the tail and length
    // Beware that the final length may not fit in 32 bits so we take care of that
    tmp = this._length * 8;
    tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
    lo = parseInt(tmp[2], 16);
    hi = parseInt(tmp[1], 16) || 0;

    tail[14] = lo;
    tail[15] = hi;
    md5cycle(this._hash, tail);
  }
}

exports.md5 = function (str) {
  const hash = md51(toUtf8(str));
  return hex(hash);
}

exports.SparkMD5 = SparkMD5;
