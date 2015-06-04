[![Coveralls – test coverage
](https://img.shields.io/coveralls/studio-b12/doxie-core.svg?style=flat-square)
](https://coveralls.io/r/studio-b12/doxie-core)
 [![Travis – build status
](https://img.shields.io/travis/studio-b12/doxie-core/master.svg?style=flat-square)
](https://travis-ci.org/studio-b12/doxie-core)
 [![David – status of dependencies
](https://img.shields.io/david/studio-b12/doxie-core.svg?style=flat-square)
](https://david-dm.org/studio-b12/doxie-core)
 [![Code style: airbnb
](https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat-square)
](https://github.com/airbnb/javascript)
 [![Stability: experimental
](https://img.shields.io/badge/stability-experimental-yellow.svg?style=flat-square)
](https://nodejs.org/api/documentation.html#documentation_stability_index)




doxie-core
==========

**The heart of <http://npm.im/doxie>.**


[*doxie*][] claims to be “the simplest docs generator you’ve seen”. This is the heart of it, so it’s inherently very simple.

All *doxie-core* does is take an array of data and pipe it through a bunch of plugins (functions). Just keep in mind that most plugins will expect [*dox*][]-compatible data. That’s it.

[*doxie*]:  https://github.com/studio-b12/doxie
[*dox*]:    https://github.com/tj/dox

See for yourself:




Demo
====

```js
import doxie from 'doxie-core'

const myData = [
  {isPrivate: false,  /* …dox comment data */},
  {isPrivate: true,   /* …dox comment data */},
  {isPrivate: false,  /* …dox comment data */},
];
```

```js
doxie([])(myData);
//» [
//»   {data: {isPrivate: false, …}},
//»   {data: {isPrivate: true, …}},
//»   {data: {isPrivate: false, …}},
//» ]
```

```js
let counter = 1;
const myTemplate = (comment) => ({
  output: comment.data.isPrivate ? null : `Visible ${counter++}!\n`
});

doxie([
  require('doxie.template-function')(myTemplate),
])(myData);
//» [
//»   {data: {isPrivate: false, …}, output: 'Visible 1!\n'},
//»   {data: {isPrivate: true, …}, output: null},
//»   {data: {isPrivate: false, …}, output: 'Visible 2!\n'},
//» ]
```

```js
doxie([
  require('doxie.template-function')(myTemplate),
  require('doxie.to-string')(),
])(myData);
//» "Visible 1!
//» Visible 2!
//» "
```




Installation
------------

```sh
$ npm install doxie-core
```




Usage
-----

…




License
-------

[MIT][] © [Studio B12 GmbH][]

[MIT]: ./License.md
[Studio B12 GmbH]: http://studio-b12.de
