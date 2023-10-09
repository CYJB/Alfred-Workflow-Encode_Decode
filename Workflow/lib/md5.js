'use strict';

/*
 * Fastest md5 implementation around (JKM md5).
 * Credits: Joseph Myers
 *
 * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
 * @see http://jsperf.com/md5-shootout/7
 */

const { encodeUTF8Char } = require('./utf-8');

/**
 * 计算指定文本的 MD5。
 * @param {string} input 要计算的文本。
 * @returns {string} 指定文本的 MD5 字符串。
 */
function md5(input) {
  /** @type {number[]} */
  const chars = [];
  for (let i = 0; i < input.length; i++) {
    encodeUTF8Char(input.charCodeAt(i), chars);
  }
  const hash = md51(chars);
  return hex(hash);
}

/**
 * 计算指定字符代码数组的 MD5。
 * @param {number[]} input 字符代码数组。
 * @returns
 */
function md51(input) {
  let { length } = input;
  const state = [1732584193, -271733879, -1732584194, 271733878];
  let i = 0;
  const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (i = 64; i <= length; i += 64) {
    // 将 8 bit 数据合并为 32bit 位。
    for (let j = 0, k = i - 64; j < 64; j += 4) {
      data[j >> 2] = input[k + j] + (input[k + j + 1] << 8) + (input[k + j + 2] << 16) + (input[k + j + 3] << 24);
    }
    md5cycle(state, data);
  }
  // 处理剩余的数据。
  clear(data);
  let j = 0;
  for (i -= 64; i < length; i++, j++) {
    data[j >> 2] |= input[i] << ((j % 4) << 3);
  }
  data[j >> 2] |= 0x80 << ((j % 4) << 3);
  if (j > 55) {
    md5cycle(state, data);
    clear(data);
  }

  // 注意 bit 长度可能会大于 32 位范围，需要特殊处理一下。
  const tmp = (length * 8).toString(16).match(/(.*?)(.{0,8})$/);
  let lo = parseInt(tmp[2], 16);
  let hi = parseInt(tmp[1], 16) || 0;
  data[14] = lo;
  data[15] = hi;
  md5cycle(state, data);
  return state;
}

/**
 * 计算 MD5。
 * @param {number[]} state MD5 状态。
 * @param {number[]} data 数据。
 */
