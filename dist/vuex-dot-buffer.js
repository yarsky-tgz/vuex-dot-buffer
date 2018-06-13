(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VuexDotBuffer = factory());
}(this, (function () { 'use strict';

  /**
   * Creates buffer plugin for vuex-dot with given trigger value used for buffer flush
   * @param trigger
   * @return {*}
   */
  var vuexDotBuffer = (trigger, cacheBump) => {
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
        if (buffer[ key ]) return buffer[ key ];
        else return nextGetter();
      },
      inject: {
        [ trigger ]: {
          get: () => triggerValue,
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

  return vuexDotBuffer;

})));
