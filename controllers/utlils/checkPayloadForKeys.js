const checkPayloadForKeys = (payload, keys) => {
  if (!payload) {
    return false;
  }

  for (key of keys) {
    if (!Object.keys(payload).includes(key)) {
      return false;
    }
  }

  return true;
};

module.exports = { checkPayloadForKeys };
