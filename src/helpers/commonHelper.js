class CommonHelper {
  static getKeyByValue = (obj, value) => {
    return Object.keys(obj).find(k => obj[k] === value);
  };
}


module.exports = CommonHelper;
