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
  grid.connectionList.push([this, node, this.distToNode(node)]);

  this.neighborList.push(node);
  node.neighborList.push(this);

  if (!grid.startNode) grid.startNode = this;

  if (grid.endNode === this || grid.endNode == null) grid.endNode = node;

  console.log('Connected!');
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
};

GridNode.prototype.removeNode = function () {
  if (!this.isOccupied) return;

  if (this.neighborList.length == 2) {
    this.neighborList[0].connectWithNode(this.neighborList[1]);
  }

  for (let neighbor of this.neighborList) {
    neighbor.neighborList = neighbor.neighborList.filter((node) => node.gridIndex !== this.gridIndex);
  }

  grid.connectionList = grid.connectionList.filter((conn) => !conn.includes(this));

  this.reset();

  runPathFinder();
  console.log('Removed');
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
