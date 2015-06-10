const pipe = require('1-liners/pipe');
const identity = require('1-liners/identity');

export default (
  plugins,
  {stdout = null, stderr = null} = {}
) => {
  const transform = plugins.reduce(pipe, identity);
  return (doxOutput) => {
    const input = {
      chunks: doxOutput.map((data) => ({data})),
      version: 1,
    };

    return transform(input);
  };
};
