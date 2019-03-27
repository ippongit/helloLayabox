
/** script/About_text.js */
export default class About_text extends Laya.Scene {
    constructor() { super(); }
    onEnable() {
        var string = "\n鹅、鹅、鹅\n曲项向天歌\n白毛浮绿水\n红掌拨清波";
        var string2 = "\n鹅\n鹅\n鹅\n曲项\n向天歌\n白毛\n浮绿水\n红掌\n拨清波";
        this.Label_1.text += string;
        this.Text_1.text += string;
        this.TextInput_1.text += string;
        this.TextArea_1.text += string2;
        // this.TextArea_1.editable = false;
    }
}