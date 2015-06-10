import doxie from './module/index';

const test = require('tape-catch');
const assign = require('object-assign');

test('Does what the demo says', (is) => {
  const doxComments = [
    {isPrivate: false},
    {isPrivate: true},
    {isPrivate: false},
  ];

  is.deepEqual(
    doxie([])(doxComments),
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
    ])(doxComments).chunks,
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
    ])(doxComments).output,
    'Public comment 1\nPublic comment 2\n',
    'outputting docs for humans'
  );

  is.end();
});

test('Prints to stdout and stderr', (is) => {
  is.plan(2);

  doxie([
    () => ({output: 'Hey!'}),
    () => ({error: 'Oops!'}),
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
