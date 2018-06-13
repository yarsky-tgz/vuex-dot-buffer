/**
 * Creates buffer plugin for vuex-dot with given trigger value used for buffer flush
 * Second argument, cacheBump, is used to avoid computed property caching on buffered changes.
 *
 * In Vue computed properties are dependent from real reactive properties of your state (data(), or vuex state).
 *
 * So you need to add such property, your buffered computed properties to be dependent on, and pass it's name
 * as second argument.
 *
 * for example:
 *
 * ```javascript
 * export default {
 *   data() {
 *     return {
 *       $$bufferCacheBump: 0
 *     }
 *   },
 *   computed: {
 *     ...takeState('user')
 *       .compose(['name', 'email'])
 *       .use(buffer('version', '$$bufferCacheBump'))
 *       .commit('EDIT_USER')
 *       .map();
 *   }
 * }
 * ```
 *
 * **Notice**: your
 *
 * @param trigger
 * @param cacheBump name of your `vm` property, that shall be used for vue computed cache updating
 * @return {*}
 */
module.exports = (trigger, cacheBump) => {
  let buffer = {};
  let delayed = {};
  let triggerValue = 0;
  return {
    setter(key, value, nextSetter) {
      buffer[ key ] = value;
      delayed[ key ] = nextSetter;
      if (cacheBump) this[cacheBump]++;
    },
    getter(key, nextGetter) {
      if (cacheBump) this[cacheBump]; // so, vue shall notice, that your cache bumping property is accessed during
                                      // computed calculation, and it shall mark it as dependent on it too.
      if (typeof buffer[ key ] !== 'undefined') return buffer[ key ];
      else return nextGetter();
    },
    inject: {
      [ trigger ]: {
        get() {
          if (cacheBump) this[cacheBump];
          return triggerValue;
        },
        set(value) {
          triggerValue = value;
          for (let setter of Object.keys(delayed)) delayed[ setter ](buffer[ setter ]);
          buffer = {};
          delayed = {};
        }
      }
    }
  };
};