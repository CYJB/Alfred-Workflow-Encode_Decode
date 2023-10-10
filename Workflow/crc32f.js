#! /usr/bin/osascript -l JavaScript

/**
 * 执行脚本。
 * @param {string[]} argv 参数。
 */
function run(argv) {
  let path = argv[0];
  if (!path) {
    // 未传入路径，使用 Finder 当前选择的文件。
    const finder = Application('Finder');
    const selection = finder.selection();
    if (selection.length === 0) {
      return '未选择文件';
    } else if (selection.length > 1) {
      return '不能计算多个文件的 CRC32';
    }
    path = decodeURIComponent(selection[0].url()).slice(7);
  }
  if (path.endsWith('/')) {
    return '不能计算目录的 CRC32';
  }
  const app = Application.currentApplication()
  app.includeStandardAdditions = true
  /** @type {string} */
  let result = app.doShellScript(`crc32 "${path}"`)
  // 如果文件名中符合 /\D\d{8}\D/，crc32 会将此值与 CRC 结果匹配，输出 OK 或 BAD XXX
  // 需要额外处理移除额外的部分。
  const idx = result.indexOf('\t');
  console.log(result, idx)
  if (idx > 0) {
    result = result.substring(0, idx);
  }
  return result;
}
