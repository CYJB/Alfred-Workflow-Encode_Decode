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
const { encodeBase64 } = require('./lib/base64');
const { encodeHTML } = require('./lib/html-entities');

/**
 * 执行脚本。
 * @param {string[]} argv 参数。
 */
function run(argv) {
  const text = argv[0];
  const result = new Result();
  const urlEncode = encodeURIComponent(text);
  if (urlEncode !== text) {
    result.add({
      uid: 'URL',
      icon: {
        path: './icons/Encode_URL.png',
      },
      title: urlEncode,
      subtitle: '编码 URL',
    });
  }
  const htmlEncode = encodeHTML(text);
  if (htmlEncode !== text) {
    result.add({
      uid: 'HTML',
      icon: {
        path: './icons/Encode_HTML.png',
      },
      title: htmlEncode,
      subtitle: '编码 HTML',
    });
  }
  const base64Encode = encodeBase64(text);
  result.add({
    uid: 'Base64',
    icon: {
      path: './icons/Encode_Base64.png',
    },
    title: base64Encode,
    subtitle: '编码 Base64',
  });
  return result.toString();
}
