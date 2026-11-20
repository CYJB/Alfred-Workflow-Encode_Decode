/**
 * @typedef  {Object} AlfredItem
 * @property {string} uid
 * @property {{type: 'fileicon' | 'filetype' | undefined, path: string}} icon
 * @property {string} title
 * @property {string | undefined} subtitle
 * @property {string | undefined} arg
 */

/**
 * 将字符串中的孤立代理项转为字面转义文本 \uXXXX。
 * 二进制数据按 UTF-8 解码时会产生孤立代理项，JSON.stringify 将其转义为
 * \uD800-\uDFFF 形式，而 Alfred 使用的 NSJSONSerialization 拒绝解析这类转义，
 * 会导致整个 workflow 执行失败。转为字面文本后既保留原始码点信息又是合法 JSON。
 * 合法代理对表示真实的天文平面字符，原样保留。
 * @param {any} str 要处理的字符串，非字符串原样返回。
 * @returns {any} 处理后的字符串。
 */
function sanitize(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return str.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[\uDC00-\uDFFF]/g,
    matched => matched.length === 2
      ? matched
      : '\\u' + matched.charCodeAt(0).toString(16).padStart(4, '0'));
}

/**
 * 表示 Alfred 的 Script Filter 结果。
 */
class Result {
  /**
   * 返回错误的结果。
   * @param {string} title 结果的标题。
   * @param {string | undefined} subtitle 结果的副标题。
   */
  static error(title, subtitle) {
    return JSON.stringify({
      items: [{
        uid: 'Error',
        title,
        subtitle,
        valid: false,
      }]
    });
  }

  /**
   * 结果项。
   * @type {AlfredItem[]}
   */
  _items = [];

  /**
   * 结果项的个数。
   * @type {number}
   */
  get length() {
    return this._items.length;
  }

  /**
   * 添加指定的结果项。
   * @param {AlfredItem} item 结果项。
   * @returns {Result} 添加后的结果。
   */
  add(item) {
    item.title = sanitize(item.title);
    if (item.subtitle) {
      item.subtitle = sanitize(item.subtitle);
    }
    // 默认将 title 作为 arg。
    item.arg = item.arg ? sanitize(item.arg) : item.title;
    this._items.push(item);
    return this;
  }

  /**
   * 返回结果文本。
   * @returns {string} 结果文本。
   */
  toString() {
    return JSON.stringify({ items: this._items });
  }
}

module.exports = { Result };
