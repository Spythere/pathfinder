const grid = {
  nodeList: [],
  connectionList: [],

  history: [],

  gap: 30,
  rows: 0,
  cols: 0,

  startNode: null,
  endNode: null,
  connectionStartNode: null,
};

const mousePosition = {
  x: 0,
  y: 0,
};

const canvas = {
  element: null,
  ctx: null,
  dimensions: {
    width: 0,
    height: 0,
  },
};

const styles = {
  bgClr: '#333',
  startNodeClr: 'green',
  endNodeClr: 'red',
  onPathNodeClr: 'yellow',
  font: '30px Arial',
  freeNodeRadius: 1,
  freeNodeClr: '#aaa',
  occupiedNodeClr: 'white',
  connectionClr: '#fff',
  pathConnectionClr: 'yellow',
  newConnectionClr: '#fff',
};

function initCanvasObject(canvasRef) {
  canvas.element = canvasRef;
  canvas.ctx = canvasRef.getContext('2d');

  resizeCanvas();

  canvas.ctx.lineWidth = 2;
  canvas.ctx.font = '30px Arial';

  grid.cols = Math.floor(canvas.dimensions.width / grid.gap) - 1;
  grid.rows = Math.floor(canvas.dimensions.height / grid.gap) - 1;

  for (let i = 0; i < grid.cols; i++) {
    for (let j = 0; j < grid.rows; j++) {
      const index = i + grid.cols * j;
      grid.nodeList[index] = new GridNode(i * grid.gap + grid.gap, grid.gap * j + grid.gap, index);
    }
  }

  return canvas;
}

function resizeCanvas() {
  const ratio = 768 / 1024;

  canvas.element.width = 1024;
  canvas.element.height = canvas.element.width * ratio;

  canvas.dimensions.width = canvas.element.width;
  canvas.dimensions.height = canvas.element.height;

  renderCanvas();
}

function calculateMousePosition(clientX, clientY) {
  const { x, y, width } = canvas.element.getBoundingClientRect();

  // Canvas element width to the exact scaled width ratio
  const scaleRatio = canvas.element.width / width;

  const mouseX = (clientX - x) * scaleRatio;
  const mouseY = (clientY - y) * scaleRatio;

  mousePosition.x = mouseX;
  mousePosition.y = mouseY;
}

const resetCanvas = ({ ctx, dimensions }) => {
  ctx.fillStyle = styles.bgClr;
  ctx.fillRect(0, 0, dimensions.width, dimensions.height);
};

const drawFreeNodes = ({ ctx }) => {
  ctx.fillStyle = styles.freeNodeClr;

  for (let node of grid.nodeList) {
    if (node.isOccupied) continue;

    ctx.beginPath();
    ctx.arc(node.x, node.y, styles.freeNodeRadius, 0, Math.PI * 2, false);
    ctx.fill();
  }
};

const drawConnections = ({ ctx }) => {
  ctx.strokeStyle = styles.connectionClr;
  ctx.lineWidth = 2;

  for (let con of grid.connectionList) {
    ctx.beginPath();
    ctx.moveTo(con[0].x, con[0].y);
    ctx.lineTo(con[1].x, con[1].y);
    ctx.stroke();
  }

  ctx.strokeStyle = styles.newConnectionClr;

  if (grid.connectionStartNode) {
    ctx.beginPath();
    ctx.moveTo(grid.connectionStartNode.x, grid.connectionStartNode.y);
    ctx.lineTo(mousePosition.x, mousePosition.y);
    ctx.stroke();
  }
};

const drawPath = ({ ctx }) => {
  ctx.strokeStyle = styles.pathConnectionClr;
  ctx.lineWidth = 5;

  let currentChildNode = grid.endNode;

  while (grid.endNode && currentChildNode.parentNode) {
    ctx.beginPath();
    ctx.moveTo(currentChildNode.x, currentChildNode.y);
    ctx.lineTo(currentChildNode.parentNode.x, currentChildNode.parentNode.y);
    ctx.stroke();

    currentChildNode = currentChildNode.parentNode;
  }
};

const drawNodes = ({ ctx }) => {
  for (let node of grid.nodeList) {
    if (!node.isOccupied) continue;

    ctx.fillStyle =
      grid.startNode === node
        ? styles.startNodeClr
        : grid.endNode === node
        ? styles.endNodeClr
        : node.isOnPath
        ? styles.onPathNodeClr
        : styles.occupiedNodeClr;

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2, false);
    ctx.fill();
  }
};

function renderCanvas() {
  resetCanvas(canvas);

  drawFreeNodes(canvas);
  drawConnections(canvas);
  drawPath(canvas);
  drawNodes(canvas);
}

function tick() {
  updateCanvas();
  renderCanvas();

  requestAnimationFrame(tick);
}
