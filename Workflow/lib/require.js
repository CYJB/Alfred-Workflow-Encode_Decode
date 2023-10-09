(function (app) {
  /** 被引用的模块 */
  const requiredModules = new Map();
  /**
   * 导入指定的模块。
   * @param {string} moduleName 要导入的模块名。
   */
  const require = function (moduleName) {
    // 要求所有模块都在 lib 目录下，因此移除 moduleName 的目录部分。
    const idx = moduleName.lastIndexOf('/');
    if (idx >= 0) {
      moduleName = moduleName.substring(idx + 1);
    }
    let module = requiredModules.get(moduleName);
    if (module) {
      return module.exports;
    }
    module = { exports: {} };
    requiredModules.set(moduleName, module);
    const path = `./lib/${moduleName}.js`;
    const handle = app.openForAccess(path);
    const content = app.read(handle);
    app.closeAccess(path);
    (function (__moduleName__, __content__, require, module, exports) {
      try {
        eval(__content__);
      } catch (e) {
        console.log('load module', __moduleName__, 'failed:', e)
      }
    })(moduleName, content, require, module, module.exports);
    return module.exports;
  }
  return require;
});
