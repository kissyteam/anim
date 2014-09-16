# anim

animation using timer and transition

[![anim](https://nodei.co/npm/modulex-anim.png)](https://npmjs.org/package/modulex-anim)
[![NPM downloads](http://img.shields.io/npm/dm/modulex-anim.svg)](https://npmjs.org/package/modulex-anim)
[![Build Status](https://secure.travis-ci.org/kissyteam/anim.png?branch=master)](https://travis-ci.org/kissyteam/anim)
[![Coverage Status](https://img.shields.io/coveralls/kissyteam/anim.svg)](https://coveralls.io/r/kissyteam/anim?branch=master)
[![Dependency Status](https://gemnasium.com/kissyteam/anim.png)](https://gemnasium.com/kissyteam/anim)
[![Bower version](https://badge.fury.io/bo/modulex-anim.svg)](http://badge.fury.io/bo/modulex-anim)
[![node version](https://img.shields.io/badge/node.js-%3E=_0.11-green.svg?style=flat-square)](http://nodejs.org/download/)

[![browser support](https://ci.testling.com/kissyteam/anim.png)](https://ci.testling.com/kissyteam/anim)


## example

```html
<script src='/mx_modules/modulex-debug.js'></script>
<script>
modulex.config('base', '/mx_modules');
modulex.use('anim', function(Anim){
    new Anim(domNode,{
        width: '100px'
    },{
        duration:0.5,
        complete:function(){
            alert('complete');
        }
    }).run();
});
</script>
```