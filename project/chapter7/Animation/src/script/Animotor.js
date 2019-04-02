/**Animotor */
export default class Animotor extends Laya.Script {
    constructor() { super(); }
    onEnable() {
        this.roleAni = new Laya.Animation();
        this.roleAni.interval = 500;//序列帧间隔时间,单位毫秒
        this.owner.addChild(this.roleAni);

        // 创建动画模板
        Laya.Animation.createFrames(this.aniUrls("walk", 4), "walk");
        Laya.Animation.createFrames(this.aniUrls("die", 6), "die");
        Laya.Animation.createFrames(this.aniUrls("stand", 4), "stand");
        Laya.Animation.createFrames(this.aniUrls("shot", 2), "shot");

        this.roleAni.play(0, false, "shot");
        this.roleAni.on(Laya.Event.COMPLETE, this, function () {
            this.roleAni.play(0, true, "walk");
        });
    }

    /**
     * 创建一组动画的url数组（美术资源地址数组）
     * aniName  动作的名称，用于生成url
     * length   动画最后一帧的索引值，
     */
    aniUrls(aniName, length) {
        var urls = [];
        for (var i = 0; i < length; i++) {
            //动画资源路径要和动画图集打包前的资源命名对应起来
            urls.push("x13/" + aniName + i + ".png");
        }
        return urls;
    }
}