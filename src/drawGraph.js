require('../node_modules/graphosaurus/src/graphosaurus.js');

let graph = G.graph({
  bgColor: "black",
  edgeWidth: 0.5,
  nodeSize: 6
});

const stochasticMatrix = require('./stochasticMatrix');
const math = require('mathjs');

class drawGraph{
  constructor(a, domElement) {
    this.a = a;
    this.n = a.size()[0];
    this.domElement = domElement;
  }
  
  colorNode(value) {
    const countColors = 3;
    const part = this.n / countColors;
    const valuesColors = ["#FFEB3B", "#009E09", "#CD7102", "#F44336"];

    return valuesColors[Math.floor(value * countColors)];
  }

  createNodes() {
    let nodes = [];

    for (let i = 0; i < this.n; i++) {
      let x = Math.random();
      let y = Math.random();
      let z = Math.random();

      nodes.push(G.node([x, y, z], {color: "#BC0015"}).addTo(graph));
    }

    return nodes;
  }

  createEdges(nodes) {
    let edges = [];
    this.a.forEach((item, index) => {
      let i = index[0];
      let j = index[1];

      nodes[j].setColor(this.colorNode(item));
      
      edges.push(G.edge([nodes[i], nodes[j]], {color: "#00008B"}).addTo(graph));
    }, true)
    
    return edges;
  }

  render() {
    this.createEdges(this.createNodes());

    graph.renderIn(this.domElement);
  }
}

module.exports = drawGraph;

//
//
//
// let a = new stochasticMatrix(50, 8);
// console.time("generate matrix");
// let b = a.generate();
//
// let myGraph = new drawGraph(b, 'graph');
// myGraph.render();
//
// console.timeEnd("generate matrix");

