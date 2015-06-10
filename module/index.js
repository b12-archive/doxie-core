const pipe = require('1-liners/pipe');
const identity = require('1-liners/identity');

export default (
  plugins,
  {stdout = null, stderr = null} = {}
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

  const transform = plugins
    .map((plugin) => (...args) => {
      let result = plugin(...args);
      let {error, output} = result;
      if (output && writeOutput) writeOutput(output);
      if (error && writeError) writeError(error);
      return result;
    })
    .reduce(pipe, identity)
  ;

  return (doxOutput) => {
    const input = {
      chunks: doxOutput.map((data) => ({data})),
      version: 1,
    };

    return transform(input);
  };
};
