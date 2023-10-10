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

/**
 * 执行脚本。
 * @param {string[]} argv 参数。
 */
function run(argv) {
  let path = argv[0];
  if (path) {
    // 有传入路径，直接计算结果并返回。
    if (path.endsWith('/')) {
      return '不能计算目录的 MD5';
    }
    return app.doShellScript(`md5 -q "${path}"`)
  }

  const { Result } = require('./lib/alfred');
  const { hex2bin, encodeBase64 } = require('./lib/base64');
  const { finder } = require('./lib/finder');
  const { basename } = require('./lib/path');

  // 未传入路径，使用 Finder 当前选择的文件计算 MD5 并给出选项。
  const selection = finder.selection();
  if (selection.length === 0) {
    return Result.error('未选择文件', '请在 访达 中选中希望计算内容 MD5 的单个文件');
  } else if (selection.length > 1) {
    return Result.error('不能计算多个文件的 MD5', '请在 访达 中选中希望计算内容 MD5 的单个文件');
  }
  path = decodeURIComponent(selection[0].url()).slice(7);
  if (path.endsWith('/')) {
    return Result.error('不能计算目录的 MD5', '请在 访达 中选中希望计算内容 MD5 的单个文件');
  }
  const pathName = basename(path);
  const result = new Result();
  const md5Hex = app.doShellScript(`md5 -q "${path}"`)
  // 将 hex 转换为 Base64
  const md5Base64 = encodeBase64(hex2bin(md5Hex));
  return result.add({
    uid: 'MD5_hex',
    icon: {
      path: './icons/Encode_MD5.png',
    },
    title: md5Hex,
    subtitle: `${pathName} 的 MD5(十六进制)`,
  }).add({
    uid: 'MD5_base64',
    icon: {
      path: './icons/Encode_MD5.png',
    },
    title: md5Base64,
    subtitle: `${pathName} 的 MD5(Base64)`,
  }).toString();
}
