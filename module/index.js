const pipe = require('1-liners/pipe');

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
      let result = plugin(...args);
      let {error, output} = result;
      if (output && writeOutput) writeOutput(output);
      if (error && writeError) writeError(error);
      return result;
    })
    .reduce(pipe, (input) => ({
      chunks: input.map((data) => ({data})),
      version: 1,
    }))
  ;
};
