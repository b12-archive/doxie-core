const test = require('tape-catch');

import doxie from './module/index';

test('Does what the demo says', (is) => {
  const myData = [
    {isPrivate: false},
    {isPrivate: true},
    {isPrivate: false},
  ];

  is.deepEqual(
    doxie([])(myData),
    {chunks: [
      {data: {isPrivate: false}},
      {data: {isPrivate: true}},
      {data: {isPrivate: false}},
    ], error: null, version: '1'},
    'without any plugins to pipe through'
  );

  const myFilter = ({data}) => !data.isPrivate;

  is.deepEqual(
    doxie([
      (comments) => comments.filter(myFilter),
    ])(myData).chunks,
    [
      {data: {isPrivate: false}},
      {data: {isPrivate: false}},
    ],
    'filtering data'
  );

  const myTemplate = ({data}, index) => ({data,
    output: `${data.isPrivate ? 'Private' : 'Public'} n° ${index + 1}\n`
  });

  is.deepEqual(
    doxie([
      (comments) => comments.filter(myFilter),
      (comments) => comments.map(myTemplate),
      (comments) => comments.map(({output}) => output || '').join('')
    ])(myData).output,
    'Public n° 1\nPublic n° 2\n',
    'outputting docs for humans'
  );

  is.end();
});
