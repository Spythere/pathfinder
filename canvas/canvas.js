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

  if (canvas.endNode) {
    let currentChildNode = canvas.endNode;

    while (currentChildNode.parent) {
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 5;

      ctx.beginPath();
      ctx.moveTo(currentChildNode.x, currentChildNode.y);
      ctx.lineTo(currentChildNode.parent.x, currentChildNode.parent.y);
      ctx.stroke();

      currentChildNode = currentChildNode.parent;
    }
  }

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;

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
  }
}

function tick() {
  updateCanvas();
  renderCanvas();

  requestAnimationFrame(tick);
}
