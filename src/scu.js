export default (cursors, props, nextProps, state, nextState) => {

  for (let keys = Object.keys(cursors), i = keys.length; i--;) {
    if (nextState[keys[i]] !== state[keys[i]]) {
      return true;
    }
  }

  for (let keys = Object.keys(nextProps), i = keys.length; i--;) {
    if (nextProps[keys[i]] !== props[keys[i]]) {
      return true;
    }
  }

  return false;
};
