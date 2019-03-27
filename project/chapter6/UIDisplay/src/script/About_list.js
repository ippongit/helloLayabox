/** script/About_list.js */
export default class About_list extends Laya.Scene {
    constructor() { super(); }
    onEnable() {
        this.dataArray = [
            {
                nickName: '定海神猪',
                headImage: 'img/headImage/head1.jpg', praise: 1
            },
            {
                nickName: 'SS',
                headImage: 'img/headImage/head2.jpg', praise: 1
            },
            {
                nickName: '蓝色眼泪',
                headImage: 'img/headImage/head3.jpg', praise: 1
            },
            {
                nickName: '睡教教主',
                headImage: 'img/headImage/head4.jpg', praise: 1
            },
            {
                nickName: '背包装棋子',
                headImage: 'img/headImage/head5.jpg', praise: 1
            },
            {
                nickName: 'alison-fan',
                headImage: 'img/headImage/head6.jpg', praise: 1
            },
            {
                nickName: '善良的大黑',
                headImage: 'img/headImage/head7.jpg', praise: 1
            },
        ];

        this.list.array = this.dataArray;
    }
}
