class ObjectNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 15;

    this.currentParrent = null;
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

const canvas = {
  element: null,
  ctx: null,
  dimensions: {
    width: 0,
    height: 0,
  },
  mousePos: { x: 0, y: 0 },
  connectionStartNode: null,

  startNode: null,
  endNode: null,
};

function initCanvasObject(canvasRef) {
  canvas.element = canvasRef;
  canvas.ctx = canvasRef.getContext('2d');
  canvas.dimensions = {
    width: canvasRef.width,
    height: canvasRef.height,
  };

  canvas.ctx.lineWidth = 2;
  canvas.ctx.font = '30px Arial';

  return canvas;
}

function calculateMousePosition(clientX, clientY) {
  const { x, y } = canvas.element.getBoundingClientRect();

  const mouseX = ~~(clientX - x);
  const mouseY = ~~(clientY - y);

  canvas.mousePos.x = mouseX;
  canvas.mousePos.y = mouseY;
}

function updateCanvas() {}

function renderCanvas() {
  const { ctx } = canvas;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.dimensions.width, canvas.dimensions.height);

  for (let con of ObjectNode.connections) {
    ctx.beginPath();
    ctx.moveTo(con[0].x, con[0].y);
    ctx.lineTo(con[1].x, con[1].y);
    ctx.stroke();
  }

  for (let node of ObjectNode.list) {
    ctx.fillStyle = canvas.startNode === node ? 'green' : canvas.endNode === node ? 'red' : 'black';

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2, false);
    ctx.fill();

    if (canvas.connectionStartNode) {
      ctx.beginPath();
      ctx.moveTo(canvas.connectionStartNode.position.x, canvas.connectionStartNode.position.y);
      ctx.lineTo(canvas.mousePos.x, canvas.mousePos.y);
      ctx.stroke();
    }
    // if (object.neighbors.length != 0) {
    //   for (let neighbor of object.neighbors) {
    //     ctx.beginPath();
    //     ctx.moveTo(object.x, object.y);
    //     ctx.lineTo(neighbor.x, neighbor.y);
    //     ctx.stroke();
    //   }
    // }
  }
}

function tick() {
  updateCanvas();
  renderCanvas();

  requestAnimationFrame(tick);
}
