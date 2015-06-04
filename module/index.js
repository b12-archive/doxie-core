const pipe = require('1-liners/pipe');
const identity = require('1-liners/identity');

export default (plugins) => {
  const transform = plugins.reduce(pipe, identity);
  return (input) => {
    const inputData = input.map((data) => ({data}));
    return transform(inputData);
  };
};
