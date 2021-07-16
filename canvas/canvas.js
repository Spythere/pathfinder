const grid = {
  nodeList: [],
  connectionList: [],

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

function initCanvasObject(canvasRef) {
  canvas.element = canvasRef;
  canvas.ctx = canvasRef.getContext('2d');
  canvas.dimensions = {
    width: canvasRef.width,
    height: canvasRef.height,
  };

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

function calculateMousePosition(clientX, clientY) {
  const { x, y } = canvas.element.getBoundingClientRect();

  const mouseX = clientX - x;
  const mouseY = clientY - y;

  mousePosition.x = mouseX;
  mousePosition.y = mouseY;
}

function renderCanvas() {
  const { ctx, dimensions } = canvas;
  const { nodeList, connectionList } = grid;

  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, dimensions.width, dimensions.height);

  for (let node of nodeList) {
    if (node.isOccupied) continue;

    ctx.fillStyle = '#aaa';
    ctx.beginPath();
    ctx.arc(node.x, node.y, 1, 0, Math.PI * 2, false);
    ctx.fill();
  }

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;

  for (let con of connectionList) {
    ctx.beginPath();
    ctx.moveTo(con[0].x, con[0].y);
    ctx.lineTo(con[1].x, con[1].y);
    ctx.stroke();
  }

  if (grid.endNode) {
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 5;

    let currentChildNode = grid.endNode;

    while (currentChildNode.parentNode) {
      console.log(currentChildNode.gridIndex);

      ctx.beginPath();
      ctx.moveTo(currentChildNode.x, currentChildNode.y);
      ctx.lineTo(currentChildNode.parentNode.x, currentChildNode.parentNode.y);
      ctx.stroke();

      currentChildNode = currentChildNode.parentNode;
    }
  }

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;

  for (let node of nodeList) {
    if (!node.isOccupied) continue;

    ctx.fillStyle =
      grid.startNode === node ? 'green' : grid.endNode === node ? 'red' : node.isOnPath ? 'yellow' : 'white';

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.strokeStyle = '#fff';
    if (grid.connectionStartNode) {
      ctx.beginPath();
      ctx.moveTo(grid.connectionStartNode.x, grid.connectionStartNode.y);
      ctx.lineTo(mousePosition.x, mousePosition.y);
      ctx.stroke();
    }
  }
}

function tick() {
  updateCanvas();
  renderCanvas();

  requestAnimationFrame(tick);
}
