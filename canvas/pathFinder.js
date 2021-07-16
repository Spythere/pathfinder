function heuristic(nodeA, nodeB) {
  return nodeA.distToNode(nodeB);
}

// A* PATHFINDER ALGORITHM
function runPathFinder() {
  if (!grid.startNode || !grid.endNode) return;

  resetPathFinder();

  let currentNode = grid.startNode;
  currentNode.localGoal = 0;
  currentNode.globalGoal = heuristic(currentNode, grid.endNode);

  const untestedNodes = [];
  untestedNodes.push(currentNode);

  while (untestedNodes.length != 0) {
    untestedNodes.sort((l, r) => l.globalGoal < r.globalGoal);

    while (untestedNodes.length != 0 && untestedNodes[0].isVisited) untestedNodes.shift();

    if (untestedNodes.length == 0) break;

    currentNode = untestedNodes[0];
    currentNode.isVisited = true;

    for (const nb of currentNode.neighborList) {
      if (!nb.isVisited) untestedNodes.push(nb);

      let currentGoal = currentNode.localGoal + currentNode.distToNode(nb);

      if (currentGoal < nb.localGoal) {
        nb.parentNode = currentNode;
        nb.localGoal = currentGoal;
        nb.globalGoal = nb.localGoal + heuristic(nb, grid.endNode);
      }
    }
  }

  let currentChildNode = grid.endNode;

  while (currentChildNode.parentNode) {
    currentChildNode.isOnPath = true;
    currentChildNode = currentChildNode.parentNode;
  }
}

function resetPathFinder() {
  for (const node of grid.nodeList) {
    node.isVisited = false;
    node.globalGoal = Infinity;
    node.localGoal = Infinity;

    node.isOnPath = false;
    node.parentNode = null;
  }
}
