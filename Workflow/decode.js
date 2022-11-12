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
    const base64Decode = decodeBase64(text);
    items.push({
      uid: 'Base64',
      icon: {
        path: './icons/Decode_Base64.png',
      },
      title: base64Decode,
      subtitle: '解码 Base64',
      arg: base64Decode,
    });
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
