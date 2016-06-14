class BinarySearchTree {
  constructor(arr) {
    arr = arr || [];

    if (!arr.length) {
      this.root = null;
    } else {
      arr.forEach((value, position) => {
          this.add(value, position);
        }
      )
    }
  }

  createNode(value, position) {
    let node = {
      value,
      position,
      left: null,
      right: null
    };

    return node;
  }

  add(value, position) {
    const currentNode = this.createNode(value, position);

    if (!this.root) {
      this.root = currentNode;
    } else {
      this.insert(currentNode);
    }
    return this;
  }

  insert(node) {
    const value = node.value;
    let currentNode = this.root;

    while(currentNode) {
      if (value > currentNode.value) {
        if (!currentNode.right) {
          currentNode.right = node;
          break;
        } else {
          currentNode = currentNode.right;
        }
      } else {
        if (!currentNode.left) {
          currentNode.left = node;
          break;
        } else {
          currentNode = currentNode.left;
        }
      }
    }
  }

  inOrder() {
    let result = [];
    const node = this.root;

    const traverse = function(node) {
      node.left && traverse(node.left);
      result.push(node.value);
      node.right && traverse(node.right);
    }

    traverse(node);

    return result;
  }

  findMin() {
    let currentNode = this.root;

    while(currentNode.left) {
      currentNode = currentNode.left;
    }
    return {
      value: currentNode.value,
      position: currentNode.position
    };
  }

  findMax() {
    let currenNode = this.root;

    while(currenNode.right) {
      currenNode = currenNode.right;
    }

    return {
      value: currenNode.value,
      position: currenNode.position
    }
  }

}

module.exports = BinarySearchTree;