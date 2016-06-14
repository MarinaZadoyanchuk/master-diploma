const drawGraph = require('./drawGraph');
const nl1 = require('../methods/NL1');
const fw = require('../methods/FW');
const popov = require('../methods/Popov');
const stochasticMatrix = require('./stochasticMatrix');
const math = require('mathjs');

const n = 100;
const s = 10;
const p = new stochasticMatrix(n, s).generate();
const a = math.subtract(p, math.eye(n, n, 'sparse'));

let x0 = math.matrix(new Array(n).fill(0), 'sparse');
x0.set([0, 0], 1);

let wForPopov = math.matrix(new Array(2 * n).fill(0), 'sparse')
wForPopov.set([1, 0], 1);

const eps = 0.0001;

let myGraph = new drawGraph(p, 'graph');
myGraph.render();

const nl1Method = new nl1(a, x0, eps).nl1();

const fwMethod = new fw(a, x0, eps).fw();

const popovMethod = new popov(a, x0, wForPopov, eps).method();

const counts_points = 20;
const drawStep = Math.floor(fwMethod.times.length / counts_points);
const options = {
  showPoint: false,
  // Disable line smoothing
  lineSmooth: false,
  // Y-Axis specific configuration
  axisY: {
    low: 0
  },
  series: {
    'fw': {
      meta: 'fw'
    }
  }
}

const dataNl1 = {
  labels: nl1Method.times.filter((value, index) => index % drawStep == 0),
  series: [
    {
      name: "nl1",
      data: nl1Method.epss.filter((value, index) => index % drawStep == 0)
    }
  ]
}

const dataFw = {
  labels: fwMethod.times.filter((value, index) => index % drawStep == 0),
  series: [
    {
      name: "fw",
      data: fwMethod.epss.filter((value, index) => index % drawStep == 0)
    }
  ]
}


const dataPopov = {
  labels: popovMethod.times.filter((value, index) => index % drawStep == 0),
  series: [
    {
      name: "popov",
      data: popovMethod.epss.filter((value, index) => index % drawStep == 0)
    }
  ]
}
new Chartist.Line('#ln1', dataNl1, options);
new Chartist.Line('#fw', dataFw, options);
new Chartist.Line('#popov', dataPopov, options);