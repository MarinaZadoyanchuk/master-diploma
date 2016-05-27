'use strict';

const math = require('mathjs');
const BinarySearchTree = require('../src/binarySearchTree');

class NL1 {
  
  constructor(a, startPoint, eps) {
    this.a = a;
    this.startPoint = startPoint;
    this.eps = eps;
    this.n = startPoint.length;
    this.prevGradient = null;
  }

  getGradient(x) {
    return math.multiply(
      math.multiply(this.a, math.transpose(this.a)),
      x
    )
  }

  plusComponets(x) {
    if (x < 0) return 0;

    return x;
  }

  heavisideStep(x) {
    if (x < 0) return 0;

    return x;
  }

  partialDerivative(gradient, x, i) {


    return gradient.get([i, 0]) - this.plusComponets(-x[i]) * this.heavisideStep(-x[i])
  }

  findArgI(x, h) {
    let three = new BinarySearchTree();

    if (!h) {
      this.prevGradient = this.getGradient(x);
    } else {
      this.prevGradient = math.add(this.prevGradient, this.getGradient(h));
    }

    x.forEach((item, index) => {
      three.add(this.partialDerivative(this.prevGradient, x, index), index);
    });


    const minValue = three.findMin();
    const maxValue = three.findMax();

    return {
      min: minValue,
      max: maxValue
    }
  }

  calcH(xPrev, hPrev) {
    let h = new Array(this.n).fill(0);

    const positions = this.findArgI(xPrev, hPrev);
    h[positions.min.position] = 1/8 * (positions.max.value - positions.min.value);
    h[positions.max.position] = -1/8 * (positions.max.value - positions.min.value);

    return h;
  }

  calcNormVector(x) {
    let sum = 0;
    x.forEach((value) => { sum += Math.pow(Math.abs(value), 2)} );

    return Math.sqrt(sum);

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

      // eigenVector = tmp;
      eigenVector = tmp.map((item) => item / lambdaNext)

    }while(Math.abs(lambdaPrev - lambdaNext) > this.eps)
    
    return lambdaNext;
  }

  stopCondition(xNext, xPrev) {

    return 0.5 * Math.pow(
          this.calcNormVector(
            math.subtract(
              math.multiply(this.a, xNext),
              math.multiply(this.a, xPrev)
            )),
        2) >= Math.pow(this.eps, 2) * 0.5
  }

  nl1() {
    let xNext = this.startPoint;
    let iteration = 0;
    let iterationSolutions = [];
    let xPrev = this.startPoint;
    let hPrev = null;
    
    do {
      iterationSolutions.push(xPrev);
      iteration++;

      xPrev = xNext;
      hPrev = this.calcH(xPrev, hPrev);
      xNext = math.add(xPrev, hPrev);
    }while(this.stopCondition(xPrev, xNext))

    return {
      solution: xNext,
      iterationSolutions: iterationSolutions,
      iteration: iteration
    }
  }
}

module.exports = NL1;