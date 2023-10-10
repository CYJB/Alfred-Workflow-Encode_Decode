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

const { md5 } = require('./lib/md5');
const { encodeBase64 } = require('./lib/base64');

/**
 * 执行脚本。
 * @param {string[]} argv 参数。
 */
function run(argv) {
  const result = md5(argv[0]);
  // 将 hex 转换为 Base64
  const base64 = encodeBase64(hex2bin(result));
  return JSON.stringify({
    items: [
      {
        uid: 'MD5_hex',
        icon: {
          path: './icons/Encode_MD5.png',
        },
        title: result,
        subtitle: 'MD5(十六进制)',
        arg: result,
      },
      {
        uid: 'MD5_base64',
        icon: {
          path: './icons/Encode_MD5.png',
        },
        title: base64,
        subtitle: 'MD5(Base64)',
        arg: base64,
      },
    ]
  });
}

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
