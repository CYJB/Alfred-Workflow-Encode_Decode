/**
 * 返回指定路径的最后一部分。
 * @param {string} path 要检查的路径。
 * @returns {string}
 */
function basename(path) {
  let position = path.length;
  if (path.endsWith('/')) {
    // 忽略最后一个 /。
    position--;
  }
  const idx = path.lastIndexOf('/', position);
  if (idx >= 0) {
    return path.substring(idx + 1);
  }
  return path;
}

module.exports = { basename };
