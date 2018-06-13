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
  var vuexDotBuffer = trigger => {
    let buffer = {};
    let delayed = {};
    let triggerValue = 0;
    return {
      setter(key, value, nextSetter) {
        buffer[ key ] = value;
        delayed[ key ] = nextSetter;
      },
      getter(key, nextGetter) {
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
