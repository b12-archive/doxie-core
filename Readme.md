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
----

Let’s see what happens without any plugins to pipe through:

```js
import doxie from 'doxie-core'

const myData = [
  {isPrivate: false},
  {isPrivate: true},
  {isPrivate: false},
];

doxie([])(myData);
//» [
//»   {data: {isPrivate: false}},
//»   {data: {isPrivate: true}},
//»   {data: {isPrivate: false}},
//» ]
```


Simple, but not very useful. Let’s try filtering that data:

```js
const myFilter = (comments) => comments.filter(({data}) => !data.isPrivate);

doxie([
  require('doxie.filter-function')(myFilter),
])(myData);
//» [
//»   {data: {isPrivate: false}},
//»   {data: {isPrivate: false}},
//» ]
```


Fair enough. But the whole business is about outputting docs for humans. Let’s try that then:

```js
const myTemplate = (comments) => comments.map(({data}, index) => (
  {data, output: `${data.isPrivate ? 'Private' : 'Public'} n° ${index + 1}\n`}
}));

doxie([
  require('doxie.filter-function')(myFilter),
  require('doxie.template-function')(myTemplate),
  require('doxie.to-string')(),
])(myData);
//» "Public n° 1
//» Public n° 2
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
