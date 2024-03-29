const App = {
  data() {
    return {
      mode: 0 /* 0 - placing nodes, 1 - adding connections */,
      storageMgr: new StorageManager('SAVED_GRID'),
    };
  },

  mounted() {
    this.init();

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Enter') {
        runPathFinder();
        renderCanvas();
      }

      if (e.code === 'Backspace') {
        GridNode.goBack(1);
        renderCanvas();
      }

      if (e.code === 'KeyS') {
        // renderCanvas();
        // this.storageMgr.saveGridState();
        // console.log('Grid state saved!');
      }
    });
  },

  methods: {
    init() {
      initCanvasObject(this.$refs['canvas']);

      window.addEventListener('resize', (e) => {
        resizeCanvas();
      });

      renderCanvas();
    },

    render() {
      const { ctx, mapWidth, mapHeight } = {
        ...this,
      };

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, mapWidth, mapHeight);
    },

    onMouseDown({ clientX, clientY, which, button }) {
      if (!canvas.element) return;
      if (which !== 1 && button !== 0) return;

      calculateMousePosition(clientX, clientY);

      const node = GridNode.getNodeAt(mousePosition.x, mousePosition.y, grid);

      if (node && !node.isOccupied) {
        GridNode.placeAt(mousePosition.x, mousePosition.y, grid);
      } else {
        grid.connectionStartNode = node;
      }

      renderCanvas();
    },

    onMouseUp({ clientX, clientY }) {
      calculateMousePosition(clientX, clientY);
      let existingNode = GridNode.getNodeAt(mousePosition.x, mousePosition.y, grid);

      if (grid.connectionStartNode) {
        if (
          existingNode &&
          existingNode.isOccupied &&
          !existingNode.isNeighborsWith(grid.connectionStartNode) &&
          existingNode.gridIndex !== grid.connectionStartNode.gridIndex
        )
          grid.connectionStartNode.connectWithNode(existingNode);

        grid.connectionStartNode = null;
      }

      renderCanvas();
    },

    onMouseMove({ clientX, clientY }) {
      calculateMousePosition(clientX, clientY);

      if (!grid.connectionStartNode) return;

      renderCanvas();
    },

    onContextMenu(e) {
      e.preventDefault();
      const node = GridNode.getNodeAtCursorPosition();

      if (!node) return;

      node.removeNode();

      renderCanvas();
    },

    changeMode(mode) {
      this.mode = mode;
    },
  },
};

Vue.createApp(App).mount('#app');
