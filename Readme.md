[![Coveralls – test coverage
](https://img.shields.io/coveralls/studio-b12/doxie-core.svg?style=flat-square)
](https://coveralls.io/r/studio-b12/doxie-core)
 [![Travis – build status
](https://img.shields.io/travis/studio-b12/doxie-core/master.svg?style=flat-square)
](https://travis-ci.org/studio-b12/doxie-core)
 [![David – status of dependencies
](https://img.shields.io/david/studio-b12/doxie-core.svg?style=flat-square)
](https://david-dm.org/studio-b12/doxie-core)
 [![Stability: unstable
](https://img.shields.io/badge/stability-unstable-yellowgreen.svg?style=flat-square)
](https://github.com/studio-b12/doxie-core/issues/3)
 [![Code style: airbnb
](https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat-square)
](https://github.com/airbnb/javascript)




doxie-core
==========

**The heart of <http://npm.im/doxie>.**




<p align="center"><a
  title="Graphic by the great Justin Mezzell"
  href="http://justinmezzell.tumblr.com/post/89652317743"
  >
  <br/>
  <br/>
  <img
    src="Readme/Compass.gif"
    width="400"
    height="300"
  />
  <br/>
  <br/>
</a></p>


 

The CLI program *[doxie][]* claims to be “the simplest docs generator you’ve seen”. *doxie-core* is the heart of *[doxie][]*, so it’s inherently [very simple][].

All it does is take an array of data and pipe it through a bunch of plugins (functions). Just keep in mind that most plugins will expect *[dox][]*-compatible data. That’s it.

See for yourself:

[doxie]:        https://github.com/studio-b12/doxie
[dox]:          https://github.com/tj/dox
[very simple]:  ./module/index.js




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
const myFilter = ({data}) => !data.isPrivate;

doxie([
  (comments) => comments.filter(myFilter),  // ☆ http://npm.im/doxie.filter
])(myData);

//» [
//»   {data: {isPrivate: false}},
//»   {data: {isPrivate: false}},
//» ]
```


Fair enough. But the whole business is about outputting docs for humans. Let’s try that then:

```js
let count = 0;
const myTemplate = (data) => (
  `${data.isPrivate ? 'Private' : 'Public'} n° ${++count}\n`
);

doxie([
  (comments) => comments.filter(myFilter),
  (comments) => comments.map(({data}) => ({data, output: myTemplate(data)})),
    // ☆ http://npm.im/doxie.template
  (comments) => comments.map(({output}) => output || '').join(''),
    // ☆ http://npm.im/doxie.to-string
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
