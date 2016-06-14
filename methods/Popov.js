const math = require('mathjs');
const stochasticMatrix = require('../src/stochasticMatrix');

class Popov{
  constructor(a, startX, startW, eps) {
    this.a = a;
    this.startX = startX;
    this.startW = startW;
    this.eps = eps;
    this.n = a.size()[0];
  }

  proection(x) {
    const n = x.size()[0];
    let setIndexes = [];
    let arrayX = x.toArray().map((value) => value[0]);



    let lambda = (1 - arrayX.reduce((prev, next) => prev + next)) / n;

    let xNext = arrayX.map((value) => value + lambda);

    let xPrev, countIndexes, sumElements;


    while(xNext.some(value => value < 0)) {
      xPrev = xNext;
      xNext = new Array(n).fill(0);
      sumElements = 0;

      countIndexes = xPrev.reduce((prev, next) => {
         if (next <= 0) {
           prev++;
         } else {
           sumElements += next;
         }
         return prev;
      }, 0);

      if (countIndexes == n) {
        console.log("dsdsd");
      }

      lambda = (1 - sumElements) / (n - countIndexes);


      xPrev.forEach((value, index) => {
        if (value > 0) xNext[index] = value + lambda;
      })
    }
    return math.matrix(xNext, 'sparse');
  }


  findMaxEigenValue() {
    let tmp = new Array(this.n);
    let eigenVector = this.startPoint;

    let norm_sq = 0;
    let lambdaPrev = 0;
    let lambdaNext = 0;

    do {
      for(let i = 0; i < this.n; i++) {
        tmp[i] = 0;
        for(let j = 0; j < this.n; j++) {
          tmp[i] += this.a.get([i, j]) * eigenVector[j];
        }
      }

      norm_sq = 0;
      for(let k = 0; k < this.n; k++) {
        norm_sq += Math.pow(tmp[k], 2);
      }

      lambdaPrev = lambdaNext;

      lambdaNext = Math.sqrt(norm_sq);

      eigenVector = tmp.map((item) => item / lambdaNext)

    }while(Math.abs(lambdaPrev - lambdaNext) > this.eps)

    return lambdaNext;
  }

  normMatrix() {
    let sumElements = 0;
    this.a.forEach((value) => {
      sumElements += Math.pow(Math.abs(value), 2)
    }, true)

    return Math.sqrt(sumElements);
  }

  getJ() {
    const I1 = math.eye(this.n, this.n);
    const I2 = math.multiply(I1, -1);

    return math.concat(I1, I2);
  }

  calcNormVector(x) {
    let max = x.get([0, 0]);
    x.forEach((value) => { if(Math.abs(value) > max) max = Math.abs(value) }, true );

    return max;

  }

  stopCondition(xNext) {

    return this.calcNormVector(
          math.multiply(this.a, xNext)
        ) >= this.eps
  }

  method() {
    let x0Next = this.startX;
    let w0Next = this.startW;
    let x1Next = this.startX;
    let w1Next = this.startW;
    const J = this.getJ();
    let x0, w0, x1, w1;
    let k = 0;
    const now = new Date;
    let epss = [this.calcNormVector(
      math.multiply(this.a, x0Next)
    )];
    let times = [0];
  
    let lambda = 1 / (3 *this.normMatrix());
    do {
      k++;
      x0 = x0Next;
      w0 = w0Next;
      x1 = x1Next;
      w1 = w1Next;

      x0Next = this.proection(
        math.subtract(
          x0,
          math.multiply(
            lambda,
            math.multiply(
              math.transpose(this.a),
              math.multiply(
                J,
                w1
              )
            )
          )
        )
      );

      w0Next = this.proection(
        math.add(
          w0,
          math.multiply(
            lambda,
            math.multiply(
              math.transpose(J),
              math.multiply(
                this.a,
                x1
              )
            )
          )
        )
      )

      x1Next = this.proection(
        math.subtract(
          x0Next,
          math.multiply(
            lambda,
            math.multiply(
              math.transpose(this.a),
              math.multiply(
                J,
                w1
              )
            )
          )
        )
      );

      w1Next = this.proection(
        math.add(
          w0Next,
          math.multiply(
            lambda,
            math.multiply(
              math.transpose(J),
              math.multiply(
                this.a,
                x1
              )
            )
          )
        )
      )
      if (new Date - now < 2000) {
        epss.push(this.calcNormVector(
          math.multiply(this.a, x0Next)
        ));
        
        times.push(new Date - now);
      }
    }while(new Date - now < 2000)

    return {
      epss: epss,
      times: times,
      result: x0Next
    };
  }
}
// const n = 1000;
// const s = 10
// const p = new stochasticMatrix(n, s);
//
// const a = math.subtract(p.generate(), math.eye(n, n, 'sparse'));
//
// x0 = math.matrix(new Array(n).fill(0), 'sparse');
// x0.set([0, 0], 1);
//
// w0 = math.matrix(new Array(2 * n).fill(0), 'sparse')
// w0.set([1, 0], 1);
//
// const eps = 0.0001;
//
// const test = new Popov(a, x0, w0, eps);
//
// // console.log(test.proection(math.matrix([-1, -2, -3])))
// console.time("popov");
// const result = test.method();
// console.timeEnd("popov");
// console.log(result);

module.exports = Popov;