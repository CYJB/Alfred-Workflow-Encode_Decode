/**
 * @typedef {Object} FinderSelection
 * @property {()=>string} url 文件/文件夹的 URL。
 */

/**
 * @typedef {Object} Finder
 * @property {()=>FinderSelection[]} selection 当前选中的文件/文件夹。
 */

/** @type {Finder} 访达实例。 */
const finder = Application('Finder');

module.exports = { finder };
