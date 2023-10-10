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
const { crc32 } = require('./lib/crc32');

/**
 * 执行脚本。
 * @param {string[]} argv 参数。
 */
function run(argv) {
  const result = crc32(argv[0]);
  return new Result().add({
    uid: 'CRC32_10',
    icon: {
      path: './icons/Encode_CRC32.png',
    },
    title: result.toString(),
    subtitle: 'CRC32(十进制)',
  }).add({
    uid: 'CRC32_16',
    icon: {
      path: './icons/Encode_CRC32.png',
    },
    title: result.toString(16),
    subtitle: 'CRC32(十六进制)',
  }).toString();
}
