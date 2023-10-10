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
const { hex2bin, encodeBase64 } = require('./lib/base64');
const { md5 } = require('./lib/md5');

/**
 * 执行脚本。
 * @param {string[]} argv 参数。
 */
function run(argv) {
  const result = md5(argv[0]);
  // 将 hex 转换为 Base64
  const base64 = encodeBase64(hex2bin(result));
  return new Result().add({
    uid: 'MD5_hex',
    icon: {
      path: './icons/Encode_MD5.png',
    },
    title: result,
    subtitle: 'MD5(十六进制)',
  }).add({
    uid: 'MD5_base64',
    icon: {
      path: './icons/Encode_MD5.png',
    },
    title: base64,
    subtitle: 'MD5(Base64)',
  }).toString();
}
