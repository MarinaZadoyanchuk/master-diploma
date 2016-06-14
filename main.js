const NL1 = require('./methods/NL1');
const FW = require('./methods/FW');
const math = require('mathjs');
const stochasticMatrix = require('./src/stochasticMatrix');
require('./src/drawMethods');
//
// const n = 1000;
// const s = 10;
// const p = new stochasticMatrix(n, s);
// const a = math.subtract(p.generate(), math.eye(n, n, 'sparse'));
//
// x0 = math.matrix(new Array(n).fill(0), 'sparse');
// x0.set([0, 0], 1);
//
// const eps = 0.0001;
//
// const nl1 = new NL1(a, x0, eps);
//
// console.time("nl1");
// const result = nl1.nl1();
// console.timeEnd("nl1");
// let sumResult = 0;
// result.solution.forEach((value) => sumResult+=value);
//
// console.log(result, sumResult);


