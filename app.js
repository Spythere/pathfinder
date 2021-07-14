const App = {
  data() {
    return {
      canvas: null,
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
      const canvas = initCanvasObject(this.$refs['canvas']);
      this.canvas = canvas;

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
      if (!this.canvas) return;
      calculateMousePosition(clientX, clientY);

      // LPM
      if (which === 1 && button === 0) {
        if (this.mode === 0) ObjectNode.placeAtGrid(this.canvas.mousePos.x, this.canvas.mousePos.y, this.canvas);

        if (this.mode === 1) {
          canvas.connectionStartNode = ObjectNode.nodeAt(this.canvas.mousePos.x, this.canvas.mousePos.y);
        }
      }

      // let existingNode = null;
      // for (let obj of ObjectNode.list) {
      //   if (obj.isPointWithin(canvas.mousePos.x, canvas.mousePos.y, 10)) {
      //     existingNode = obj;
      //     break;
      //   }
      // }

      // if (!existingNode) {
      //   const node = new ObjectNode(canvas.mousePos.x, canvas.mousePos.y);

      //   for (let con of ObjectNode.connections) {
      //     if (node.isIntersectingWithLine({ x: con[0].x, y: con[0].y }, { x: con[1].x, y: con[1].y })) {
      //       console.log('NAJS');
      //     }
      //   }
      // } else {
      //   canvas.connectionStartNode = existingNode;
      // }

      renderCanvas();
    },

    onMouseUp({ clientX, clientY }) {
      calculateMousePosition(clientX, clientY);

      if (canvas.connectionStartNode) {
        let existingNode = null;
        for (let node of ObjectNode.list) {
          if (node.isPointWithin(canvas.mousePos.x, canvas.mousePos.y, 5) && node !== canvas.connectionStartNode) {
            existingNode = node;
            break;
          }
        }

        if (existingNode && !existingNode.isNeighborsWithNode(canvas.connectionStartNode))
          canvas.connectionStartNode.connectWithNode(existingNode);

        canvas.connectionStartNode = null;
      }

      renderCanvas();
    },

    onMouseMove({ clientX, clientY }) {
      if (!canvas.connectionStartNode) return;

      calculateMousePosition(clientX, clientY);
      renderCanvas();
    },

    onContextMenu(e) {
      e.preventDefault();

      this.mode = this.mode == 1 ? 0 : 1;
    },
  },
};

Vue.createApp(App).mount('#app');
