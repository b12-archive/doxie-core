import doxie from './module/index';

const test = require('tape-catch');
const assign = require('object-assign');

const issue = (id, title) => {
  return `${title} (http://github.com/doxie-core/issue/${id})`;
};

const data = (args) => assign({
  chunks: [],
  version: 1,
}, args);

const dummyDoxOutput = [
  {isPrivate: false},
  {isPrivate: true},
  {isPrivate: false},
];

test('Does what the demo says', (is) => {
  is.deepEqual(
    doxie([])(dummyDoxOutput),
    {chunks: [
      {data: {isPrivate: false}},
      {data: {isPrivate: true}},
      {data: {isPrivate: false}},
    ], version: 1},
    'without any plugins to pipe through'
  );

  const myFilter = ({data}) => !data.isPrivate;

  is.deepEqual(
    doxie([
      (input) => assign({}, input, {chunks:
        input.chunks.filter(myFilter),
      }),  // ☆ http://npm.im/doxie.filter
    ])(dummyDoxOutput).chunks,
    [
      {data: {isPrivate: false}},
      {data: {isPrivate: false}},
    ],
    'filtering data'
  );

  let counter = 1;
  const myTemplate = ({data}) => ({data,
    output: `${data.isPrivate ? 'Private' : 'Public'} comment ${counter++}\n`
  });

  is.deepEqual(
    doxie([
      (input) => assign({}, input, {chunks:
        input.chunks.filter(myFilter),
      }),

      (input) => assign({}, input, {chunks:
        input.chunks.map(myTemplate)
      }),  // ☆ http://npm.im/doxie.template

      (input) => assign({}, input, {output:
        input.chunks.map(({output}) => output || '').join('')
      }),  // ☆ http://npm.im/doxie.to-string
    ])(dummyDoxOutput).output,
    'Public comment 1\nPublic comment 2\n',
    'outputting docs for humans'
  );

  is.end();
});

test(issue(1, 'Prints to stdout and stderr'), (is) => {
  is.plan(2);

  doxie([
    () => data({output: 'Hey!'}),
    () => data({error: 'Oops!'}),
  ], {
    stdout: {write: (message) => is.equal(message,
      'Hey!',
      'stdout'
    )},
    stderr: {write: (message) => is.equal(message,
      'Oops!',
      'stderr'
    )},
  })([]);

  is.end();
});

test(issue(5, 'Checks if plugins are well-behaved'), (is) => {
  is.throws(
    doxie([
      () => null,
    ]),
    /should .*an object/i,
    'if each plugin returns an object'
  );

  is.throws(
    doxie([
      () => ({version: '1'}),
    ]),
    /should .*a `{Number} version`/i,
    'with a `{Number} version`'
  );

  is.throws(
    doxie([
      () => ({version: 0.9}),
    ]),
    /should .*`1`/i,
    'which equals `1` in doxie-core <2.0.0'
  );

  is.throws(
    doxie([
      () => ({version: 1}),
    ]),
    /should .*an `{Array} chunks`/i,
    'with an `{Array} chunks`'
  );

  is.end();
});
