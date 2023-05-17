/** Base64 字符表 */
const TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * 使用 Base64 编码指定的字符串，与 btoa 类似但支持 UTF-8。
 */
exports.encode = function (input) {
  const output = [];
  const stack = [];
  let i = 0;
  let value;
  const len = input.length;
  while (true) {
    while (stack.length < 3 && i < len) {
      encodeUTF8(input.charCodeAt(i++), stack);
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
      output.push(TABLE[value >> 2 & 0x3F]);
      output.push('=');
    } else if (stack.length == 1) {
      value = stack[0];
      output.push(TABLE[value >> 2]);
      output.push(TABLE[(value << 4) & 0x3F]);
      output.push('==');
    }
    return output.join('');
  }
};

/**
 * 将指定字符转换为 UTF-8 编码。
 */
function encodeUTF8(char, output) {
  if (char < 0xFF) {
    output.push(char);
  } else if (char < 0x800) {
    output.push(0xC0 | ((char >> 6) & 0x1F));
    output.push(0x80 | ((char >> 0) & 0x3F));
  } else {
    output.push(0xE0 | ((char >> 12) & 0x0F));
    output.push(0x80 | ((char >> 6) & 0x3F));
    output.push(0x80 | ((char >> 0) & 0x3F));
  }
}

/**
 * 解码指定 Base64 字符串，与 atob 等价。
 */
exports.decode = function (input, utf8) {
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
  const output = [];
  let char;
  let value;
  let bitCounter = 0;
  for (let i = 0; i < len; i++) {
    char = TABLE.indexOf(input.charAt(i));
    value = bitCounter % 4 ? (value << 6) + char : char;
    if (bitCounter++ % 4) {
      const ch = 0xFF & value >> (-2 * bitCounter & 6);
      if (utf8) {
        decodeUTF8(ch, output);
      } else {
        output.push(String.fromCharCode(ch));
      }
    }
  }
  return output.join('');
};

/** 解码 UTF-8 的状态 */
let decodeUTF8State = 0;
/** 解码 UTF-8 用到的临时值 */
let decodeUTF8Value;

/**
 * 将指定 UTF-8 编码转换为字符串。
 */
function decodeUTF8(char, output) {
  switch (decodeUTF8State) {
    case 0:
      // 默认状态
      switch (char >> 4) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          // 0xxxxxxx
          output.push(String.fromCharCode(char));
          break;
        case 12: case 13:
          // 110x xxxx   10xx xxxx
          decodeUTF8Value = (char & 0x1F) << 6;
          decodeUTF8State = 1;
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          decodeUTF8State = 2;
          decodeUTF8Value = (char & 0x0F) << 12;
          break;
      }
      break;
    case 1:
      // 110x 的第二个部分，或者 111x 的第三个部分
      output.push(String.fromCharCode(decodeUTF8Value | (char & 0x3F)));
      decodeUTF8State = 0;
      break;
    case 2:
      // 111x 的第二个部分
      decodeUTF8Value |= (char & 0x3F) << 6;
      decodeUTF8State = 1;
      break;
  }
}
