import GameManager from "./GameManager";

export default class StartScene extends Laya.Scene {
    constructor() { super(); }

    onEnable() {
        getLocalStorage();

        GameManager.getInstance().hitpoint = 3;
        GameManager.getInstance().hitBall = 0;

        this.txt_hp.text = 'x' + GameManager.getInstance().hitpoint;
        this.txt_ball.text = 'x' + GameManager.getInstance().hitBall;
        this.txt_gold.text = 'x' + GameManager.getInstance().gold;

        var BTN_start_1 = this.getChildByName('BTN_start_1');
        BTN_start_1.on(Laya.Event.CLICK, this, function (e) {
            e.stopPropagation();//阻止冒泡         
            Laya.Scene.open('mainScene.scene');
        })
    }
}

/**获取本地存储 */
function getLocalStorage() {
    //清除本地存储
    // Laya.LocalStorage.clear();
    var gold = Laya.LocalStorage.getItem('gold');
    if (gold) GameManager.getInstance().gold = parseInt(gold);
    else Laya.LocalStorage.setItem('gold', 0);
}

