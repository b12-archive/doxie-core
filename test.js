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
    [
      {data: {isPrivate: false}},
      {data: {isPrivate: true}},
      {data: {isPrivate: false}},
    ],
    'without any plugins to pipe through'
  );

  const myFilter = ({data}) => !data.isPrivate;

  is.deepEqual(
    doxie([
      (comments) => comments.filter(myFilter),
    ])(myData),
    [
      {data: {isPrivate: false}},
      {data: {isPrivate: false}},
    ],
    'filtering data'
  );

  const myTemplate = ({data}, index) => ({data,
    output: `${data.isPrivate ?
      /* istanbul ignore next */ 'Private' :
      'Public'
    } n° ${index + 1}\n`
  });

  is.deepEqual(
    doxie([
      (comments) => comments.filter(myFilter),
      (comments) => comments.map(myTemplate),
      (comments) => comments.map(({output}) => (
        output ||
        /* istanbul ignore next */ ''
      )).join('')
    ])(myData),
    'Public n° 1\nPublic n° 2\n',
    'outputting docs for humans'
  );

  is.end();
});
