export default class GameManager {
    constructor() {
        this.hitpoint = 3;
        this.hitBall = 0;
        this.gold = 0;
    }

    //静态方法
    static getInstance() {
        if (!this.instance) {
            this.instance = new GameManager();
        }
        return this.instance;
    }
}