export default class Animotor extends Laya.Script {
    constructor() { super(); }
    onEnable() {
        //         var img = new Laya.Image();
        // //     //设置皮肤（取图集中小图的方式就是 原小图目录名/原小图资源名.png）
        //         img.skin = "x13/image 29.png";
        //         this.owner.addChild(img);


        this.roleAni = new Laya.Animation();
        this.roleAni.interval = 300;//序列帧间隔时间,单位毫秒
        var url = "res/atlas/x13.atlas";

        //加载-->创建动画模板-->播放
        this.roleAni.loadAtlas(url, Laya.Handler.create(this, function () {
            this.owner.addChild(this.roleAni);

            // 播放整个动画
            // this.roleAni.play();

            //创建动画模板
            Laya.Animation.createFrames(this.aniUrls("walk", 4), "walk");
            Laya.Animation.createFrames(this.aniUrls("die", 6), "die");
            Laya.Animation.createFrames(this.aniUrls("stand", 4), "stand");
            Laya.Animation.createFrames(this.aniUrls("shot", 2), "shot");

            //循环播放动画
            // this.roleAni.play(0, true, "walk");
            // this.roleAni.play(0, false, "die");
            // this.roleAni.on(Laya.Event.COMPLETE,this,function () {
            //     console.log('>>>>>>>>>>>>>>>sleep>>>>>>>>>>>>>>>>>');
            // });

            // var self= this;

            this.roleAni.play(0, false, "shot");
            this.roleAni.on(Laya.Event.COMPLETE,this,function () {
                this.roleAni.play(0, true, "walk");
            });

        }));
        // function onLoaded() {
        //     this.owner.addChild(roleAni);

        //     // 播放整个动画
        //     // this.roleAni.play();

        //     //创建动画模板dizziness
        //     Laya.Animation.createFrames(aniUrls("image ", 9), "walk");

        //     //循环播放动画
        //     this.roleAni.play(0, true, "walk");
        // }


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