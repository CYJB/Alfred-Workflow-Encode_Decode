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

const { encode: encodeHTML } = require('html-entities');
const { encode: encodeBase64 } = require('base64');
const { md5: encodeMD5 } = require('md5');

function run(argv) {
  const text = argv[0];
  const items = [];
  const urlEncode = encodeURIComponent(text);
  if (urlEncode !== text) {
    items.push({
      uid: 'URL',
      icon: {
        path: './icons/Encode_URL.png',
      },
      title: urlEncode,
      subtitle: '编码 URL',
      arg: urlEncode,
    });
  }
  const htmlEncode = encodeHTML(text);
  if (htmlEncode !== text) {
    items.push({
      uid: 'HTML',
      icon: {
        path: './icons/Encode_HTML.png',
      },
      title: htmlEncode,
      subtitle: '编码 HTML',
      arg: htmlEncode,
    });
  }
  const base64Encode = encodeBase64(text);
  items.push({
    uid: 'Base64',
    icon: {
      path: './icons/Encode_Base64.png',
    },
    title: base64Encode,
    subtitle: '编码 Base64',
    arg: base64Encode,
  });
  const md5Encode = encodeMD5(text);
  items.push({
    uid: 'MD5',
    icon: {
      path: './icons/Encode_MD5.png',
    },
    title: md5Encode,
    subtitle: '编码 MD5',
    arg: md5Encode,
  });
  return JSON.stringify({ items: items });
}
