'use strict';

const NL1 = require('./methods/NL1');
const FW = require('./methods/FW');
const math = require('mathjs');

const p = math.matrix([[0.1, 0.9, 0], [0.2, 0, 0.8], [0, 0, 1]], 'sparse');
const i = math.eye(3, 3, 'sparse');
const b = math.subtract(math.transpose(p), i);

const x0 = [2, 1, 1];


const test = new NL1(b, x0, 0.00001);

console.log(test.nl1());


const test2 = new FW(b, x0, 0.000001);

console.log(test2.fw());

