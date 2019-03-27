import BowScript from "./BowScript";
import BallScript from "./BallScript";
import GameManager from "./GameManager";

export default class MainScenceControl extends Laya.Script {
    constructor() { super(); }

    onEnable() {
        this.mybow = this.owner.getChildByName('mybow');
        this.ground = this.owner.getChildByName('ground');

        //确认球预制体加载完毕的标识
        this.ballPrefabReady = false;
        Laya.loader.load("prefab/ball.prefab", Laya.Handler.create(this, function (prefab) {
            this.ballPrefabReady = true;
            this.ballPrefab = prefab;
        }));

        //延时统计
        this.deltaCount = 1000;
    }

    /**添加球 */
    creatBall() {
        if (this.ballPrefabReady == false) return;
        //使用对象池创建球
        var ball = Laya.Pool.getItemByCreateFun("ball", this.ballPrefab.create, this.ballPrefab);
        var radomX = parseInt(Math.random() * 60) + 1;//获取随机数[1~60]
        var radomY = parseInt(Math.random() * 5);
        ball.pos(radomX * 11, 200 + radomY * 64);
        this.ground.addChild(ball);
    }

    onUpdate() {
        this.deltaCount -= Laya.timer.delta;
        if (this.deltaCount <= 0) {
            this.deltaCount = 1000;
            this.creatBall();
        }

        this.collide();
    }

    /**碰撞检测*/
    collide() {
        for (var i = 0; i < this.ground.numChildren; i++) {
            if (this.ground.getChildAt(i).name === 'arrow') {
                var arrow = this.ground.getChildAt(i);
                var point = new laya.maths.Point(arrow.x, arrow.y);
                for (var j = 0; j < this.ground.numChildren; j++) {
                    if (i === j) continue;//忽略与本身的碰撞
                    var target = this.ground.getChildAt(j);
                    if (target.name === 'arrow') continue;
                    if (target.boom === true) continue;
                    var distance = point.distance(target.x, target.y);
                    if (distance <= 35) {
                        if (target.name === 'ball') {
                            var ballScript = target.getComponent(BallScript);
                            if (ballScript && ballScript.boom === false) {
                                ballScript.boom = true;
                                GameManager.getInstance().hitBall += 1;
                                GameManager.getInstance().gold += 10;
                            }
                        }
                        break;
                    }
                }
            }
            else continue;
        }
    }

    onStageClick(e) {
        //停止事件冒泡，提高性能，当然也可以不要
        e.stopPropagation();

        console.log('this.owner ', this.owner, '\n');
        var bowScript = this.mybow.getComponent(BowScript);
        bowScript.fire();

    }
}