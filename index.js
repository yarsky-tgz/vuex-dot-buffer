module.exports = trigger => {
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
          for (let setter in delayed) delayed[ setter ](buffer[ setter ]);
          buffer = {};
          delayed = {};
        }
      }
    }
  };
};