class ObjectNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;

    this.visited = false;
    this.globalGoal = Infinity;
    this.localGoal = Infinity;
    this.parent = null;

    this.neighbors = [];

    ObjectNode.list.push(this);
  }

  connectWithNode(node) {
    ObjectNode.connections.push([this, node, this.distToNode(node)]);

    this.neighbors.push(node);
    node.neighbors.push(this);

    if (!canvas.startNode) canvas.startNode = this;

    if (canvas.endNode === this || canvas.endNode == null) canvas.endNode = node;

    console.log('Connected!');
  }

  distToNode(node) {
    return Math.sqrt(Math.pow(node.x - this.x, 2) + Math.pow(node.y - this.y, 2));
  }

  isNeighborsWithNode(node) {
    return this.neighbors.includes(node);
  }

  isPointWithin(pointX, pointY, gap = 0) {
    return (
      pointX >= this.x - this.radius - gap &&
      pointX < this.x + this.radius + gap &&
      pointY >= this.y - this.radius - gap &&
      pointY < this.y + this.radius + gap
    );
  }

  isIntersectingWithLine(a, b) {
    const a_to_p = [this.x - a.x, this.y - a.y];
    const a_to_b = [b.x - a.x, b.y - a.y];

    const atb2 = a_to_b[0] * a_to_b[0] + a_to_b[1] * a_to_b[1];
    const dot = a_to_p[0] * a_to_b[0] + a_to_p[1] * a_to_b[1];

    const t = dot / atb2;

    const x = a.x + t * a_to_b[0];
    const y = a.y + t * a_to_b[1];

    if (Math.abs(x - this.x) < this.radius && Math.abs(y - this.y) < this.radius) return true;

    return false;
  }

  get position() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

ObjectNode.list = [];
ObjectNode.connections = [];

ObjectNode.placeAtGrid = function (nodeX, nodeY, canvas) {
  const cellCol = Math.min(Math.max(Math.round(nodeX / canvas.gridGap), 0), canvas.gridCols - 1);
  const cellRow = Math.min(Math.max(Math.round(nodeY / canvas.gridGap), 0), canvas.gridRows - 1);
  const index = cellCol - 1 + canvas.gridCols * (cellRow - 1); // shifted by 1

  if (canvas.gridNodes[index]?.node) {
    console.log('ups');
    return;
  }

  canvas.gridNodes[index].node = new ObjectNode(cellCol * canvas.gridGap, cellRow * canvas.gridGap);
};

ObjectNode.nodeAt = function (x, y) {
  const cellCol = Math.min(Math.max(Math.round(x / canvas.gridGap), 0), canvas.gridCols - 1);
  const cellRow = Math.min(Math.max(Math.round(y / canvas.gridGap), 0), canvas.gridRows - 1);
  const index = cellCol - 1 + canvas.gridCols * (cellRow - 1); // shifted by 1

  return canvas.gridNodes[index] ? canvas.gridNodes[index].node : null;
};
