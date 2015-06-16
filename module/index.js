const pipe = require('1-liners/pipe');
const {cyan} = require('chalk');
const tinyError = require('tiny-error');
const {isArray} = Array;

const prefix = `${cyan('[doxie]')} `;
const coreError = tinyError({prefix});
const pluginError = tinyError({
  prefix: prefix + 'Got invalid data from a plugin. ',
});

export default (
  plugins,
  {stdout = null, stderr = null} = {}  /* jshint ignore: line */
) => {
  const writeOutput = (
    stdout && typeof stdout.write === 'function' ?
    stdout.write.bind(stdout) :
    null
  );

  const writeError = (
    stderr && typeof stderr.write === 'function' ?
    stderr.write.bind(stderr) :
    null
  );

  return plugins
    .map((plugin) => (...args) => {
      // TODO: Check if `plugin` is a function

      let result = plugin(...args);

      if (!result || typeof result !== 'object') throw pluginError(
        'It should have returned a data object.'
      );

      let {version, chunks, error, output} = result;

      if (typeof version !== 'number') throw pluginError(
        'The returned data should contain a `{Number} version`'
      );

      if (version !== 1) throw pluginError(
        'The returned `version` should equal `1` in doxie <2.0.0'
      );

      if (!isArray(chunks)) throw pluginError(
        'The returned data should contain an `{Array} chunks`'
      );

      if (output && writeOutput) writeOutput(output);
      if (error && writeError) writeError(error);
      return result;
    })
    .reduce(pipe, (input) => {
      if (!isArray(input)) throw coreError(
        'Wrong input data. Expecting an array.'
      );
        // TODO: Test this.

      return {
        chunks: input.map((data) => ({data})),
        version: 1,
      };
    })
  ;
};
