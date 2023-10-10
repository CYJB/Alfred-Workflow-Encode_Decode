#! /usr/bin/osascript -l JavaScript

const app = Application.currentApplication()
app.includeStandardAdditions = true

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
      return '不能计算目录的 CRC32';
    }
    return crc32file(path);
  }

  const { Result } = require('./lib/alfred');
  const { finder } = require('./lib/finder');
  const { basename } = require('./lib/path');

  // 未传入路径，使用 Finder 当前选择的文件计算 CRC32 并给出选项。
  const selection = finder.selection();
  if (selection.length === 0) {
    return Result.error('未选择文件', '请在 访达 中选中希望计算内容 CRC32 的单个文件');
  } else if (selection.length > 1) {
    return Result.error('不能计算多个文件的 CRC32', '请在 访达 中选中希望计算内容 CRC32 的单个文件');
  }
  path = decodeURIComponent(selection[0].url()).slice(7);
  if (path.endsWith('/')) {
    return Result.error('不能计算目录的 CRC32', '请在 访达 中选中希望计算内容 CRC32 的单个文件');
  }
  const pathName = basename(path);
  const result = crc32file(path);
  return new Result().add({
    uid: 'CRC32_10',
    icon: {
      path: './icons/Encode_CRC32.png',
    },
    title: parseInt(result, 16).toString(),
    subtitle: `${pathName} 的 CRC32(十进制)`,
  }).add({
    uid: 'CRC32_16',
    icon: {
      path: './icons/Encode_CRC32.png',
    },
    title: result.toString(16),
    subtitle: `${pathName} 的 CRC32(十六进制)`,
  }).toString();
}

/**
 * 计算指定文件内容的 CRC32。
 * @param {string} filepath 文件路径。
 * @returns {string} 文件内容的 CRC32。
 */
function crc32file(filepath) {
  /** @type {string} */
  let result = app.doShellScript(`crc32 "${filepath}"`)
  // 如果文件名中符合 /\D\d{8}\D/，crc32 会将此值与 CRC 结果匹配，输出 OK 或 BAD XXX
  // 需要额外处理移除额外的部分。
  const idx = result.indexOf('\t');
  if (idx > 0) {
    return result.substring(0, idx);
  } else {
    return result;
  }
}
