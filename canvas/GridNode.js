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
  const connection = [this, node, this.distToNode(node)];
  grid.connectionList.push(connection);

  this.neighborList.push(node);
  node.neighborList.push(this);

  let lastStartNode, lastEndNode;

  if (grid.startNode === null) {
    lastStartNode = grid.startNode;
    grid.startNode = this;
    // grid.history.push(['start_node', this.gridIndex]);
  }

  if (grid.endNode === this || grid.endNode == null) {
    lastEndNode = grid.endNode;
    grid.endNode = node;
    // grid.history.push(['end_node', this.gridIndex]);
  }

  grid.history.push(['connection', connection, grid.connectionList.length - 1, lastStartNode, lastEndNode]);
};

GridNode.prototype.distToNode = function (node) {
  return Math.sqrt(Math.pow(node.x - this.x, 2) + Math.pow(node.y - this.y, 2));
};

GridNode.prototype.isNeighborsWith = function (node) {
  return this.neighborList.includes(node);
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

  // grid.history.push(['reset_node', this]);
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

  for (let neighbor of this.neighborList) {
    neighbor.neighborList = neighbor.neighborList.filter((node) => node.gridIndex !== this.gridIndex);
  }

  grid.connectionList = grid.connectionList.filter((conn) => !conn.includes(this));

  if (this.isOnPath) {
    this.reset();
    resetPathFinder();
  } else this.reset();
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

    connection[0].neighborList = connection[0].neighborList.filter(
      (node) => node.gridIndex !== connection[1].gridIndex
    );

    connection[1].neighborList = connection[1].neighborList.filter(
      (node) => node.gridIndex !== connection[0].gridIndex
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

  // if (point[0] === 'start_node') {
  //   grid.nodeList[point[1]].isOccupied = false;
  // }

  // if (point[0] === 'node_node') {
  //   grid.nodeList[point[1]].isOccupied = false;
  // }

  grid.history.pop();
  // }
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
