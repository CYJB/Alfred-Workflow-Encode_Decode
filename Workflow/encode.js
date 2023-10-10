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

const { encodeHTML } = require('./lib/html-entities');
const { encodeBase64 } = require('./lib/base64');

/**
 * 执行脚本。
 * @param {string[]} argv 参数。
 */
function run(argv) {
  const text = argv[0];
  /** @type {{uid: string; icon: {path:string}, title: string, subtitle: string, arg:string}[]} */
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
  return JSON.stringify({ items: items });
}
