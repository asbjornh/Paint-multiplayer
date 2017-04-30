function getData(options, compilation) {
  return Object.keys(options).reduce((accumulator, key) => {
    accumulator[key] = options[key].replace('[hash]', compilation.hash);
    return accumulator;
  }, {});
}

function apply(options, compiler) {
  compiler.plugin('emit', (compilation, callback) => {
    const data = getData(options, compilation);
    const file = JSON.stringify(data, null, 2);

    compilation.assets['meta.json'] = {
      source() { return file; },
      size() { return file.length; }
    };

    callback();
  })
}

module.exports = function (options) {
  return {
    apply: apply.bind(this, options)
  }
};