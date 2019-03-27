/**CheckPoint */
export default class CheckPoint extends Laya.Scene {
    constructor() { super(); }
    onEnable() {
        var vertexs = [];
        var checkedPoint = null;
        Laya.stage.on(Laya.Event.CLICK, this, function (e) {
            var point = new laya.maths.Point(e.stageX, e.stageY);
            if (vertexs.length < 5) {
                if (vertexs.length > 0) {
                    var lastPoint = vertexs[vertexs.length - 1];
                    this.graphics.drawLine(lastPoint.x, lastPoint.y, point.x, point.y, "#ffffff", 3);
                }
                vertexs.push(point);
                if (vertexs.length === 5) {
                    var startPoint = vertexs[0];
                    this.graphics.drawLine(startPoint.x, startPoint.y, point.x, point.y, "#ffffff", 3);
                }
            }
            else {
                var checkResut = this.checkIn(point, vertexs);
                this.graphics.drawCircle(point.x,point.y,null,3,'#ffffff',3);
                if (checkResut === true)
                    console.log("鼠标最后点击的点 (", point.x, ',', point.y, ') 在多边形内');
                else
                    console.log("鼠标最后点击的点 (", point.x, ',', point.y, ') 不在多边形内');
            }
        });
    }

    /** 判断点在多边形内*/
    checkIn(point, vertexs) {
        var x = point.x, y = point.y;
        var inside = false;
        for (var i = 0, j = vertexs.length - 1; i < vertexs.length; j = i++) {
            var xi = vertexs[i].x, yi = vertexs[i].y;
            var xj = vertexs[j].x, yj = vertexs[j].y;
            var intersect = ((yi > y) != (yj > y))
                && (x < ((xj - xi) * (y - yi) / (yj - yi) + xi));
            if (intersect) inside = !inside;
        }
        return inside;
    };
}