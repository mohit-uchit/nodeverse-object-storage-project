/**
 * Common Helper Class
 * Utility functions for common operations across the application
 */
class CommonHelper {
  /**
   * Get object key by value
   * Finds the key in an object that has the specified value
   * 
   * @static
   * @param {Object} obj - The object to search through
   * @param {*} value - The value to find
   * @returns {string|undefined} The key with the matching value, or undefined if not found
   * @example
   * const statusObj = { 0: 'pending', 1: 'active' };
   * getKeyByValue(statusObj, 'active'); // Returns '1'
   */
  static getKeyByValue = (obj, value) => {
    return Object.keys(obj).find(k => obj[k] === value);
  };
}


module.exports = CommonHelper;
