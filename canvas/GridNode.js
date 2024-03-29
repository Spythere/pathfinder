function GridNode(x, y, index) {
  const radius = 8;

  this.x = x;
  this.y = y;
  this.gridIndex = index;

  this.radius = radius;

  this.isOccupied = false;

  this.isObstacle = false;
  this.isVisited = false;

  this.isOnPath = false;

  this.globalGoal = Infinity;
  this.localGoal = Infinity;

  this.parentNode = null;
  this.neighborList = [];
}

GridNode.prototype.connectWithNode = function (node) {
  const connection = [this.gridIndex, node.gridIndex, this.distToNode(node)];
  grid.connectionList.push(connection);

  this.neighborList.push(node.gridIndex);
  node.neighborList.push(this.gridIndex);

  let lastStartNode, lastEndNode;

  if (grid.startNode === null) {
    lastStartNode = grid.startNode;
    grid.startNode = this;
    // grid.history.push(['start_node', this.gridIndex]);
  }

  if (grid.endNode === this || grid.endNode == null) {
    lastEndNode = grid.endNode;
    grid.endNode = node;

    if (this.isOnPath) {
      runPathFinder();
    }
    // grid.history.push(['end_node', this.gridIndex]);
  }

  // if (grid.endNode && grid.endNode.isOnPath) {
  //   resetPathFinder();
  // }

  grid.history.push(['connection', connection, grid.connectionList.length - 1, lastStartNode, lastEndNode]);
};

GridNode.prototype.distToNode = function (node) {
  return Math.sqrt(Math.pow(node.x - this.x, 2) + Math.pow(node.y - this.y, 2));
};

GridNode.prototype.isNeighborsWith = function (node) {
  return this.neighborList.includes(node.gridIndex);
};

GridNode.prototype.reset = function () {
  this.isOccupied = false;

  this.isObstacle = false;
  this.isVisited = false;
  this.isOnPath = false;

  this.globalGoal = Infinity;
  this.localGoal = Infinity;

  this.parentNode = null;
  this.neighborList = [];
};

GridNode.prototype.resetPathData = function () {
  this.isVisited = false;
  this.globalGoal = Infinity;
  this.localGoal = Infinity;

  this.isOnPath = false;
  this.parentNode = null;
};

GridNode.getNodeAt = function (posX, posY, grid) {
  const cellCol = Math.min(Math.max(Math.round(posX / grid.gap), 0), grid.cols - 1);
  const cellRow = Math.min(Math.max(Math.round(posY / grid.gap), 0), grid.cols - 1);
  const index = cellCol - 1 + grid.cols * (cellRow - 1); // shifted by 1

  return grid.nodeList[index] || null;
};

GridNode.getNodeAtCursorPosition = function () {
  const node = GridNode.getNodeAt(mousePosition.x, mousePosition.y, grid);

  return node;
};

GridNode.placeAt = function (posX, posY, grid) {
  const nearestNode = GridNode.getNodeAt(posX, posY, grid);

  if (!nearestNode) return;

  if (nearestNode.isOccupied) return;

  nearestNode.isOccupied = true;

  grid.history.push(['place_node', nearestNode.gridIndex]);
};

GridNode.prototype.removeNode = function () {
  if (!this.isOccupied) return;

  if (this.gridIndex === grid.startNode?.gridIndex || this.gridIndex === grid.endNode?.gridIndex) {
    alert(`You can't remove the start or end nodes!`);

    return;
  }

  // if (this.neighborList.length == 2) {
  //   this.neighborList[0].connectWithNode(this.neighborList[1]);
  // }
  grid.history.push(['remove_node', this.gridIndex]);

  for (let neighborGridIndex of this.neighborList) {
    const neighbor = grid.nodeList[neighborGridIndex];

    neighbor.neighborList = neighbor.neighborList.filter((nIndex) => nIndex !== this.gridIndex);
  }

  grid.connectionList = grid.connectionList.filter((conn) => !conn.includes(this.gridIndex));

  if (this.isOnPath) resetPathFinder();

  this.reset();
};

GridNode.goBack = function (steps = 1) {
  if (grid.history.length == 0) return;

  const point = grid.history[grid.history.length - 1];
  // for (let point of grid.history) {
  // console.log(point);
  if (point[0] === 'connection') {
    const connection = point[1];
    const connectionIndex = point[2];
    const lastStartNode = point[3];
    const lastEndNode = point[4];

    const connectionNodeA = grid.nodeList[connection[0]];
    const connectionNodeB = grid.nodeList[connection[1]];

    connectionNodeA.neighborList = connectionNodeA.neighborList.filter(
      (nodeIndex) => nodeIndex !== connectionNodeB.gridIndex
    );

    connectionNodeB.neighborList = connectionNodeB.neighborList.filter(
      (nodeIndex) => nodeIndex !== connectionNodeA.gridIndex
    );

    if (lastStartNode !== undefined) {
      grid.startNode = lastStartNode;
    }

    // If last end node was different
    if (lastEndNode !== undefined) {
      grid.endNode = lastEndNode;
    }

    grid.connectionList.splice(connectionIndex, 1);
  }

  if (point[0] === 'place_node') {
    grid.nodeList[point[1]].isOccupied = false;
  }

  if (point[0] === 'remove_node') {
    grid.nodeList[point[1]].isOccupied = true;
  }

  if (point[0] === 'pathfinder') {
    resetPathFinder();
  }

  grid.history.pop();
};

//   isPointWithin(pointX, pointY, gap = 0) {
//     return (
//       pointX >= this.x - this.radius - gap &&
//       pointX < this.x + this.radius + gap &&
//       pointY >= this.y - this.radius - gap &&
//       pointY < this.y + this.radius + gap
//     );
//   }

//   isIntersectingWithLine(a, b) {
//     const a_to_p = [this.x - a.x, this.y - a.y];
//     const a_to_b = [b.x - a.x, b.y - a.y];

//     const atb2 = a_to_b[0] * a_to_b[0] + a_to_b[1] * a_to_b[1];
//     const dot = a_to_p[0] * a_to_b[0] + a_to_p[1] * a_to_b[1];

//     const t = dot / atb2;

//     const x = a.x + t * a_to_b[0];
//     const y = a.y + t * a_to_b[1];

//     if (Math.abs(x - this.x) < this.radius && Math.abs(y - this.y) < this.radius) return true;

//     return false;
//   }
