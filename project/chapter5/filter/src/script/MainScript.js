//MainScript.js
export default class MainScript extends Laya.Script {
    constructor() { super(); }
    onEnable() {
        Laya.stage.bgColor = '#99b4d1';
        var car1 = this.owner.getChildByName('car1');
        var car2 = this.owner.getChildByName('car2');
        var car3 = this.owner.getChildByName('car3');
        var car4 = this.owner.getChildByName('car4');
        var car5 = this.owner.getChildByName('car5');
        var car6 = this.owner.getChildByName('car6');
        var car7 = this.owner.getChildByName('car7');
        var car8 = this.owner.getChildByName('car8');
        var car9 = this.owner.getChildByName('car9');
        var car10 = this.owner.getChildByName('car10');
        var car11 = this.owner.getChildByName('car11');
        var car12 = this.owner.getChildByName('car12');
        //修改亮度
        car1.filters = [getBrightFilter(-100)];
        car2.filters = [getBrightFilter(100)];
        //反色显示
        car3.filters = [getInverseFilter()];
        //填充颜色
        car4.filters = [getColorFilter("#DE6552")];//红色
        car5.filters = [getColorFilter("#5d8843")];//绿色
        car6.filters = [getColorFilter("#99b4d1")];//蓝色
        //设置阴影滤镜
        var shadeFilter = new Laya.GlowFilter("#000000", 8, 8, 8);
        car7.filters = [shadeFilter];
        //创建一个发光滤镜
        var glowFilter = new Laya.GlowFilter("#ffff00", 10, 0, 0);
        car8.filters = [glowFilter];
        //创建一个模糊滤镜
        var blurFilter = new Laya.BlurFilter(5);
        car9.filters = [blurFilter];
        //提高亮度、反色、填充颜色
        car10.filters = [getBrightFilter(100), getInverseFilter(), getColorFilter("#DE6552")];
        //填充颜色、叠加发光和阴影
        car11.filters = [getColorFilter("#efabcd"), shadeFilter, glowFilter];
    }
}

/**获取亮度滤镜 */
function getBrightFilter(offset) {
    var colorMatrix =
        [
            1, 0, 0, 0, offset,
            0, 1, 0, 0, offset,
            0, 0, 1, 0, offset,
            0, 0, 0, 1, offset,
        ];
    //创建颜色滤镜
    var colorFilter = new Laya.ColorFilter(colorMatrix);
    return colorFilter;
}

/**获取反色滤镜 */
function getInverseFilter() {
    var colorMatrix =
        [
            -1, 0, 0, 0, 255,
            0, -1, 0, 0, 255,
            0, 0, -1, 0, 255,
            0, 0, 0, 1, 0,
        ];
    //创建颜色滤镜
    var colorFilter = new Laya.ColorFilter(colorMatrix);
    return colorFilter;
}

/**获取颜色填充 */
function getColorFilter(rgbCode) {
    var r, g, b = 1;
    var rgbString = rgbCode;
    try {
        r = parseInt(rgbString.substr(1, 2), 16) / 255;
        g = parseInt(rgbString.substr(3, 2), 16) / 255;
        b = parseInt(rgbString.substr(5, 2), 16) / 255;
    } catch (e) { r, g, b = 1; };

    var colorMatrix =
        [
            r, 0, 0, 0, 0, //R
            0, g, 0, 0, 0, //G
            0, 0, b, 0, 0, //B
            0, 0, 0, 1, 0, //A
        ];
    //创建颜色滤镜
    var colorFilter = new Laya.ColorFilter(colorMatrix);
    return colorFilter;
}