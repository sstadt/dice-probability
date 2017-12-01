
class Cartesian {
  constructor() {
    console.log(arguments);
    this.arg = arguments;
    this.max = this.arg.length - 1;
    this.results = [];
    this.index = 0;
  }

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

  productHelper(arr, i) {
    var self = this;
    var a = arr.slice(0); // clone arr

    return new Promise((resolve) => {
      console.log('building new promise');
      for (var j = 0, l = self.arg[i].length; j < l; j++) {

        a.push(self.arg[i][j]);

        if (i == self.max) {
          self.results.push(a);
        } else {
          // i++;
          // if (i > 100 && i % 100 === 0) {
          //   setTimeout(() => resolve(a), 5);
          // } else {
          //   resolve(a);
          // }
        }

        resolve(a);
      }
    }).then((a) => {
      console.log('checking for end');
      return (i == self.max) ? self.results : self.productHelper(a, i + 1);
    });
  }

  getProduct() {
    this.results = [];
    this.index = 0;
    return this.productHelper([], 0);
  }
};

export default Cartesian;
