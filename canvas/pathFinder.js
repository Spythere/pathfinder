function heuristic(nodeA, nodeB) {
  return nodeA.distToNode(nodeB);
}

// A* PATHFINDER ALGORITHM
function runPathFinder() {
  for (const node of grid.nodeList) {
    node.visited = false;
    node.globalGoal = Infinity;
    node.localGoal = Infinity;
    node.parentNode = null;
  }

  let currentNode = grid.startNode;
  currentNode.localGoal = 0;
  currentNode.globalGoal = heuristic(currentNode, grid.endNode);

  const untestedNodes = [];
  untestedNodes.push(currentNode);

  while (untestedNodes.length != 0) {
    untestedNodes.sort((l, r) => l.globalGoal < r.globalGoal);

    while (untestedNodes.length != 0 && untestedNodes[0].visited) untestedNodes.shift();

    if (untestedNodes.length == 0) break;

    currentNode = untestedNodes[0];
    currentNode.visited = true;

    for (const nb of currentNode.neighborList) {
      if (!nb.visited) untestedNodes.push(nb);

      let currentGoal = currentNode.localGoal + currentNode.distToNode(nb);

      if (currentGoal < nb.localGoal) {
        nb.parent = currentNode;
        nb.localGoal = currentGoal;
        nb.globalGoal = nb.localGoal + heuristic(nb, grid.endNode);
      }
    }
  }
}
