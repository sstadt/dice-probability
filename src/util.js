
import dice from './config/dice.js';
import Cartesian from './classes/cartesian.js';

var util = {

  /**
   * Generate all possible combination of any number
   * of variable length arrays.
   *
   * Takes any number of array arguments.
   *
   * @return {promise} The complete set of possible combinations is passed to resolve()
   */
  getCartesianProduct() {
    var arg = arguments;

    return new Promise((resolve) => {
      var productBuilder = new Cartesian(...arg);

      // console.log(productBuilder);

      productBuilder.getProduct()
        .then((results) => {
          console.log(results);
          resolve(results);
        });
      // const arg = arguments;
      // const max = arg.length - 1;
      //
      // var results = [];
      //
      // function helper(arr, i) {
      //   for (var j = 0, l = arg[i].length; j < l; j++) {
      //     var a = arr.slice(0); // clone arr
      //
      //     a.push(arg[i][j]);
      //
      //     if (i == max) {
      //       results.push(a);
      //     } else {
      //       helper(a, i + 1);
      //     }
      //   }
      // }
      //
      // helper([], 0);
    });
  },

  /**
   * Combine an array of roll results into a single
   * set of results.
   *
   * @return {object} The combined roll result
   */
  combineRolls() {
    const arg = arguments;

    var result = {};

    for (var i = 0, j = arg.length; i < j; i++) {
      for (var item in arg[i]) {
        if (result[item]) {
          result[item] += arg[i][item];
        } else {
          result[item] = arg[i][item];
        }
      }
    }

    return result;
  },

  /**
   * Convert a roll object to a formatted string
   *
   * @param  {object} roll A roll hash in type/number pairs
   * @return {string}      A pipe delimited string of results in result:number format
   */
  serializeRoll(roll) {
    var arr = [];

    for (var result in roll) {
      arr.push(`${result}:${roll[result]}`);
    }

    return arr.sort(util.sortResults).join('|');
  },

  deserializeRoll(roll) {
    return roll.split('|').map((item) => {
      var arr = item.split(':');
      if (arr[1]) arr[1] = parseInt(arr[1]);
      return arr;
    });
  },

  convertRollToObject(roll) {
    var rollArr = util.deserializeRoll(roll);
    var result = {};

    for (var i = 0, j = rollArr.length; i < j; i++) {
      if (rollArr[i][1]) result[rollArr[i][0]] = rollArr[i][1];
    }

    return result;
  },

  /**
   * Sorting function for arrays of result strings
   *
   * @param  {string}  a The first item to sort
   * @param  {string}  b The second item to sort
   * @return {integer}   Sort order; 1, 0, or -1
   */
  sortResults(a, b) {
    const advantage = /advantage|threat/gi;
    const success = /success|failure/gi;
    const triumph = /triumph|despair/gi;

    var order = 0;

    if (a.match(advantage) && !b.match(advantage)) {
      order = -1;
    } else if (b.match(advantage) && !a.match(advantage)) {
      order = 1;
    } else if (a.match(success) && !b.match(success)) {
      order = -1;
    } else if (b.match(success) && !a.match(success)) {
      order = 1;
    } else if (a.match(triumph) && !b.match(triumph)) {
      order = -1;
    } else if (b.match(triumph) && !a.match(triumph)) {
      order = 1;
    }

    return order;
  },

  /**
   * Sorting function for arrays of roll strings
   *
   * @param  {string}  a The first item to sort
   * @param  {string}  b The second item to sort
   * @return {integer}   Sort order; 1, 0, or -1
   */
  sortRolls(a, b) {
    var aScore = util.getRollScore(a);
    var bScore = util.getRollScore(b);
    var order = 0;

    if (aScore > bScore) {
      order = 1;
    } else if (bScore > aScore) {
      order = -1;
    }

    return order;
  },

  /**
   * Generates a numerical result value for roll strings
   * success/failure add 1/-1 to score
   * advantage/threat add 0.1/-0.1 to score
   * triumph/despair add 1.1/-1.1 to score
   *
   * @param  {string}  rollStr The roll string to generate a score for
   * @return {integer}         The score for the provided roll
   */
  getRollScore(rollStr) {
    var score = 0;
    var rollArr = rollStr.split('|').map((result) => result.split(':'));

    for (var i = 0, j = rollArr.length; i < j; i++) {
      if (rollArr[i].length > 1) score += dice.resultScore[rollArr[i][0]] * parseInt(rollArr[i][1], 10);
    }

    return score;
  },

  /**
   * Calculate occurances of a value in an array
   *
   * @param  {mixed}   needle   The item to look in the array for
   * @param  {array}   haystack The array to scan
   * @return {integer}          The count of items in the array that match needle
   */
  occurancesInArray(needle, haystack) {
    var occurances = 0;

    for (var i = 0, j = haystack.length; i < j; i++) {
      if (needle === haystack[i]) occurances++;
    }

    return occurances;
  },

  /**
   * Get a percentage string formatted to two decimal places
   * from a decimal number.
   *
   * @param  {float}  num The decimal number to generate a percentage string from
   * @return {string}     The resulting percentage
   */
  parsePercent(num) {
    return Math.round(num * 10000) / 100;
  },

  /**
   * Get a string with the current (readable) timestamp
   *
   * @return {[type]} [description]
   */
  getTime() {
    const today = new Date();
    const hours = `0${today.getHours()}`.slice(-2);
    const minutes = `0${today.getMinutes()}`.slice(-2);
    const seconds = `0${today.getSeconds()}`.slice(-2);
    const milliseconds = `00${today.getMilliseconds()}`.slice(-3);

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  },

  /**
   * Log a debug message that includes the current timestamp
   *
   * @param  {string} msg MEssage to include in the console log
   * @return {null}
   */
  debug(msg) {
    console.log(`[${util.getTime()}]: ${msg}`);
  }

};

export default util;
