/**
 * @typedef  {Object} AlfredItem
 * @property {string} uid
 * @property {{type: 'fileicon' | 'filetype' | undefined, path: string}} icon
 * @property {string} title
 * @property {string | undefined} subtitle
 * @property {string | undefined} arg
 */

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
    // 默认将 title 作为 arg。
    if (!item.arg) {
      item.arg = item.title;
    }
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
