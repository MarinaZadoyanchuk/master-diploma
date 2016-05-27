'use strict';

const NL1 = require('./methods/NL1');
const math = require('mathjs');

const p = math.matrix([[0, 1, 0], [0, 1, 0], [0.1, 0.8, 0]], 'sparse');
const i = math.eye(3, 3, 'sparse');
const b = math.subtract(math.transpose(p), i);

const x0 = [1, 1, 1];


const test = new NL1(b, x0, 0.00001);

console.log(test.nl1());

