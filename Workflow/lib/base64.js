const { encodeUTF8Char, UTF8Decoder } = require('./utf-8');

/** Base64 字符表 */
const TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * 使用 Base64 编码指定的字符串，与 btoa 类似但支持 UTF-8。
 * @param {string} input 要编码的内容。
 * @returns {string} 编码的结果。
 */
function encodeBase64(input) {
  /** @type {string[]} */
  const output = [];
  /** @type {number[]} */
  const stack = [];
  let i = 0;
  let value = 0;
  const len = input.length;
  while (true) {
    while (stack.length < 3 && i < len) {
      encodeUTF8Char(input.charCodeAt(i++), stack);
    }
    if (stack.length >= 3) {
      // 读入 3 个字节（24bit）
      value = (stack[0] << 16) | (stack[1] << 8) | stack[2];
      stack.splice(0, 3);
      // 转换为 6bit。
      output.push(TABLE[value >> 18 & 0x3F]);
      output.push(TABLE[value >> 12 & 0x3F]);
      output.push(TABLE[value >> 6 & 0x3F]);
      output.push(TABLE[value & 0x3F]);
      continue;
    } else if (stack.length == 2) {
      value = (stack[0] << 8) | stack[1];
      output.push(TABLE[value >> 10]);
      output.push(TABLE[value >> 4 & 0x3F]);
      output.push(TABLE[(value & 0xF) << 2]);
      output.push('=');
    } else if (stack.length == 1) {
      value = stack[0];
      output.push(TABLE[value >> 2]);
      output.push(TABLE[(value & 0x3) << 4]);
      output.push('==');
    }
    return output.join('');
  }
};

/**
 * 解码指定 Base64 字符串，与 atob 等价。
 * @param {string} input 要解码的内容。
 * @param {boolean} utf8 是否作为 UTF-8 解析。
 * @returns {string} 解码的结果。
 */
function decodeBase64(input, utf8) {
  // 忽略空白字符 http://whatwg.org/html/common-microsyntaxes.html#space-character
  input = input.replace(/[\t\n\f\r ]/g, '');
  let len = input.length;
  if (len % 4 == 0) {
    input = input.replace(/==?$/, '');
    len = input.length;
  }
  // http://whatwg.org/C#alphanumeric-ascii-characters
  if (len % 4 == 1 || /[^+a-zA-Z0-9/]/.test(input)) {
    throw new Error('Invalid character: the string to be decoded is not correctly encoded.');
  }
  /** @type {string[]} */
  const output = [];
  const utf8Decoder = new UTF8Decoder();
  let char = '';
  let value = 0;
  let bitCounter = 0;
  for (let i = 0; i < len; i++) {
    char = TABLE.indexOf(input.charAt(i));
    value = bitCounter % 4 ? (value << 6) + char : char;
    if (bitCounter++ % 4) {
      const ch = 0xFF & value >> (-2 * bitCounter & 6);
      if (utf8) {
        utf8Decoder.decodeChar(ch, output);
      } else {
        output.push(String.fromCharCode(ch));
      }
    }
  }
  return output.join('');
};

/**
 * 将十六进制数据转换为字符串。
 * @param {string} input 十六进制数据。
 * @returns 转换后的字符串。
 */
function hex2bin(input) {
  var bin = '';
  for (let i = 0; i < input.length; i = i + 2) {
    bin += String.fromCharCode(parseInt(input.substr(i, 2), 16));
  }
  return bin;
}

module.exports = { encodeBase64, decodeBase64, hex2bin };

/*
for (const [value, base64] of [
  ['1', 'MQ=='],
  ['12', 'MTI='],
  ['123', 'MTIz'],
  ['1234', 'MTIzNA=='],
  ['12345', 'MTIzNDU='],
  ['123456', 'MTIzNDU2'],
  ['1234567', 'MTIzNDU2Nw=='],
  ['12345678', 'MTIzNDU2Nzg='],
  ['123456789', 'MTIzNDU2Nzg5'],
  ['1234567890', 'MTIzNDU2Nzg5MA=='],
  ['12345678901', 'MTIzNDU2Nzg5MDE='],
  ['123456789012', 'MTIzNDU2Nzg5MDEy'],
  ['1234567890123', 'MTIzNDU2Nzg5MDEyMw=='],
  ['12345678901234', 'MTIzNDU2Nzg5MDEyMzQ='],
  ['123456789012345', 'MTIzNDU2Nzg5MDEyMzQ1'],
  ['1234567890123456', 'MTIzNDU2Nzg5MDEyMzQ1Ng=='],
  ['12345678901234567', 'MTIzNDU2Nzg5MDEyMzQ1Njc='],
  ['123456789012345678', 'MTIzNDU2Nzg5MDEyMzQ1Njc4'],
  ['1234567890123456789', 'MTIzNDU2Nzg5MDEyMzQ1Njc4OQ=='],
  ['12345678901234567890', 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTA='],
  ['123456789012345678901', 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTAx'],
  ['1234567890123456789012', 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMg=='],
  ['1234567890123456789012/', 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMi8='],
]) {
  if (encodeBase64(value) != base64) {
    console.log(`encodeBase64('${value}') != '${base64}'`);
  }
  if (decodeBase64(base64) != value) {
    console.log(`decodeBase64('${base64}') != '${value}'`);
  }
}
*/
