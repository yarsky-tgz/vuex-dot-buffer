const t = require('tap');
const { takeState } = require('vuex-dot');
const buffer = require('../');

function testField(t, result, field, bindTo, setterExpected) {
  t.type(result[field], 'object', 'field exists');
  t.type(result[field].get, 'function', 'getter exists');
  if (setterExpected) t.type(result[field].set, 'function', 'setter exists');
  else t.type(result[field].set, 'undefined', 'setter not exists');
  result[field].get = result[field].get.bind(bindTo);
  if (setterExpected) result[field].set = result[field].set.bind(bindTo);
}

t.test('exposed state target setters with target sending with buffer usage', async t => {
  const test = {
    $store: {
      dispatch(action, { value, key, target }) {
        t.equal(action, 'editUser', 'right action dispatched');
        t.type(key, 'name', 'right key passed to action');
        t.equal(value, 'Peter', 'right value passed to action');
        t.same(target, test.$store.state.user, 'right target passed');
        test.$store.state.user[key] = value; //mutation imitated
      },
      state: {
        user: {
          name: 'John'
        }
      }
    },
  };
  const result = takeState('user')
    .use(buffer('version'))
    .expose(['name'])
    .dispatch('editUser', true)
    .map();
  testField(t, result, 'name', test, true);
  testField(t, result, 'version', test, true);
  t.equal(result.name.get(), 'John', 'name getter works as expected');
  result.name.set('Peter');
  t.equal(result.name.get(), 'Peter', 'buffer works as expected');
  t.equal(test.$store.state.user.name, 'John', 'and actual value unchanged');
  result.version.set(result.version.get() + 1);
  t.equal(test.$store.state.user.name, 'Peter', 'value changed only on trigger value change');
});