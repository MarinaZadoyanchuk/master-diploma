const math = require('mathjs');
const BinarySearchTree = require('../src/binarySearchTree');
const stochasticMatrix = require('../src/stochasticMatrix');

class NL1 {
  
  constructor(a, startPoint, eps) {
    this.a = a;
    this.startPoint = startPoint;
    this.eps = eps;
    this.n = startPoint.size()[0];
    this.prevGradientNormVector = null;
  }

  gradientNormVector(x) {
    return math.multiply(
      math.multiply(math.transpose(this.a), this.a),
      x
    )
  }

  getGradient(x, h) {
    let currentGradientNormVector;
    
    if (this.prevGradientNormVector) {
      currentGradientNormVector = math.add(
        this.prevGradientNormVector,
        this.gradientNormVector(h)
      );
    } else {
      currentGradientNormVector = this.gradientNormVector(x);
    }


    this.prevGradientNormVector = currentGradientNormVector;

    const summandGradient = this.getSummandGradient(x);

    return summandGradient.map((value, index) => {
       return currentGradientNormVector.get(index) + value;
     }
    )
  }

  plusComponets(value) {
      if (value < 0) return 0;

      return value;
  }

  heavisideStep(value) {
      if (value < 0) return 0;

      return 1;
  }

  getSummandGradient(x) {
    return x.map((value, index) => {
      return this.plusComponets(-value) * this.heavisideStep(-value)
    })
  }

  findArgI(x, h) {
    let three = new BinarySearchTree();
    const gradient = this.getGradient(x, h);
    gradient.forEach((item, index) => {
      three.add(item, index);
    }, true);


    const minValue = three.findMin();
    const maxValue = three.findMax();

    return {
      min: minValue,
      max: maxValue
    }
  }

  calcH(xPrev, hPrev) {
    let h = math.matrix(new Array(this.n).fill(0), 'sparse');

    const positions = this.findArgI(xPrev, hPrev);
    h.set(positions.min.position, 1/8 * (positions.max.value - positions.min.value));
    h.set(positions.max.position, -1/8 * (positions.max.value - positions.min.value));

    return h;
  }

  calcNormVector(x) {
    let sum = 0;
    x.forEach((value) => { sum += Math.pow(value, 2)}, true );

    return Math.sqrt(sum);

  }
  
  stopCondition(xNext, xPrev) {

    return this.calcNormVector(
              math.multiply(this.a, xNext)
            ) >= this.eps
  }

  nl1() {
    let xNext = this.startPoint;
    let iterations = 0;
    let epss = [this.calcNormVector(
      math.multiply(this.a, xNext)
    )];
    let times = [0];
    let xPrev = this.startPoint;
    let hPrev = math.matrix(new Array(this.n).fill(0), 'sparse');
    let now = new Date;

    do {
      // iterationSolutions.push(xNext);
      iterations++;

      hPrev = this.calcH(xNext, hPrev);
      xPrev = xNext;
      xNext = math.add(xPrev, hPrev);
      if (new Date - now < 200) {
        epss.push(this.calcNormVector(
          math.multiply(this.a, xNext)
        ));
        times.push(new Date - now)
      }
    }while(new Date - now < 200)

    return {
      solution: xNext,
      iterations: iterations,
      epss: epss,
      times: times
    }
  }
}

module.exports = NL1;