/**CheckRaycast */
export default class CheckRaycast extends Laya.Scene {
    constructor() { super(); }
    onEnable() {
        var conut = 0;
        var vertexs = [];
        var checkedPoint = null;
        Laya.stage.on(Laya.Event.CLICK, this, function (e) {
            var point = new laya.maths.Point(e.stageX, e.stageY);
            if (vertexs.length < 5) {
                if (vertexs.length > 0) {
                    var lastPoint = vertexs[vertexs.length - 1];
                    Laya.stage.graphics.drawLine(lastPoint.x, lastPoint.y, point.x, point.y, "#ffffff", 3);
                }
                vertexs.push(point);
                if (vertexs.length === 5) {
                    var startPoint = vertexs[0];
                    Laya.stage.graphics.drawLine(startPoint.x, startPoint.y, point.x, point.y, "#ffffff", 3);
                }
            }
            else {
                //定义原点(0,0)
                var origin = new laya.maths.Point(0, 0);
                var checkResut = this.checkCross(origin, point, vertexs);
                //如果射线穿过多边形，是绿色
                var color = "#00ff00";
                //如果射线未穿过多边形，是黄色
                if (checkResut === false) color = "#ffff00";
                this.graphics.clear();
                var endX = 1500;
                var endY = point.y * endX / point.x;
                this.graphics.drawLine(origin.x, origin.y, endX, endY, color, 3);
            }
        });
    }

    /**检测直线穿过一个多边形 */
    checkCross(startPoint, stopPoint, vertexs) {
        var x_startPoint = startPoint.x;
        var y_startPoint = startPoint.y;
        var x_stopPoint = stopPoint.x;
        var y_stopPoint = stopPoint.y;

        var up = 0;
        var down = 0;
        var crossed = false;

        var k = (y_stopPoint - y_startPoint) / (x_stopPoint - x_startPoint);
        for (var i = 0; i < vertexs.length; i++) {
            var xi = vertexs[i].x, yi = vertexs[i].y;
            var y_cut = k * (xi - x_startPoint) + y_startPoint;
            //多边形与直线相切或穿过
            if (y_cut == yi) {
                crossed = true;
                return crossed;
            }
            else {
                if (yi > y_cut) up++;
                else down++;
            }
        }
        if (up > 0 && down > 0) {
            crossed = true;
        }
        return crossed;
    }
}