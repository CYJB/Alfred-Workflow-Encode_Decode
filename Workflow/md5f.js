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
      return '不能计算多个文件的 MD5';
    }
    path = decodeURIComponent(selection[0].url()).slice(7);
  }
  if (path.endsWith('/')) {
    return '不能计算目录的 MD5';
  }
  const app = Application.currentApplication()
  app.includeStandardAdditions = true
  return app.doShellScript(`md5 -q "${path}"`)
}
