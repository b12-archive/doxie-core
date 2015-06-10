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

const doxComments = [
  {isPrivate: false},
  {isPrivate: true},
  {isPrivate: false},
];

doxie([])(doxComments);

//» {chunks: [
//»   {data: {isPrivate: false}},
//»   {data: {isPrivate: true}},
//»   {data: {isPrivate: false}},
//» ], version: 1}
```


Simple, but not very useful. Let’s try filtering that data:

```js
const myFilter = ({data}) => !data.isPrivate;

doxie([
  require('doxie.filter')(myFilter),
])(doxComments).chunks;

//» [
//»   {data: {isPrivate: false}},
//»   {data: {isPrivate: false}},
//» ]
```


Fair enough. But the whole business is about outputting docs for humans. Let’s try that then:

```js
let counter = 1;
const myTemplate = ({data}) => ({data,
  output: `${data.isPrivate ? 'Private' : 'Public'} comment ${counter++}\n`
});

doxie([
  require('doxie.filter')(myFilter),
  require('doxie.template')(myTemplate),
  require('doxie.output')(),
])(doxComments).output;

//» "Public comment 1
//» Public comment 2
//» "
```




Installation
------------

```sh
$ npm install doxie-core
```




<a                                                                id="/api"></a>
API
---

<h3                                                    id="/api/signature"><pre>
doxie-core(plugins, [{stdout, stderr}])
  → pipeline(data)
</pre></h3>


<h5                                                        id="/api/parameters">
Parameters:
</h5>

* **`plugins`**
  <sup>{Function[]}</sup>  
  An array of plugin functions. You can pick one of the [ready-made plugins][] or [write your own][].

* **`[options.stdout]`**
  <sup>{Writable Stream}</sup>  
  If set, the `output` of each plugin will be written to this stream.

* **`[options.stderr]`**
  <sup>{Writable Stream}</sup>  
  If set, the `error` of each plugin will be written to this stream.


<h5                                                      id="/api/return-value">
Return value:
</h5>

* **`pipeline(data)`**
  <sup>{Function}</sup>  
  A function composed of [plugin functions][]. Feed it an array of data (like the one that comes out of [`dox.parseComments`][]). It’ll be passed to plugins – they’ll deal with it.


[ready-made plugins]:   https://www.npmjs.com/browse/keyword/doxie-plugin
[write your own]:       #/writing-a-plugin
[plugin functions]:     #/writing-a-plugin/signature
[`dox.parseComments`]:  https://github.com/tj/dox/tree/v0.8.0#programmatic-usage




<a                                                   id="/writing-a-plugin"></a>
Writing a plugin
----------------

Every plugin for *doxie* is a function. The functions are composed with one another to form a functional pipeline. To give you an idea of this, these are roughly equivalent:

```sh
$ doxie --plugin1 --plugin2 --plugin3
```

```js
require('doxie-core')([
  require('doxie.plugin1')(),  // Returns a plugin function.
  require('doxie.plugin2')(),  // Returns a plugin function.
  require('doxie.plugin3')(),  // Returns a plugin function.
]);
```

```js
require('doxie-core')([
  ({chunks, version}) => {
    require('doxie.plugin3')()(
      require('doxie.plugin2')()(
        require('doxie.plugin1')()(
          {chunks, version}
        )
      )
    )
  },
]);
```


**Heads up!** *doxie-core* is a very simple, slim system. We give a lot of power to plugin authors. But beware! With power comes responsibility. When writing a plugin make sure you know the rules and keep to them. You can easily break other plugins otherwise.


Here’s the signature your plugin function should match:

<h3                                       id="/writing-a-plugin/signature"><pre>
plugin({chunks, version})
  → {chunks, version, [output], [error]}
</pre></h3>


<h5                                                id="/writing-a-plugin/input">
Input object properties:
</h5>

The input object is passed directly by *doxie-core* if the `plugin` is the first in the functional pipeline. Otherwise it’s the output of the former plugin.

* **`chunks`**
  <sup>{Object[]}</sup>  
  An array of `chunk`s. Every `chunk` is a part of the documentation. It can either:
  * correspond to *[dox][]* output for a single comment; or
  * be generated by a plugin – such as a description for a group of comments.

* **`[chunks[].data]`**
  <sup>{Object}</sup>  
  `chunk.data` is populated if the chunk corresponds to an item of the input array – a *[dox][]* comment fed into *doxie*. This object is immutable and should be copied directly to the corresponding output `chunk.data`.

* **`[chunks[].output]`**
  <sup>{String}</sup>  
  `chunk.output` is populated if other plugins have generated output for this chunk.

* **`version`**
  <sup>{Number}</sup>  
  The exact number `1`. We pass it so you can make sure that your plugin is compatible with the input it receives.


<h5                                               id="/writing-a-plugin/output">
Output object properties:
</h5>

The output object is processed by *doxie* to produce side-effects – and passed unchanged as input to the subsequent plugin.

* **`chunks`**
  <sup>{Object[]}</sup>  
  The array of `chunks`. See the input `chunks` property for more info.

* **`[chunks[].data]`**
  <sup>{Object}</sup>  
  Make sure you copy the `data` from the corresponding input `chunk`. *doxie* doesn’t need it, but you may break subsequent plugins if you don’t.

* **`[chunks[].output]`**
  <sup>{String}</sup>  
  The rendered text output of this chunk.

* **`version`**
  <sup>{Number}</sup>  
  The exact number `1`.

* **`[error]`**
  <sup>{*}</sup>  
  If `stderr` is defined, `error` will be written to `stderr`.

* **`[output]`**
  <sup>{*}</sup>  
  If `stdout` is defined, `output` will be written to `stdout`.




License
-------

[MIT][] © [Studio B12 GmbH][]

[MIT]: ./License.md
[Studio B12 GmbH]: http://studio-b12.de
