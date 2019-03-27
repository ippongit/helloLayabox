import GameManager from "./GameManager";
export default class MainScene extends Laya.Scene {
    constructor() { super(); }

    onEnable() {
        //初始化界面显示
        this.onBallUpdate();
        //接收气球破裂出发的事件
        Laya.stage.on(Laya.Event.MESSAGE, this, function (data) {
            if(data === 'ballbreak')this.onBallUpdate();
        });
    }

    onBallUpdate() {
        this.txt_hp.text = 'x' + GameManager.getInstance().hitpoint;
        this.txt_ball.text = 'x' + GameManager.getInstance().hitBall;
        this.txt_gold.text = 'x' + GameManager.getInstance().gold;

        if (GameManager.getInstance().hitpoint === 0) {
            GameManager.getInstance().hitpoint = 3;
            setLocalStorage();
            Laya.Scene.open('startScene.scene');           
        }
    }
}

/**存储永久数据*/
function setLocalStorage() {
    //存储单个数据
    Laya.LocalStorage.setItem('gold', GameManager.getInstance().gold);
    //存储JSON对象
    var sorceInfo = {};
    sorceInfo.gold =  GameManager.getInstance().gold;
    sorceInfo.hightScore = GameManager.getInstance().hitBall;
    Laya.LocalStorage.setJSON('sorceInfo',sorceInfo);
}