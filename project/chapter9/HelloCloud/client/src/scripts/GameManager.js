/**GameManager */
export default class GameManager {
    constructor() {}

    //静态方法
    static getInstance() {
        if (!this.instance) {
            this.instance = new GameManager();
        }
        return this.instance;
    }
}