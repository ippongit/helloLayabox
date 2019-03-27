/** MainScene.js*/
export default class MainScene extends Laya.Scene {
    constructor() { super(); }
    onEnable() {
        //"LayaBox"字符串总宽度
        var w = 800;
        //文本创建的起始x位置(>>在此使用右移运算符，相当于/2 用>>效率更高)
        var offsetX = Laya.stage.width - w >> 1;
        //显示的字符串
        var demoString = "LayaBox";
        var letterText;
        for (var i = 0, len = demoString.length; i < len; ++i) {
            //从"LayaBox"字符串中逐个提出单个字符创建文本
            letterText = this.createLetter(demoString.charAt(i));
            letterText.x = w / len * i + offsetX;
            //文本的初始y属性
            letterText.y = 100;
            Laya.Tween.to(letterText,
                {
                    y: 300,
                    update: new Laya.Handler(this, this.updateColor, [letterText])
                },
                1000, Laya.Ease.bounceIn,
                Laya.Handler.create(this, this.changeColor, [letterText]), i * 100);
        }
    }

    /** 缓动进行时的回调更新方法
     * @param txt  Text组件*/
    updateColor(txt) {
        var c = Math.floor(Math.random() * 3);
        switch (c) {
            case 0: txt.color = "#eee000"; break;
            case 1: txt.color = "#ffffff"; break;
            case 2: txt.color = "#ff0000"; break;
            default: txt.color = "#eee000"; break;
        }
    }

    /** 缓动完成后的回调方法 
     * @param txt Text组件*/
    changeColor(txt) {
        //将文本字体改变成蓝绿色
        txt.color = "#00ffff";
    }

    /**创建单个字符文本，并加载到场景*/
    createLetter(char) {
        var letter = new Laya.Text();
        letter.text = char;
        letter.color = "#ffffff";
        letter.font = "Impact";
        letter.fontSize = 180;
        this.addChild(letter);
        return letter;
    }
}