const math = require('mathjs');
const BinarySearchTree = require('../src/binarySearchTree');
const stochasticMatrix = require('../src/stochasticMatrix');

class FW {
  constructor(a, startPoint, eps) {
    this.a = a;
    this.startPoint = startPoint;
    this.eps = eps;

    this.n = startPoint.size()[0];
    this.prevGradient = this.getGradient(startPoint);
    this.prevY = math.matrix(new Array(this.n).fill(0), 'sparse');
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
      tree.add(item, index);
    }, true);

    const min = tree.findMin();

    return min.position;

  }

  gammaCalc(k) {
    return 2 / (k + 1);
  }
  
  beta(k) {
    if (k == 2) return 1/2;

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
    this.prevY =  math.matrix(new Array(this.n).fill(0), 'sparse');
    this.prevY.set(position, 1);
  }

  calcNormVector(x) {
    let sum = 0;
    x.forEach((value) => { sum += Math.pow(value, 2)} );

    return Math.sqrt(sum);

  }

  stopCondition(zNext) {

    return this.calcNormVector(
            math.multiply(this.a, zNext)
        ) >= this.eps;
  }

  fw() {
    let zPrev = this.startPoint;
    let zNext = this.startPoint;
    let k = 1;
    let iterationSolutions = [];
    this.y(
      this.findArgMinI(this.getGradient(this.startPoint))
    );
    let currentGamma;
    let epss = [this.stopCondition(zPrev)];
    let times = [0];
    const now = new Date;
    
    do{
      // iterationSolutions.push(zPrev);
      currentGamma = this.gammaModification(k);
      zPrev = zNext;
      zNext = math.add(zPrev, math.multiply(currentGamma, this.prevY));

      this.y(
        this.findArgMinI(math.add(this.prevGradient, math.multiply(currentGamma, this.getGradient(this.prevY))))
      );

      k++;
      if (new Date - now < 100) {
        epss.push(this.calcNormVector(
          math.multiply(this.a, math.multiply(zNext, this.beta(k)))
        ));
        times.push(new Date - now);
      }
    }while(new Date - now < 100)

    return {
      solution: math.multiply(zNext, this.beta(k)),
      // iterationSolutions: iterationSolutions,
      iterations: k,
      epss: epss,
      times: times
    }
  }
}
module.exports = FW;