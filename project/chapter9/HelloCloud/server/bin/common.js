function oncreated() {
    console.log("common房间 js create room");
    console.log("   name=" + this.name);
    console.log("   master=" + this.master);
    console.log("   fps=" + this.fps);
    console.log("   duration=" + this.duration);
    console.log("   usernum=" + this.usernum);
};
function onstart() {
    console.log("js  对战  Room '" + this.name + "' Start!!");
};
function onclose() {
    console.log("js  对战  Room '" + this.name + "' Closed!!");
};
function onuserin(userid, data) {
    if (this.usernum === 2) {
        console.log('进入人数ok！----------------------', JSON.stringify(data));
        // 获取所有的进入房间的用户id
        var userIds = this.getusersid();
        var cmd = {
            cmd: 'start',
            players: [],
            randomSeed: Date.now().toString() + parseInt(Math.random() * 100)
        };
        // 将房间所有用户的用户id以及昵称保存到数组中，并发送给客户端
        for (var i = 0; i < userIds.length; i++) {
            cmd.players.push({
                userId: userIds[i],
                nickname: this.getuserdata(userIds[i]).nickname
            })
        }

        this.broadcast(JSON.stringify(cmd));
    }
};
function onuserout(userid) {
    console.log("js 对战 Room '" + this.name + "' user logout, userid='" + userid + "'");
};
function onuserevent(userid, key, val) {
    console.log("js 对战 Room '" + this.name + "' recv user '" + userid + "' event, key='" + key + "' value='" + val + "'");
};
function onupdate() { }