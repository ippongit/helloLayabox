/**MainScript */

import ActorScript from "./ActorScript";
import GameManager from "./GameManager";

export default class MainSceneScript extends Laya.Script {
    constructor() { super(); }
    onEnable() {
        var ground = this.owner.getChildByName('ground');
        this.actor1 = ground.getChildByName('actor1');
        this.actorScript1 = this.actor1.getComponent(ActorScript);
        this.actor2 = ground.getChildByName('actor2');
        this.actorScript2 = this.actor2.getComponent(ActorScript);

        //判断是否是房主
        this.isMaster = GameManager.getInstance().isMaster;

        Laya.stage.event(Laya.Event.MESSAGE, { type: 'getSceneScript', target: this });

        Laya.stage.on(Laya.Event.KEY_DOWN, this, function (e) {
            switch (e.keyCode) {
                case laya.events.Keyboard.A: {
                    if (this.isMaster === true) {
                        this.actorScript1.moveLeft();
                    }
                    else {
                        this.actorScript2.moveLeft();
                    }
                    this.syncoptReady('KEY_DOWN_A');
                } break;
                case laya.events.Keyboard.S: {
                    if (this.isMaster === true) {
                        this.actorScript1.down();
                    }
                    else {
                        this.actorScript2.down();
                    }
                    this.syncoptReady('KEY_DOWN_S');
                } break;
                case laya.events.Keyboard.D: {
                    if (this.isMaster === true) {
                        this.actorScript1.moveRight();
                    }
                    else {
                        this.actorScript2.moveRight();
                    }
                    this.syncoptReady('KEY_DOWN_D');
                } break;
                case laya.events.Keyboard.W: {
                    if (this.isMaster === true) {
                        this.actorScript1.up();
                    }
                    else {
                        this.actorScript2.up();
                    }
                    this.syncoptReady('KEY_DOWN_W');
                } break;
                case laya.events.Keyboard.SPACE: {
                    if (this.isMaster === true) {
                        this.actorScript1.shot();
                    }
                    else {
                        this.actorScript2.shot();
                    }
                    this.syncoptReady('KEY_DOWN_SPACE');
                } break;
            }
        });
        Laya.stage.on(Laya.Event.KEY_UP, this, function (e) {
            switch (e.keyCode) {
                case laya.events.Keyboard.A: {
                    if (this.isMaster === true) {
                        this.actorScript1.stand();
                    }
                    else {
                        this.actorScript2.stand();
                    }
                    this.syncoptReady('KEY_UP_A');
                } break;
                case laya.events.Keyboard.D: {
                    if (this.isMaster === true) {
                        this.actorScript1.stand();
                    }
                    else {
                        this.actorScript2.stand();
                    }
                    this.syncoptReady('KEY_UP_D');
                } break;
            }
        });
    }

    //发送帧同步数据
    syncoptReady(option) {
        var info = {};
        info.item = "actor1";
        info.option = option;//键盘操作

        if (this.isMaster === false) {
            info.item = "actor2";
            info.x = this.actor2.x;
            info.y = this.actor2.y;
        }
        else {
            info.x = this.actor1.x;
            info.y = this.actor1.y;
        }

        var infoString = JSON.stringify(info);
        Laya.stage.event(Laya.Event.MESSAGE, { type: 'syncopt', info: infoString });
    }

    //帧同步控制
    onFrameUpdate(info) {
        // console.log('Hello world! ');
        if (info.item === "actor1") {
            this.actor1.x = parseFloat(info.x);
            this.actor1.y = parseFloat(info.y);
            switch (info.option) {
                case 'KEY_DOWN_A': {
                    this.actorScript1.moveLeft();
                } break;
                case 'KEY_DOWN_S': {
                    this.actorScript1.down();
                } break;
                case 'KEY_DOWN_D': {
                    this.actorScript1.moveRight();
                } break;
                case 'KEY_DOWN_W': {
                    this.actorScript1.up();
                } break;
                case 'KEY_DOWN_SPACE': {
                    this.actorScript1.shot();
                } break;
                case 'KEY_UP_A': {
                    this.actorScript1.stand();
                } break;
                case 'KEY_UP_D': {
                    this.actorScript1.stand();
                } break;
            }
        }

        if (info.item === "actor2") {
            this.actor2.x = parseFloat(info.x);
            this.actor2.y = parseFloat(info.y);
            switch (info.option) {
                case 'KEY_DOWN_A': {
                    this.actorScript2.moveLeft();
                } break;
                case 'KEY_DOWN_S': {
                    this.actorScript2.down();
                } break;
                case 'KEY_DOWN_D': {
                    this.actorScript2.moveRight();
                } break;
                case 'KEY_DOWN_W': {
                    this.actorScript2.up();
                } break;
                case 'KEY_DOWN_SPACE': {
                    this.actorScript2.shot();
                } break;
                case 'KEY_UP_A': {
                    this.actorScript2.stand();
                } break;
                case 'KEY_UP_D': {
                    this.actorScript2.stand();
                } break;
            }
        }        
    }
}