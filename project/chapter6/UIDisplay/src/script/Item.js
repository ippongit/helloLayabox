/**Item */
export default class Item extends Laya.Box {
    constructor() { super(); }
    onEnable() {
        var btn_praise = this.getChildByName("btn_praise");
        var praise = this.getChildByName("praise");
        btn_praise.on(Laya.Event.CLICK, this, function (e) {
            e.stopPropagation();//阻止冒泡
            this.dataSource.praise++;
            praise.text = this.dataSource.praise;
        })
    }
}