# vuex-dot-buffer [![Coverage Status](https://coveralls.io/repos/github/yarsky-tgz/vuex-dot-buffer/badge.svg?branch=master)](https://coveralls.io/github/yarsky-tgz/vuex-dot-buffer?branch=master)

[CodePen Demo](https://codepen.io/anon/pen/LrLPyM)

vuex-dot plugin providing buffering with flushing changes on trigger value change

## Usage

In some cases you do not need to pass each change into your state. For example you want to be sure, that you are saving to state only full and clean data values, not partial\dirty.

So you want to accumulate your changes, until they can be safely passed to storage

This plugin injects such accumulation logic between your component and state. Workflow is very simple: it buffers all changes, done to fields, without passing them beyond until trigger value changes. On change of trigger value buffer flushes and all delayed setters are launched with latest buffered changes

```vue
<template>
  <input placeholder="name" v-model="name"/>
  <input placeholder="email" v-model="email"/>
  <button @click="$version++">Apply</button>
</template>

<script>
  import { takeState } from 'vuex-dot';
  import buffer from 'vuex-dot-buffer';

  export default {
    computed: {
      ...takeState('user')
        .expose(['name', 'email'])
        .use(buffer('$version')) //all changes are buffered
        .dispatch('editUser')
        .map()
    }
  }
</script>
```