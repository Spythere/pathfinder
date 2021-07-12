const App = {
    data() {
        return {
            ctx: null,
            mapWidth: 0,
            mapHeight: 0
        }
    },

    setup() {
        // const canvasRef = Vue.ref(null);

        // const ctx = Vue.computed(() => {
        //     if (!canvasRef) return null;

        //     const canvas = canvasRef.value;
        //     return canvas.getContext('2d');
        // })

        // return {
        //     canvasRef,
        //     ctx
        // }
    },

    mounted() {
        this.init();
    },

    methods: {
        init() {
            const canvasEl = this.$refs['canvas'];
            this.ctx = canvasEl.getContext('2d');

            this.mapWidth = canvasEl.width;
            this.mapHeight = canvasEl.height;

            this.render();
        },

        render() {
            const {
                ctx,
                mapWidth,
                mapHeight
            } = {
                ...this
            };

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, mapWidth, mapHeight);
        }
    }
}

Vue.createApp(App).mount('#app')