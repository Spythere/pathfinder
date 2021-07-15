const App = {
  data() {
    return {
      mode: 0 /* 0 - placing nodes, 1 - adding connections */,
    };
  },

  mounted() {
    this.init();

    window.addEventListener('keydown', (e) => {
      if (e.code == 'Enter') {
        runPathFinder();
        renderCanvas();
      }
    });
  },

  methods: {
    init() {
      initCanvasObject(this.$refs['canvas']);

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

      calculateMousePosition(clientX, clientY);

      // LPM
      if (which === 1 && button === 0) {
        if (this.mode === 0) GridNode.placeAt(mousePosition.x, mousePosition.y, grid);

        if (this.mode === 1) {
          const node = GridNode.getNodeAt(mousePosition.x, mousePosition.y, grid);

          if (node.isOccupied) {
            grid.connectionStartNode = node;
          }
        }
      }

      renderCanvas();
    },

    onMouseUp({ clientX, clientY }) {
      calculateMousePosition(clientX, clientY);

      if (grid.connectionStartNode) {
        let existingNode = GridNode.getNodeAt(mousePosition.x, mousePosition.y, grid);

        if (existingNode.isOccupied && !existingNode.isNeighborsWith(grid.connectionStartNode))
          grid.connectionStartNode.connectWithNode(existingNode);

        grid.connectionStartNode = null;
      }

      renderCanvas();
    },

    onMouseMove({ clientX, clientY }) {
      if (!grid.connectionStartNode) return;

      calculateMousePosition(clientX, clientY);
      renderCanvas();
    },

    onContextMenu(e) {
      e.preventDefault();

      this.mode = this.mode == 1 ? 0 : 1;
    },

    changeMode(mode) {
      this.mode = mode;
    },
  },
};

Vue.createApp(App).mount('#app');
