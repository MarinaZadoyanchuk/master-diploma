// import math from 'mathjs';
const math = require('mathjs');

class GenerateStochasticMatrix {
  // n - dimension, s - number of  nonzero elements in row
  constructor(n, s) {
    this.n = n;
    this.s = s;
  }

  getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  shuffleArray(arr) {
    return arr.sort(function() {
      console.log(0.5 - Math.random());
      return 0.5 - Math.random();
    })
  }

  generate() {
    let result = [];
    let n = 0;

    while(n < this.n) {
      let row = new Array(this.n).fill(0);
      let count_nonzeros = this.getRandomIntInclusive(1, this.s);
      let value = +(1 / count_nonzeros).toFixed(2);
      let position = this.getRandomIntInclusive(0, this.n - 1);

      while(count_nonzeros > 0) {
        while(n == position || row[position]) {
          position = this.getRandomIntInclusive(0, this.n - 1);
        }

        row[position] = value;
        count_nonzeros--;
      }

      result.push(row);
      n++;
    }
    
    return math.transpose(math.matrix(result, 'sparse'));
  }
}
module.exports = GenerateStochasticMatrix;

// let a = new GenerateStochasticMatrix(15, 2);
// console.time("generate matrix");
// let b = a.generate();
//
// b.forEach(function(item, index) {
//   console.log(index);
// }, true)
// console.timeEnd("generate matrix");

// export default GenerateStochasticMatrix;