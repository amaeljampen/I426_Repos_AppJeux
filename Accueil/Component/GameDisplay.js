App.component('game-display', {
    template:
    /*HTML*/
        `<div class="game">
            <div class="game_container">
                <h2 id="game_title">{{ games[selectedGame].name }}</h2>
                <a :href="games[selectedGame].lien">
                    <img :src="games[selectedGame].image" :alt="games[selectedGame].name" class="game_choose">
                </a>
            </div>
            <div class="button_container">
                <button class="button_select" @click="left_arrow_click">
                    <i class="glyphicon glyphicon-menu-left"></i>
                </button>
                <button class="button_select" @click="right_arrow_click">
                    <i class="glyphicon glyphicon-menu-right"></i>
                </button>
            </div>
        </div>`,
    data() {
        return {
            games: [
                {id: 1, name: "2048", image: "images/2048.png", lien: "accueilDetails2048.html"},
                {id: 2, name: "Flappy Bird", image: "images/FlappyBird.png", lien: "accueilDetailsFlappyBird.html"},
                {id: 3, name: "Snake", image: "images/Snake.png", lien: "accueilDetailsSnake.html"},
                {id: 4, name: "Woordle", image: "images/Woordle.png", lien: "accueilDetailsWordle.html"},
                {id: 5, name: "DinoWifi", image: "images/DinoWifi.png", lien: "accueilDetailsDino.html"},
            ],
            selectedGame: 0,
        }
    },
    methods: {
        left_arrow_click() {
            if (this.selectedGame > 0) {
                this.selectedGame--;
            } else {
                this.selectedGame = this.games.length - 1;
            }
        },
        right_arrow_click() {
            if (this.selectedGame < this.games.length - 1) {
                this.selectedGame++;
            } else {
                this.selectedGame = 0;
            }
        }
    }

})