function md5cycle(state, data) {
  let [a, b, c, d] = state;
  a += (b & c | ~b & d) + data[0] - 680876936 | 0;
  a = (a << 7 | a >>> 25) + b | 0;
  d += (a & b | ~a & c) + data[1] - 389564586 | 0;
  d = (d << 12 | d >>> 20) + a | 0;
  c += (d & a | ~d & b) + data[2] + 606105819 | 0;
  c = (c << 17 | c >>> 15) + d | 0;
  b += (c & d | ~c & a) + data[3] - 1044525330 | 0;
  b = (b << 22 | b >>> 10) + c | 0;
  a += (b & c | ~b & d) + data[4] - 176418897 | 0;
  a = (a << 7 | a >>> 25) + b | 0;
  d += (a & b | ~a & c) + data[5] + 1200080426 | 0;
  d = (d << 12 | d >>> 20) + a | 0;
  c += (d & a | ~d & b) + data[6] - 1473231341 | 0;
  c = (c << 17 | c >>> 15) + d | 0;
  b += (c & d | ~c & a) + data[7] - 45705983 | 0;
  b = (b << 22 | b >>> 10) + c | 0;
  a += (b & c | ~b & d) + data[8] + 1770035416 | 0;
  a = (a << 7 | a >>> 25) + b | 0;
  d += (a & b | ~a & c) + data[9] - 1958414417 | 0;
  d = (d << 12 | d >>> 20) + a | 0;
  c += (d & a | ~d & b) + data[10] - 42063 | 0;
  c = (c << 17 | c >>> 15) + d | 0;
  b += (c & d | ~c & a) + data[11] - 1990404162 | 0;
  b = (b << 22 | b >>> 10) + c | 0;
  a += (b & c | ~b & d) + data[12] + 1804603682 | 0;
  a = (a << 7 | a >>> 25) + b | 0;
  d += (a & b | ~a & c) + data[13] - 40341101 | 0;
  d = (d << 12 | d >>> 20) + a | 0;
  c += (d & a | ~d & b) + data[14] - 1502002290 | 0;
  c = (c << 17 | c >>> 15) + d | 0;
  b += (c & d | ~c & a) + data[15] + 1236535329 | 0;
  b = (b << 22 | b >>> 10) + c | 0;

  a += (b & d | c & ~d) + data[1] - 165796510 | 0;
  a = (a << 5 | a >>> 27) + b | 0;
  d += (a & c | b & ~c) + data[6] - 1069501632 | 0;
  d = (d << 9 | d >>> 23) + a | 0;
  c += (d & b | a & ~b) + data[11] + 643717713 | 0;
  c = (c << 14 | c >>> 18) + d | 0;
  b += (c & a | d & ~a) + data[0] - 373897302 | 0;
  b = (b << 20 | b >>> 12) + c | 0;
  a += (b & d | c & ~d) + data[5] - 701558691 | 0;
  a = (a << 5 | a >>> 27) + b | 0;
  d += (a & c | b & ~c) + data[10] + 38016083 | 0;
  d = (d << 9 | d >>> 23) + a | 0;
  c += (d & b | a & ~b) + data[15] - 660478335 | 0;
  c = (c << 14 | c >>> 18) + d | 0;
  b += (c & a | d & ~a) + data[4] - 405537848 | 0;
  b = (b << 20 | b >>> 12) + c | 0;
  a += (b & d | c & ~d) + data[9] + 568446438 | 0;
  a = (a << 5 | a >>> 27) + b | 0;
  d += (a & c | b & ~c) + data[14] - 1019803690 | 0;
  d = (d << 9 | d >>> 23) + a | 0;
  c += (d & b | a & ~b) + data[3] - 187363961 | 0;
  c = (c << 14 | c >>> 18) + d | 0;
  b += (c & a | d & ~a) + data[8] + 1163531501 | 0;
  b = (b << 20 | b >>> 12) + c | 0;
  a += (b & d | c & ~d) + data[13] - 1444681467 | 0;
  a = (a << 5 | a >>> 27) + b | 0;
  d += (a & c | b & ~c) + data[2] - 51403784 | 0;
  d = (d << 9 | d >>> 23) + a | 0;
  c += (d & b | a & ~b) + data[7] + 1735328473 | 0;
  c = (c << 14 | c >>> 18) + d | 0;
  b += (c & a | d & ~a) + data[12] - 1926607734 | 0;
  b = (b << 20 | b >>> 12) + c | 0;

  a += (b ^ c ^ d) + data[5] - 378558 | 0;
  a = (a << 4 | a >>> 28) + b | 0;
  d += (a ^ b ^ c) + data[8] - 2022574463 | 0;
  d = (d << 11 | d >>> 21) + a | 0;
  c += (d ^ a ^ b) + data[11] + 1839030562 | 0;
  c = (c << 16 | c >>> 16) + d | 0;
  b += (c ^ d ^ a) + data[14] - 35309556 | 0;
  b = (b << 23 | b >>> 9) + c | 0;
  a += (b ^ c ^ d) + data[1] - 1530992060 | 0;
  a = (a << 4 | a >>> 28) + b | 0;
  d += (a ^ b ^ c) + data[4] + 1272893353 | 0;
  d = (d << 11 | d >>> 21) + a | 0;
  c += (d ^ a ^ b) + data[7] - 155497632 | 0;
  c = (c << 16 | c >>> 16) + d | 0;
  b += (c ^ d ^ a) + data[10] - 1094730640 | 0;
  b = (b << 23 | b >>> 9) + c | 0;
  a += (b ^ c ^ d) + data[13] + 681279174 | 0;
  a = (a << 4 | a >>> 28) + b | 0;
  d += (a ^ b ^ c) + data[0] - 358537222 | 0;
  d = (d << 11 | d >>> 21) + a | 0;
  c += (d ^ a ^ b) + data[3] - 722521979 | 0;
  c = (c << 16 | c >>> 16) + d | 0;
  b += (c ^ d ^ a) + data[6] + 76029189 | 0;
  b = (b << 23 | b >>> 9) + c | 0;
  a += (b ^ c ^ d) + data[9] - 640364487 | 0;
  a = (a << 4 | a >>> 28) + b | 0;
  d += (a ^ b ^ c) + data[12] - 421815835 | 0;
  d = (d << 11 | d >>> 21) + a | 0;
  c += (d ^ a ^ b) + data[15] + 530742520 | 0;
  c = (c << 16 | c >>> 16) + d | 0;
  b += (c ^ d ^ a) + data[2] - 995338651 | 0;
  b = (b << 23 | b >>> 9) + c | 0;

  a += (c ^ (b | ~d)) + data[0] - 198630844 | 0;
  a = (a << 6 | a >>> 26) + b | 0;
  d += (b ^ (a | ~c)) + data[7] + 1126891415 | 0;
  d = (d << 10 | d >>> 22) + a | 0;
  c += (a ^ (d | ~b)) + data[14] - 1416354905 | 0;
  c = (c << 15 | c >>> 17) + d | 0;
  b += (d ^ (c | ~a)) + data[5] - 57434055 | 0;
  b = (b << 21 | b >>> 11) + c | 0;
  a += (c ^ (b | ~d)) + data[12] + 1700485571 | 0;
  a = (a << 6 | a >>> 26) + b | 0;
  d += (b ^ (a | ~c)) + data[3] - 1894986606 | 0;
  d = (d << 10 | d >>> 22) + a | 0;
  c += (a ^ (d | ~b)) + data[10] - 1051523 | 0;
  c = (c << 15 | c >>> 17) + d | 0;
  b += (d ^ (c | ~a)) + data[1] - 2054922799 | 0;
  b = (b << 21 | b >>> 11) + c | 0;
  a += (c ^ (b | ~d)) + data[8] + 1873313359 | 0;
  a = (a << 6 | a >>> 26) + b | 0;
  d += (b ^ (a | ~c)) + data[15] - 30611744 | 0;
  d = (d << 10 | d >>> 22) + a | 0;
  c += (a ^ (d | ~b)) + data[6] - 1560198380 | 0;
  c = (c << 15 | c >>> 17) + d | 0;
  b += (d ^ (c | ~a)) + data[13] + 1309151649 | 0;
  b = (b << 21 | b >>> 11) + c | 0;
  a += (c ^ (b | ~d)) + data[4] - 145523070 | 0;
  a = (a << 6 | a >>> 26) + b | 0;
  d += (b ^ (a | ~c)) + data[11] - 1120210379 | 0;
  d = (d << 10 | d >>> 22) + a | 0;
  c += (a ^ (d | ~b)) + data[2] + 718787259 | 0;
  c = (c << 15 | c >>> 17) + d | 0;
  b += (d ^ (c | ~a)) + data[9] - 343485551 | 0;
  b = (b << 21 | b >>> 11) + c | 0;

  state[0] = a + state[0] | 0;
  state[1] = b + state[1] | 0;
  state[2] = c + state[2] | 0;
  state[3] = d + state[3] | 0;
}

/**
 * 将指定数据全部置 0。
 * @param {number[]} data 要清空的数据。
 */
function clear(data) {
  for (let i = 0; i < data.length; i++) {
    data[i] = 0;
  }
}

/**
 * 将指定数据转换为 HEX 表示。
 * @param {number[]} input 要转换的数据。
 * @returns {string} 指定数据的 HEX 表示。
 */
function hex(input) {
  for (let i = 0; i < input.length; i++) {
    input[i] = rhex(input[i]);
  }
  return input.join('');
}

const HexChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

/**
 * 将指定数字转换为逆序的 16 进制表示。
 * @param {number} value 要转换的数字。
 * @returns {string} 指定数字的逆序 16 进制表示。
 */
function rhex(value) {
  let result = '';
  for (let j = 0; j < 4; j += 1) {
    result += HexChar[(value >> (j * 8 + 4)) & 0x0F] + HexChar[(value >> (j * 8)) & 0x0F];
  }
  return result;
}

module.exports = { md5 };
