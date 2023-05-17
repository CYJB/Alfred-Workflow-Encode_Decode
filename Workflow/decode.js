#! /usr/bin/osascript -l JavaScript

const app = Application.currentApplication();
app.includeStandardAdditions = true;

/** 被引用的模块 */
const requiredModuels = new Map();
/** 引用指定的模块 */
function require(path) {
  let exports = requiredModuels.get(path);
  if (exports) {
    return exports;
  }
  exports = {};
  requiredModuels.set(path, exports);
  path = `utils/${path}.js`;
  const handle = app.openForAccess(path);
  const content = app.read(handle);
  app.closeAccess(path);
  (function (__content__, exports) {
    eval(__content__);
  })(content, exports);
  return exports;
}

const { decode: decodeHTML } = require('html-entities');
const { decode: decodeBase64 } = require('base64');

function run(argv) {
  const text = argv[0];
  const items = [];
  const urlDecode = decodeURIComponent(text);
  if (urlDecode !== text) {
    items.push({
      uid: 'URL',
      icon: {
        path: './icons/Decode_URL.png',
      },
      title: urlDecode,
      subtitle: '解码 URL',
      arg: urlDecode,
    });
  }
  const htmlDecode = decodeHTML(text);
  if (htmlDecode !== text) {
    items.push({
      uid: 'HTML',
      icon: {
        path: './icons/Decode_HTML.png',
      },
      title: htmlDecode,
      subtitle: '解码 HTML',
      arg: htmlDecode,
    });
  }
  try {
    const base64Decode = decodeBase64(text, true);
    items.push({
      uid: 'Base64',
      icon: {
        path: './icons/Decode_Base64.png',
      },
      title: encodeControl(base64Decode),
      subtitle: '解码 Base64',
      arg: base64Decode,
    });
    // 检查是否存在不可见字符，范围为 Cc（排除 \b\t\n\v\f\r）、Cf、Cn、Cs、M 和 Z。
    if (/[\x00-\x07\x0E-\x1F\x7F-\x9F]|\p{Cf}|\p{Cn}|\p{Cs}|\p{M}|\p{Z}/u.test(base64Decode)) {
      // 需要重新解码一次，不再处理 UTF-8
      let binaryDecode = encodeBinary(decodeBase64(text, false));
      items.push({
        uid: 'Base64_2',
        icon: {
          path: './icons/Decode_Base64.png',
        },
        title: binaryDecode,
        subtitle: '解码 Base64（二进制）',
        arg: binaryDecode,
      });
    }
  } catch (ignored) { }
  if (items.length === 0) {
    items.push({
      uid: 'None',
      title: '无解码结果',
      subtitle: '解码后的字符串与原始内容一致',
      valid: false,
    });
  }
  return JSON.stringify({ items: items });
}

/**
 * 控制字符的映射表。
 */
const controlMap = {
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\v': '\\v',
  '\f': '\\f',
  '\r': '\\r',
};

/**
 * 编码部分控制字符 \b\t\n\v\f\r。
 * @param {string} str 要编码的字符串。
 */
function encodeControl(str) {
  return str.replace(/[\b\t\n\v\f\r]/g, ch => controlMap[ch]);
}

/**
 * 编码为二进制。
 * @param {string} str 要编码的字符串。
 */
function encodeBinary(str) {
  const result = [];
  for (let i = 0; i < str.length; i++) {
    if (i > 0 && i % 8 === 0) {
      result.push(' ');
    }
    result.push(str.charCodeAt(i).toString(16).padStart(2, '0'));
  }
  return result.join('');
}
