const checkPayloadForKeys = (payload, keys) => {
  if (!payload) {
    return false;
  }

  return keys.reduce((result, key) => {
    return result && Object.keys(payload).includes(key);
  }, true);
};

module.exports = { checkPayloadForKeys };
