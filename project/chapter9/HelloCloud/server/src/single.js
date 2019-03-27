    function oncreated () {
        console.log("js create room");
        console.log("   name=" + this.name);
        console.log("   master=" + this.master);
        console.log("   fps=" + this.fps);
        console.log("   duration=" + this.duration);
        console.log("   usernum=" + this.usernum);
    };
    function onstart () {
        console.log("js Room '" + this.name + "' Start!!");
    };
    function onclose () {
        console.log("js Room '" + this.name + "' Closed!!");
    };
    function onuserin (userid, data) {
    };
    function onuserout (userid) {
        console.log("js Room '" + this.name + "' user logout, userid='" + userid + "'");
    };
    function onuserevent (userid, key, val) {
        console.log("js Room '" + this.name + "' recv user '" + userid + "' event, key='" + key + "' value='" + val + "'");
    };
    function onupdate(){}
    