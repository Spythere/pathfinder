const App = {
  data() {
    return {
      canvas: null,
    };
  },

  mounted() {
    this.init();
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

    onMouseDown({ clientX, clientY }) {
      if (!this.canvas) return;

      calculateMousePosition(clientX, clientY);

      let existingNode = null;
      for (let obj of ObjectNode.list) {
        if (obj.isPointWithin(canvas.mousePos.x, canvas.mousePos.y, 10)) {
          existingNode = obj;
          break;
        }
      }

      if (!existingNode) {
        const node = new ObjectNode(canvas.mousePos.x, canvas.mousePos.y);

        for (let con of ObjectNode.connections) {
          if (node.isIntersectingWithLine({ x: con[0].x, y: con[0].y }, { x: con[1].x, y: con[1].y })) {
            console.log('NAJS');
          }
        }
      } else {
        canvas.connectionStartNode = existingNode;
      }

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
  },
};

Vue.createApp(App).mount('#app');
