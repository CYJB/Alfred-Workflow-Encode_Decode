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
    try {
      // new Function 的函数体只处于全局作用域，必须以形参传入 CommonJS 变量，
      // 否则模块内裸用的 exports、require 无法解析。
      new Function('require', 'module', 'exports', content)(require, module, module.exports);
    } catch (e) {
      console.log('load module', moduleName, 'failed:', e)
    }
    return module.exports;
  }
  return require;
});
