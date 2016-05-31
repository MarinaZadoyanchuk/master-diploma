'use strict';

const math = require('mathjs');
const BinarySearchTree = require('../src/binarySearchTree');

class FW {
  constructor(a, startPoint, eps) {
    this.a = a;
    this.startPoint = startPoint;
    this.eps = eps;

    this.n = startPoint.length;
    this.prevGradient = this.getGradient(startPoint);
    this.prevY = new Array(this.n);
  }

  getGradient(x) {
    return math.multiply(
      math.multiply(math.transpose(this.a), this.a),
      x
    );
  }

  findArgMinI(z) {
    this.prevGradient = z;
    let tree = new BinarySearchTree();
    z.forEach((item, index) => {
      tree.add(item, index[0]);
    });

    const min = tree.findMin();

    return min.position;

  }

  gammaCalc(k) {
    return 2 / (k + 1);
  }
  
  beta(k) {
    if (k == 2) return 1/3;

    let betaResult = 1;
    for (let r = 2; r <= k - 1; r++) {
      betaResult = betaResult * (1 - this.gammaCalc(r));
    }

    return betaResult;
  }

  gammaModification(k) {
    return this.gammaCalc(k)/this.beta(k + 1);
  }

  y(position) {
    this.prevY = new Array(this.n).fill(0);
    this.prevY[position] = 1;
  }

  calcNormVector(x) {
    let sum = 0;
    x.forEach((value) => { sum += Math.pow(Math.abs(value), 2)} );

    return Math.sqrt(sum);

  }

  stopCondition(zNext, zPrev) {

    return 0.5 * Math.pow(
        this.calcNormVector(
          math.subtract(
            math.multiply(this.a, zNext),
            math.multiply(this.a, zPrev)
          )),
        2) >= Math.pow(this.eps, 2) * 0.5
  }

  fw() {
    let zPrev = this.startPoint;
    let zNext = this.startPoint;
    let k = 1;
    let iterationSolutions = [];
    console.log(this.getGradient(this.startPoint));
    this.y(
      this.findArgMinI(this.getGradient(this.startPoint))
    );
    let currentGamma = 1;

    do{
      iterationSolutions.push(zPrev);
      currentGamma = this.gammaModification(k);
      zPrev = zNext;
      zNext = math.add(zPrev, math.multiply(currentGamma, this.prevY));

      this.y(
        this.findArgMinI(math.add(this.prevGradient, math.multiply(currentGamma, this.getGradient(this.prevY))))
      );

      k++;
      console.log(zPrev, zNext, this.prevY);
    }while(this.stopCondition(zNext, zPrev));

    return {
      solution: math.multiply(zNext, this.beta(k)),
      iterationSolutions: iterationSolutions,
      iterations: k
    }
  }
}


module.exports = FW;