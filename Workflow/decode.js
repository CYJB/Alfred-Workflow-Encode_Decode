#! /usr/bin/osascript -l JavaScript

const app = Application.currentApplication();
app.includeStandardAdditions = true;

// 引入 require 方法。
let require;
{
  const requirePath = './lib/require.js';
  const handle = app.openForAccess(requirePath);
  const content = app.read(handle);
  app.closeAccess(requirePath);
  require = eval(content)(app);
}

const { Result } = require('./lib/alfred');
const { decodeBase64 } = require('./lib/base64');
const { decodeHTML } = require('./lib/html-entities');

/**
 * 执行脚本。
 * @param {string[]} argv 参数。
 */
function run(argv) {
  const text = argv[0];
  const result = new Result();
  const urlDecode = decodeURIComponent(text);
  if (urlDecode !== text) {
    result.add({
      uid: 'URL',
      icon: {
        path: './icons/Decode_URL.png',
      },
      title: urlDecode,
      subtitle: '解码 URL',
    });
  }
  const htmlDecode = decodeHTML(text);
  if (htmlDecode !== text) {
    result.add({
      uid: 'HTML',
      icon: {
        path: './icons/Decode_HTML.png',
      },
      title: htmlDecode,
      subtitle: '解码 HTML',
    });
  }
  try {
    const base64Decode = decodeBase64(text, true);
    result.add({
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
      result.add({
        uid: 'Base64_2',
        icon: {
          path: './icons/Decode_Base64.png',
        },
        title: binaryDecode,
        subtitle: '解码 Base64（二进制）',
      });
    }
  } catch (ignored) { }
  if (result.length === 0) {
    return Result.error('无解码结果', '解码后的字符串与原始内容一致');
  }
  return result.toString();
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
