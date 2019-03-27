var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

var GameConfig = function () {
    function GameConfig() {
        _classCallCheck(this, GameConfig);
    }

    _createClass(GameConfig, null, [{
        key: "init",
        value: function init() {
            //注册Script或者Runtime引用
            var reg = Laya.ClassUtils.regClass;
        }
    }]);

    return GameConfig;
}();

exports.default = GameConfig;

GameConfig.width = 720;
GameConfig.height = 1280;
GameConfig.scaleMode = "showall";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "center";
GameConfig.startScene = "";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();

},{}],2:[function(require,module,exports){
"use strict";

var _GameConfig = require("./GameConfig");

var _GameConfig2 = _interopRequireDefault(_GameConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Main = function Main() {
	_classCallCheck(this, Main);

	//根据IDE设置初始化引擎		
	if (window["Laya3D"]) Laya3D.init(_GameConfig2.default.width, _GameConfig2.default.height);else Laya.init(_GameConfig2.default.width, _GameConfig2.default.height, Laya["WebGL"]);
	Laya["Physics"] && Laya["Physics"].enable();
	Laya["DebugPanel"] && Laya["DebugPanel"].enable();
	Laya.stage.scaleMode = _GameConfig2.default.scaleMode;
	Laya.stage.screenMode = _GameConfig2.default.screenMode;
	Laya.stage.alignV = _GameConfig2.default.alignV;
	Laya.stage.alignH = _GameConfig2.default.alignH;
	//兼容微信不支持加载scene后缀场景
	Laya.URL.exportSceneToJson = _GameConfig2.default.exportSceneToJson;

	//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
	if (_GameConfig2.default.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
	if (_GameConfig2.default.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
	if (_GameConfig2.default.stat) Laya.Stat.show();
	Laya.alertGlobalError = true;

	// init();
	//init2();
	init3();
};
//激活启动类


var main = new Main();

/**功能初始化 */
function init() {
	//设置stage的背景颜色
	Laya.stage.bgColor = '#aabbcc';
	//显示Laya.stage坐标
	console.log('Laya.stage.x = ', Laya.stage.x);
	console.log('Laya.stage.y = ', Laya.stage.y);

	//添加Sprite
	var sp = new Laya.Sprite();
	//打印Laya.stage的子节点数量
	console.log('Laya.stage的子节点数量：', Laya.stage.numChildren);
	Laya.stage.addChild(sp);
	console.log('Laya.stage的子节点数量：', Laya.stage.numChildren);

	//在Laya.stage中绘制水平线
	Laya.stage.graphics.drawLine(100, 200, 300, 200, '#ff0000', 1);
	//在Laya.stage中绘制垂线
	Laya.stage.graphics.drawLine(200, 100, 200, 300, '#ff0000', 1);

	//将sp移动到横坐标400，纵坐标300的位置
	sp.pos(400, 300);
	//绘制两条在sp的原点交叉的直线
	sp.graphics.drawLine(-50, 0, 50, 0, '#00ff00', 1);
	sp.graphics.drawLine(0, -50, 0, 50, '#00ff00', 1);
	//绘制以sp的原点为中心，半径40的圆
	sp.graphics.drawCircle(0, 0, 40, null, '#00ff00', 2);
	// 在Laya.stage中绘制圆
	Laya.stage.graphics.drawCircle(400, 300, 80, null, '#ff0000', 2);

	// 在sp中添加sp1
	var sp1 = new Laya.Sprite();
	sp.addChild(sp1);
	//设置sp1的坐标，作用和sp1.pos(x,y)相同
	sp1.x = 50;
	sp1.y = 150;
	//绘制sp1的原点位置
	sp1.graphics.drawLine(-50, 0, 50, 0, '#0000ff', 1);
	sp1.graphics.drawLine(0, -50, 0, 50, '#0000ff', 1);
	//在控制台打印sp1相对Laya.stage的坐标
	var sp1GlpbalPoint = sp.localToGlobal(new laya.maths.Point(sp1.x, sp1.y));
	console.log('sp1相对stage的坐标是： ', sp1GlpbalPoint.x, sp1GlpbalPoint.y);

	//将sp旋转30度
	sp.rotation = 30;
	//在控制台打印sp1相对Laya.stage的坐标
	var sp1GlpbalPoint = sp.localToGlobal(new laya.maths.Point(sp1.x, sp1.y));
	console.log('sp1相对stage的坐标是： ', sp1GlpbalPoint.x, sp1GlpbalPoint.y);
}

function init2() {
	//设置stage的背景颜色
	Laya.stage.bgColor = '#aabbcc';

	//创建一个Sprite来作为弓的根节点
	var sp_bow = new Laya.Sprite();
	Laya.stage.addChild(sp_bow);
	//将弓移动到屏幕中央
	sp_bow.pos(360, 1200);
	//绘制弓的中心点
	sp_bow.graphics.drawLine(-100, 0, 100, 0, "#00ff00", 1);
	sp_bow.graphics.drawLine(0, -100, 0, 100, "#00ff00", 1);

	//创建一个Sprite来加载图片资源 bow.png 作为弓显示
	var sp_bow_img = new Laya.Sprite();
	sp_bow.addChild(sp_bow_img);
	//绘制图片的坐标原点
	sp_bow_img.graphics.drawLine(-100, 0, 100, 0, "#00ffff", 1);
	sp_bow_img.graphics.drawLine(0, -100, 0, 100, "#00ffff", 1);
	//偏移弓的图像显示到正确位置
	sp_bow_img.pos(30, -160);

	//加载弓的图片资源
	sp_bow_img.loadImage("res/img/bow.png" //,
	// Laya.Handler.create(this, function () { console.log('图片加载完毕！') }	)
	);
	//把弓逆时针旋转90°，对准正上方
	sp_bow.rotation = -90;

	//加载图集
	Laya.loader.load("res/atlas/img.atlas", Laya.Handler.create(this, onAssetLoaded), null, laya.net.Loader.ATLAS);

	/**加载图集后的处理 */
	function onAssetLoaded() {
		//创建承载箭的Laya.Sprite
		var sp_arrow = new Laya.Sprite();
		//使用图集中的箭的图像数据建立一个Laya.Image对象
		var img_arrow = new Laya.Image('img/arrow.png');
		//将img_arrow添加到sp_arrow
		sp_arrow.addChild(img_arrow);
		//图像的原点是左上角，为了让箭头在sp_arrow的原点位置，偏移图像坐标
		img_arrow.pos(-152, -8);
		//绘制辅助线标注箭的原点
		sp_arrow.graphics.drawLine(-50, 0, 50, 0, "#ff0000", 1);
		sp_arrow.graphics.drawLine(0, -50, 0, 50, "#ff0000", 1);
		//在Laya.stage中添加箭，并把它设置成和弓对应的位置
		Laya.stage.addChild(sp_arrow);
		sp_arrow.pos(360, 1040);
		//箭头向上
		sp_arrow.rotation = -90;
	}
}

function init3() {
	//设置stage的背景颜色
	Laya.stage.bgColor = '#aabbcc';
	//加载多个图集
	loadAtlas(["res/atlas/img.atlas", "res/atlas/comp.atlas"]);
	//添加文字
	createTitle();
	//从Laya.stage中查找到文字标题
	var title = Laya.stage.getChildByName("title");
	title.text += " 12345678";
	//基于帧率重复执行
	Laya.timer.frameLoop(1, this, onFrame);
}

function onFrame() {
	// console.log('Laya.timer.delta : ', Laya.timer.delta);
	var speed = 1.5;
	for (var i = 0; i < Laya.stage.numChildren; i++) {
		var obj = Laya.stage.getChildAt(i);
		if (obj.name != 'arrow') continue;
		obj.y -= speed * Laya.timer.delta;
		if (obj.y < 250) obj.destroy();
	}
}

function loadAtlas(atlasPath) {
	Laya.loader.load(atlasPath, Laya.Handler.create(this, onAssetLoaded), null, laya.net.Loader.ATLAS);
}

function createArrow() {
	//创建承载箭的Laya.Sprite
	var sp_arrow = new Laya.Sprite();
	//使用图集中的箭的图像数据建立一个Laya.Image对象
	var img_arrow = new Laya.Image('img/arrow.png');
	//将img_arrow添加到sp_arrow
	sp_arrow.addChild(img_arrow);
	//图像的原点是左上角，为了让箭头在sp_arrow的原点位置，偏移图像坐标
	img_arrow.pos(-152, -8);
	//绘制辅助线标注箭的原点
	// sp_arrow.graphics.drawLine(-50, 0, 50, 0, "#ff0000", 1);
	// sp_arrow.graphics.drawLine(0, -50, 0, 50, "#ff0000", 1);
	//在Laya.stage中添加箭，并把它设置成和弓对应的位置
	Laya.stage.addChild(sp_arrow);
	sp_arrow.pos(360, 1040);
	//箭头向上
	sp_arrow.rotation = -90;
	sp_arrow.name = 'arrow';
}

function createBow() {
	//创建一个Sprite来加载图片资源 bow.png 作为弓显示
	var sp_bow = new Laya.Sprite();
	Laya.stage.addChild(sp_bow);
	//将弓移动到屏幕中央
	sp_bow.pos(360, 1200);
	//绘制弓的中心点
	// sp_bow.graphics.drawLine(-100, 0, 100, 0, "#00ff00", 1);
	// sp_bow.graphics.drawLine(0, -100, 0, 100, "#00ff00", 1);
	//使用图集创建弓的图像并显示
	var img_bow = new Laya.Image('img/bow.png');
	// img_bow.skin = 'comp/clip_num.png';
	sp_bow.addChild(img_bow);
	img_bow.pos(30, -160);
	//把弓逆时针旋转90°，对准正上方
	sp_bow.rotation = -90;
}

//添加一个全局的计数器
var count = 0;

function onAssetLoaded() {
	createBow();
	// createArrow();

	//引用文字对象
	var title = Laya.stage.getChildByName("title");
	title.text = '点击屏幕射箭';
	//添加计数器，并初始化为 '0'
	count = 0;
	Laya.stage.on(Laya.Event.MOUSE_DOWN, this, function () {
		//鼠标按下后计数器自动加一
		count++;
		//在文本标题中输出计数器变化
		title.text = '已射出 ' + count + ' 支箭';
		createArrow();
	});
}

function createTitle() {
	//创建一个文本实例
	var title = new Laya.Text();
	//设置颜色
	title.color = "#FFFFFF";
	//设置字体
	title.font = "Impact";
	//设置字体大小
	title.fontSize = 40;
	//设置位置
	title.pos(80, 100);
	//在Laya.stage中添加文本
	Laya.stage.addChild(title);
	//设置文本内容
	title.text = "Hello World";
	//设定title的名字，用于后续的操作
	title.name = "title";
}

},{"./GameConfig":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0xheWFBaXJJREVfYmV0YTQvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0dhbWVDb25maWcuanMiLCJzcmMvTWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ1ZBOztJQUdxQixVOzs7Ozs7OytCQUNIO0FBQ1Y7QUFDQSxnQkFBSSxNQUFNLEtBQUssVUFBTCxDQUFnQixRQUExQjtBQUVIOzs7Ozs7a0JBTGdCLFU7O0FBT3JCLFdBQVcsS0FBWCxHQUFtQixHQUFuQjtBQUNBLFdBQVcsTUFBWCxHQUFvQixJQUFwQjtBQUNBLFdBQVcsU0FBWCxHQUFzQixTQUF0QjtBQUNBLFdBQVcsVUFBWCxHQUF3QixNQUF4QjtBQUNBLFdBQVcsTUFBWCxHQUFvQixLQUFwQjtBQUNBLFdBQVcsTUFBWCxHQUFvQixRQUFwQjtBQUNBLFdBQVcsVUFBWCxHQUF3QixFQUF4QjtBQUNBLFdBQVcsU0FBWCxHQUF1QixFQUF2QjtBQUNBLFdBQVcsS0FBWCxHQUFtQixLQUFuQjtBQUNBLFdBQVcsSUFBWCxHQUFrQixLQUFsQjtBQUNBLFdBQVcsWUFBWCxHQUEwQixLQUExQjtBQUNBLFdBQVcsaUJBQVgsR0FBK0IsSUFBL0I7O0FBRUEsV0FBVyxJQUFYOzs7OztBQ3ZCQTs7Ozs7Ozs7SUFDTSxJLEdBQ0wsZ0JBQWM7QUFBQTs7QUFDYjtBQUNBLEtBQUksT0FBTyxRQUFQLENBQUosRUFBc0IsT0FBTyxJQUFQLENBQVkscUJBQVcsS0FBdkIsRUFBOEIscUJBQVcsTUFBekMsRUFBdEIsS0FDSyxLQUFLLElBQUwsQ0FBVSxxQkFBVyxLQUFyQixFQUE0QixxQkFBVyxNQUF2QyxFQUErQyxLQUFLLE9BQUwsQ0FBL0M7QUFDTCxNQUFLLFNBQUwsS0FBbUIsS0FBSyxTQUFMLEVBQWdCLE1BQWhCLEVBQW5CO0FBQ0EsTUFBSyxZQUFMLEtBQXNCLEtBQUssWUFBTCxFQUFtQixNQUFuQixFQUF0QjtBQUNBLE1BQUssS0FBTCxDQUFXLFNBQVgsR0FBdUIscUJBQVcsU0FBbEM7QUFDQSxNQUFLLEtBQUwsQ0FBVyxVQUFYLEdBQXdCLHFCQUFXLFVBQW5DO0FBQ0EsTUFBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixxQkFBVyxNQUEvQjtBQUNBLE1BQUssS0FBTCxDQUFXLE1BQVgsR0FBb0IscUJBQVcsTUFBL0I7QUFDQTtBQUNBLE1BQUssR0FBTCxDQUFTLGlCQUFULEdBQTZCLHFCQUFXLGlCQUF4Qzs7QUFFQTtBQUNBLEtBQUkscUJBQVcsS0FBWCxJQUFvQixLQUFLLEtBQUwsQ0FBVyxjQUFYLENBQTBCLE9BQTFCLEtBQXNDLE1BQTlELEVBQXNFLEtBQUssZ0JBQUw7QUFDdEUsS0FBSSxxQkFBVyxZQUFYLElBQTJCLEtBQUssa0JBQUwsQ0FBL0IsRUFBeUQsS0FBSyxrQkFBTCxFQUF5QixNQUF6QjtBQUN6RCxLQUFJLHFCQUFXLElBQWYsRUFBcUIsS0FBSyxJQUFMLENBQVUsSUFBVjtBQUNyQixNQUFLLGdCQUFMLEdBQXdCLElBQXhCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEM7QUFFRjs7O0FBQ0EsSUFBSSxPQUFPLElBQUksSUFBSixFQUFYOztBQUVBO0FBQ0EsU0FBUyxJQUFULEdBQWdCO0FBQ2Y7QUFDQSxNQUFLLEtBQUwsQ0FBVyxPQUFYLEdBQXFCLFNBQXJCO0FBQ0E7QUFDQSxTQUFRLEdBQVIsQ0FBWSxpQkFBWixFQUErQixLQUFLLEtBQUwsQ0FBVyxDQUExQztBQUNBLFNBQVEsR0FBUixDQUFZLGlCQUFaLEVBQStCLEtBQUssS0FBTCxDQUFXLENBQTFDOztBQUVBO0FBQ0EsS0FBSSxLQUFLLElBQUksS0FBSyxNQUFULEVBQVQ7QUFDQTtBQUNBLFNBQVEsR0FBUixDQUFZLG1CQUFaLEVBQWlDLEtBQUssS0FBTCxDQUFXLFdBQTVDO0FBQ0EsTUFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixFQUFwQjtBQUNBLFNBQVEsR0FBUixDQUFZLG1CQUFaLEVBQWlDLEtBQUssS0FBTCxDQUFXLFdBQTVDOztBQUVBO0FBQ0EsTUFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixRQUFwQixDQUE2QixHQUE3QixFQUFrQyxHQUFsQyxFQUF1QyxHQUF2QyxFQUE0QyxHQUE1QyxFQUFpRCxTQUFqRCxFQUE0RCxDQUE1RDtBQUNBO0FBQ0EsTUFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixRQUFwQixDQUE2QixHQUE3QixFQUFrQyxHQUFsQyxFQUF1QyxHQUF2QyxFQUE0QyxHQUE1QyxFQUFpRCxTQUFqRCxFQUE0RCxDQUE1RDs7QUFFQTtBQUNBLElBQUcsR0FBSCxDQUFPLEdBQVAsRUFBWSxHQUFaO0FBQ0E7QUFDQSxJQUFHLFFBQUgsQ0FBWSxRQUFaLENBQXFCLENBQUMsRUFBdEIsRUFBMEIsQ0FBMUIsRUFBNkIsRUFBN0IsRUFBaUMsQ0FBakMsRUFBb0MsU0FBcEMsRUFBK0MsQ0FBL0M7QUFDQSxJQUFHLFFBQUgsQ0FBWSxRQUFaLENBQXFCLENBQXJCLEVBQXdCLENBQUMsRUFBekIsRUFBNkIsQ0FBN0IsRUFBZ0MsRUFBaEMsRUFBb0MsU0FBcEMsRUFBK0MsQ0FBL0M7QUFDQTtBQUNBLElBQUcsUUFBSCxDQUFZLFVBQVosQ0FBdUIsQ0FBdkIsRUFBMEIsQ0FBMUIsRUFBNkIsRUFBN0IsRUFBaUMsSUFBakMsRUFBdUMsU0FBdkMsRUFBa0QsQ0FBbEQ7QUFDQTtBQUNBLE1BQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsVUFBcEIsQ0FBK0IsR0FBL0IsRUFBb0MsR0FBcEMsRUFBeUMsRUFBekMsRUFBNkMsSUFBN0MsRUFBbUQsU0FBbkQsRUFBOEQsQ0FBOUQ7O0FBRUE7QUFDQSxLQUFJLE1BQU0sSUFBSSxLQUFLLE1BQVQsRUFBVjtBQUNBLElBQUcsUUFBSCxDQUFZLEdBQVo7QUFDQTtBQUNBLEtBQUksQ0FBSixHQUFRLEVBQVI7QUFDQSxLQUFJLENBQUosR0FBUSxHQUFSO0FBQ0E7QUFDQSxLQUFJLFFBQUosQ0FBYSxRQUFiLENBQXNCLENBQUMsRUFBdkIsRUFBMkIsQ0FBM0IsRUFBOEIsRUFBOUIsRUFBa0MsQ0FBbEMsRUFBcUMsU0FBckMsRUFBZ0QsQ0FBaEQ7QUFDQSxLQUFJLFFBQUosQ0FBYSxRQUFiLENBQXNCLENBQXRCLEVBQXlCLENBQUMsRUFBMUIsRUFBOEIsQ0FBOUIsRUFBaUMsRUFBakMsRUFBcUMsU0FBckMsRUFBZ0QsQ0FBaEQ7QUFDQTtBQUNBLEtBQUksaUJBQWlCLEdBQUcsYUFBSCxDQUFpQixJQUFJLEtBQUssS0FBTCxDQUFXLEtBQWYsQ0FBcUIsSUFBSSxDQUF6QixFQUE0QixJQUFJLENBQWhDLENBQWpCLENBQXJCO0FBQ0EsU0FBUSxHQUFSLENBQVksa0JBQVosRUFBZ0MsZUFBZSxDQUEvQyxFQUFrRCxlQUFlLENBQWpFOztBQUVBO0FBQ0EsSUFBRyxRQUFILEdBQWMsRUFBZDtBQUNBO0FBQ0EsS0FBSSxpQkFBaUIsR0FBRyxhQUFILENBQWlCLElBQUksS0FBSyxLQUFMLENBQVcsS0FBZixDQUFxQixJQUFJLENBQXpCLEVBQTRCLElBQUksQ0FBaEMsQ0FBakIsQ0FBckI7QUFDQSxTQUFRLEdBQVIsQ0FBWSxrQkFBWixFQUFnQyxlQUFlLENBQS9DLEVBQWtELGVBQWUsQ0FBakU7QUFDQTs7QUFFRCxTQUFTLEtBQVQsR0FBaUI7QUFDaEI7QUFDQSxNQUFLLEtBQUwsQ0FBVyxPQUFYLEdBQXFCLFNBQXJCOztBQUVBO0FBQ0EsS0FBSSxTQUFTLElBQUksS0FBSyxNQUFULEVBQWI7QUFDQSxNQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLE1BQXBCO0FBQ0E7QUFDQSxRQUFPLEdBQVAsQ0FBVyxHQUFYLEVBQWdCLElBQWhCO0FBQ0E7QUFDQSxRQUFPLFFBQVAsQ0FBZ0IsUUFBaEIsQ0FBeUIsQ0FBQyxHQUExQixFQUErQixDQUEvQixFQUFrQyxHQUFsQyxFQUF1QyxDQUF2QyxFQUEwQyxTQUExQyxFQUFxRCxDQUFyRDtBQUNBLFFBQU8sUUFBUCxDQUFnQixRQUFoQixDQUF5QixDQUF6QixFQUE0QixDQUFDLEdBQTdCLEVBQWtDLENBQWxDLEVBQXFDLEdBQXJDLEVBQTBDLFNBQTFDLEVBQXFELENBQXJEOztBQUVBO0FBQ0EsS0FBSSxhQUFhLElBQUksS0FBSyxNQUFULEVBQWpCO0FBQ0EsUUFBTyxRQUFQLENBQWdCLFVBQWhCO0FBQ0E7QUFDQSxZQUFXLFFBQVgsQ0FBb0IsUUFBcEIsQ0FBNkIsQ0FBQyxHQUE5QixFQUFtQyxDQUFuQyxFQUFzQyxHQUF0QyxFQUEyQyxDQUEzQyxFQUE4QyxTQUE5QyxFQUF5RCxDQUF6RDtBQUNBLFlBQVcsUUFBWCxDQUFvQixRQUFwQixDQUE2QixDQUE3QixFQUFnQyxDQUFDLEdBQWpDLEVBQXNDLENBQXRDLEVBQXlDLEdBQXpDLEVBQThDLFNBQTlDLEVBQXlELENBQXpEO0FBQ0E7QUFDQSxZQUFXLEdBQVgsQ0FBZSxFQUFmLEVBQW1CLENBQUMsR0FBcEI7O0FBRUE7QUFDQSxZQUFXLFNBQVgsQ0FBcUIsaUJBQXJCLENBQXNDO0FBQ3JDO0FBREQ7QUFHQTtBQUNBLFFBQU8sUUFBUCxHQUFrQixDQUFDLEVBQW5COztBQUVBO0FBQ0EsTUFBSyxNQUFMLENBQVksSUFBWixDQUFpQixxQkFBakIsRUFDQyxLQUFLLE9BQUwsQ0FBYSxNQUFiLENBQW9CLElBQXBCLEVBQTBCLGFBQTFCLENBREQsRUFDMkMsSUFEM0MsRUFDaUQsS0FBSyxHQUFMLENBQVMsTUFBVCxDQUFnQixLQURqRTs7QUFHQTtBQUNBLFVBQVMsYUFBVCxHQUF5QjtBQUN4QjtBQUNBLE1BQUksV0FBVyxJQUFJLEtBQUssTUFBVCxFQUFmO0FBQ0E7QUFDQSxNQUFJLFlBQVksSUFBSSxLQUFLLEtBQVQsQ0FBZSxlQUFmLENBQWhCO0FBQ0E7QUFDQSxXQUFTLFFBQVQsQ0FBa0IsU0FBbEI7QUFDQTtBQUNBLFlBQVUsR0FBVixDQUFjLENBQUMsR0FBZixFQUFvQixDQUFDLENBQXJCO0FBQ0E7QUFDQSxXQUFTLFFBQVQsQ0FBa0IsUUFBbEIsQ0FBMkIsQ0FBQyxFQUE1QixFQUFnQyxDQUFoQyxFQUFtQyxFQUFuQyxFQUF1QyxDQUF2QyxFQUEwQyxTQUExQyxFQUFxRCxDQUFyRDtBQUNBLFdBQVMsUUFBVCxDQUFrQixRQUFsQixDQUEyQixDQUEzQixFQUE4QixDQUFDLEVBQS9CLEVBQW1DLENBQW5DLEVBQXNDLEVBQXRDLEVBQTBDLFNBQTFDLEVBQXFELENBQXJEO0FBQ0E7QUFDQSxPQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLFFBQXBCO0FBQ0EsV0FBUyxHQUFULENBQWEsR0FBYixFQUFrQixJQUFsQjtBQUNBO0FBQ0EsV0FBUyxRQUFULEdBQW9CLENBQUMsRUFBckI7QUFDQTtBQUNEOztBQUVELFNBQVMsS0FBVCxHQUFpQjtBQUNoQjtBQUNBLE1BQUssS0FBTCxDQUFXLE9BQVgsR0FBcUIsU0FBckI7QUFDQTtBQUNBLFdBQVUsQ0FBQyxxQkFBRCxFQUF3QixzQkFBeEIsQ0FBVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUksUUFBUSxLQUFLLEtBQUwsQ0FBVyxjQUFYLENBQTBCLE9BQTFCLENBQVo7QUFDQSxPQUFNLElBQU4sSUFBYyxXQUFkO0FBQ0E7QUFDQSxNQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLENBQXJCLEVBQXdCLElBQXhCLEVBQThCLE9BQTlCO0FBQ0E7O0FBRUQsU0FBUyxPQUFULEdBQW1CO0FBQ2xCO0FBQ0EsS0FBSSxRQUFRLEdBQVo7QUFDQSxNQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxLQUFMLENBQVcsV0FBL0IsRUFBNEMsR0FBNUMsRUFBaUQ7QUFDaEQsTUFBSSxNQUFNLEtBQUssS0FBTCxDQUFXLFVBQVgsQ0FBc0IsQ0FBdEIsQ0FBVjtBQUNBLE1BQUksSUFBSSxJQUFKLElBQVksT0FBaEIsRUFBeUI7QUFDekIsTUFBSSxDQUFKLElBQVMsUUFBUSxLQUFLLEtBQUwsQ0FBVyxLQUE1QjtBQUNBLE1BQUksSUFBSSxDQUFKLEdBQVEsR0FBWixFQUFpQixJQUFJLE9BQUo7QUFDakI7QUFDRDs7QUFFRCxTQUFTLFNBQVQsQ0FBbUIsU0FBbkIsRUFBOEI7QUFDN0IsTUFBSyxNQUFMLENBQVksSUFBWixDQUFpQixTQUFqQixFQUNDLEtBQUssT0FBTCxDQUFhLE1BQWIsQ0FBb0IsSUFBcEIsRUFBMEIsYUFBMUIsQ0FERCxFQUMyQyxJQUQzQyxFQUNpRCxLQUFLLEdBQUwsQ0FBUyxNQUFULENBQWdCLEtBRGpFO0FBRUE7O0FBRUQsU0FBUyxXQUFULEdBQXVCO0FBQ3RCO0FBQ0EsS0FBSSxXQUFXLElBQUksS0FBSyxNQUFULEVBQWY7QUFDQTtBQUNBLEtBQUksWUFBWSxJQUFJLEtBQUssS0FBVCxDQUFlLGVBQWYsQ0FBaEI7QUFDQTtBQUNBLFVBQVMsUUFBVCxDQUFrQixTQUFsQjtBQUNBO0FBQ0EsV0FBVSxHQUFWLENBQWMsQ0FBQyxHQUFmLEVBQW9CLENBQUMsQ0FBckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsUUFBcEI7QUFDQSxVQUFTLEdBQVQsQ0FBYSxHQUFiLEVBQWtCLElBQWxCO0FBQ0E7QUFDQSxVQUFTLFFBQVQsR0FBb0IsQ0FBQyxFQUFyQjtBQUNBLFVBQVMsSUFBVCxHQUFnQixPQUFoQjtBQUNBOztBQUVELFNBQVMsU0FBVCxHQUFxQjtBQUNwQjtBQUNBLEtBQUksU0FBUyxJQUFJLEtBQUssTUFBVCxFQUFiO0FBQ0EsTUFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixNQUFwQjtBQUNBO0FBQ0EsUUFBTyxHQUFQLENBQVcsR0FBWCxFQUFnQixJQUFoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSSxVQUFVLElBQUksS0FBSyxLQUFULENBQWUsYUFBZixDQUFkO0FBQ0E7QUFDQSxRQUFPLFFBQVAsQ0FBZ0IsT0FBaEI7QUFDQSxTQUFRLEdBQVIsQ0FBWSxFQUFaLEVBQWdCLENBQUMsR0FBakI7QUFDQTtBQUNBLFFBQU8sUUFBUCxHQUFrQixDQUFDLEVBQW5CO0FBQ0E7O0FBRUQ7QUFDQSxJQUFJLFFBQVEsQ0FBWjs7QUFFQSxTQUFTLGFBQVQsR0FBeUI7QUFDeEI7QUFDQTs7QUFFQTtBQUNBLEtBQUksUUFBUSxLQUFLLEtBQUwsQ0FBVyxjQUFYLENBQTBCLE9BQTFCLENBQVo7QUFDQSxPQUFNLElBQU4sR0FBYSxRQUFiO0FBQ0E7QUFDQSxTQUFRLENBQVI7QUFDQSxNQUFLLEtBQUwsQ0FBVyxFQUFYLENBQWMsS0FBSyxLQUFMLENBQVcsVUFBekIsRUFBcUMsSUFBckMsRUFBMkMsWUFBWTtBQUN0RDtBQUNBO0FBQ0E7QUFDQSxRQUFNLElBQU4sR0FBYSxTQUFTLEtBQVQsR0FBaUIsS0FBOUI7QUFDQTtBQUNBLEVBTkQ7QUFPQTs7QUFFRCxTQUFTLFdBQVQsR0FBdUI7QUFDdEI7QUFDQSxLQUFJLFFBQVEsSUFBSSxLQUFLLElBQVQsRUFBWjtBQUNBO0FBQ0EsT0FBTSxLQUFOLEdBQWMsU0FBZDtBQUNBO0FBQ0EsT0FBTSxJQUFOLEdBQWEsUUFBYjtBQUNBO0FBQ0EsT0FBTSxRQUFOLEdBQWlCLEVBQWpCO0FBQ0E7QUFDQSxPQUFNLEdBQU4sQ0FBVSxFQUFWLEVBQWMsR0FBZDtBQUNBO0FBQ0EsTUFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixLQUFwQjtBQUNBO0FBQ0EsT0FBTSxJQUFOLEdBQWEsYUFBYjtBQUNBO0FBQ0EsT0FBTSxJQUFOLEdBQWEsT0FBYjtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlRoaXMgY2xhc3MgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgTGF5YUFpcklERSwgcGxlYXNlIGRvIG5vdCBtYWtlIGFueSBtb2RpZmljYXRpb25zLiAqL1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVDb25maWcge1xyXG4gICAgc3RhdGljIGluaXQoKSB7XHJcbiAgICAgICAgLy/ms6jlhoxTY3JpcHTmiJbogIVSdW50aW1l5byV55SoXHJcbiAgICAgICAgbGV0IHJlZyA9IExheWEuQ2xhc3NVdGlscy5yZWdDbGFzcztcclxuXHJcbiAgICB9XHJcbn1cclxuR2FtZUNvbmZpZy53aWR0aCA9IDcyMDtcclxuR2FtZUNvbmZpZy5oZWlnaHQgPSAxMjgwO1xyXG5HYW1lQ29uZmlnLnNjYWxlTW9kZSA9XCJzaG93YWxsXCI7XHJcbkdhbWVDb25maWcuc2NyZWVuTW9kZSA9IFwibm9uZVwiO1xyXG5HYW1lQ29uZmlnLmFsaWduViA9IFwidG9wXCI7XHJcbkdhbWVDb25maWcuYWxpZ25IID0gXCJjZW50ZXJcIjtcclxuR2FtZUNvbmZpZy5zdGFydFNjZW5lID0gXCJcIjtcclxuR2FtZUNvbmZpZy5zY2VuZVJvb3QgPSBcIlwiO1xyXG5HYW1lQ29uZmlnLmRlYnVnID0gZmFsc2U7XHJcbkdhbWVDb25maWcuc3RhdCA9IGZhbHNlO1xyXG5HYW1lQ29uZmlnLnBoeXNpY3NEZWJ1ZyA9IGZhbHNlO1xyXG5HYW1lQ29uZmlnLmV4cG9ydFNjZW5lVG9Kc29uID0gdHJ1ZTtcclxuXHJcbkdhbWVDb25maWcuaW5pdCgpO1xyXG4iLCJpbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi9HYW1lQ29uZmlnXCI7XHJcbmNsYXNzIE1haW4ge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0Ly/moLnmja5JREXorr7nva7liJ3lp4vljJblvJXmk45cdFx0XHJcblx0XHRpZiAod2luZG93W1wiTGF5YTNEXCJdKSBMYXlhM0QuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCk7XHJcblx0XHRlbHNlIExheWEuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCwgTGF5YVtcIldlYkdMXCJdKTtcclxuXHRcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YVtcIkRlYnVnUGFuZWxcIl0gJiYgTGF5YVtcIkRlYnVnUGFuZWxcIl0uZW5hYmxlKCk7XHJcblx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IEdhbWVDb25maWcuc2NhbGVNb2RlO1xyXG5cdFx0TGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gR2FtZUNvbmZpZy5zY3JlZW5Nb2RlO1xyXG5cdFx0TGF5YS5zdGFnZS5hbGlnblYgPSBHYW1lQ29uZmlnLmFsaWduVjtcclxuXHRcdExheWEuc3RhZ2UuYWxpZ25IID0gR2FtZUNvbmZpZy5hbGlnbkg7XHJcblx0XHQvL+WFvOWuueW+ruS/oeS4jeaUr+aMgeWKoOi9vXNjZW5l5ZCO57yA5Zy65pmvXHJcblx0XHRMYXlhLlVSTC5leHBvcnRTY2VuZVRvSnNvbiA9IEdhbWVDb25maWcuZXhwb3J0U2NlbmVUb0pzb247XHJcblxyXG5cdFx0Ly/miZPlvIDosIPor5XpnaLmnb/vvIjpgJrov4dJREXorr7nva7osIPor5XmqKHlvI/vvIzmiJbogIV1cmzlnLDlnYDlop7liqBkZWJ1Zz10cnVl5Y+C5pWw77yM5Z2H5Y+v5omT5byA6LCD6K+V6Z2i5p2/77yJXHJcblx0XHRpZiAoR2FtZUNvbmZpZy5kZWJ1ZyB8fCBMYXlhLlV0aWxzLmdldFF1ZXJ5U3RyaW5nKFwiZGVidWdcIikgPT0gXCJ0cnVlXCIpIExheWEuZW5hYmxlRGVidWdQYW5lbCgpO1xyXG5cdFx0aWYgKEdhbWVDb25maWcucGh5c2ljc0RlYnVnICYmIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdKSBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXS5lbmFibGUoKTtcclxuXHRcdGlmIChHYW1lQ29uZmlnLnN0YXQpIExheWEuU3RhdC5zaG93KCk7XHJcblx0XHRMYXlhLmFsZXJ0R2xvYmFsRXJyb3IgPSB0cnVlO1xyXG5cclxuXHRcdC8vIGluaXQoKTtcclxuXHRcdC8vaW5pdDIoKTtcclxuXHRcdGluaXQzKCk7XHJcblx0fVxyXG59XHJcbi8v5r+A5rS75ZCv5Yqo57G7XHJcbnZhciBtYWluID0gbmV3IE1haW4oKTtcclxuXHJcbi8qKuWKn+iDveWIneWni+WMliAqL1xyXG5mdW5jdGlvbiBpbml0KCkge1xyXG5cdC8v6K6+572uc3RhZ2XnmoTog4zmma/popzoibJcclxuXHRMYXlhLnN0YWdlLmJnQ29sb3IgPSAnI2FhYmJjYyc7XHJcblx0Ly/mmL7npLpMYXlhLnN0YWdl5Z2Q5qCHXHJcblx0Y29uc29sZS5sb2coJ0xheWEuc3RhZ2UueCA9ICcsIExheWEuc3RhZ2UueCk7XHJcblx0Y29uc29sZS5sb2coJ0xheWEuc3RhZ2UueSA9ICcsIExheWEuc3RhZ2UueSk7XHJcblxyXG5cdC8v5re75YqgU3ByaXRlXHJcblx0dmFyIHNwID0gbmV3IExheWEuU3ByaXRlKCk7XHJcblx0Ly/miZPljbBMYXlhLnN0YWdl55qE5a2Q6IqC54K55pWw6YePXHJcblx0Y29uc29sZS5sb2coJ0xheWEuc3RhZ2XnmoTlrZDoioLngrnmlbDph4/vvJonLCBMYXlhLnN0YWdlLm51bUNoaWxkcmVuKTtcclxuXHRMYXlhLnN0YWdlLmFkZENoaWxkKHNwKTtcclxuXHRjb25zb2xlLmxvZygnTGF5YS5zdGFnZeeahOWtkOiKgueCueaVsOmHj++8micsIExheWEuc3RhZ2UubnVtQ2hpbGRyZW4pO1xyXG5cclxuXHQvL+WcqExheWEuc3RhZ2XkuK3nu5jliLbmsLTlubPnur9cclxuXHRMYXlhLnN0YWdlLmdyYXBoaWNzLmRyYXdMaW5lKDEwMCwgMjAwLCAzMDAsIDIwMCwgJyNmZjAwMDAnLCAxKTtcclxuXHQvL+WcqExheWEuc3RhZ2XkuK3nu5jliLblnoLnur9cclxuXHRMYXlhLnN0YWdlLmdyYXBoaWNzLmRyYXdMaW5lKDIwMCwgMTAwLCAyMDAsIDMwMCwgJyNmZjAwMDAnLCAxKTtcclxuXHJcblx0Ly/lsIZzcOenu+WKqOWIsOaoquWdkOaghzQwMO+8jOe6teWdkOaghzMwMOeahOS9jee9rlxyXG5cdHNwLnBvcyg0MDAsIDMwMCk7XHJcblx0Ly/nu5jliLbkuKTmnaHlnKhzcOeahOWOn+eCueS6pOWPieeahOebtOe6v1xyXG5cdHNwLmdyYXBoaWNzLmRyYXdMaW5lKC01MCwgMCwgNTAsIDAsICcjMDBmZjAwJywgMSk7XHJcblx0c3AuZ3JhcGhpY3MuZHJhd0xpbmUoMCwgLTUwLCAwLCA1MCwgJyMwMGZmMDAnLCAxKTtcclxuXHQvL+e7mOWItuS7pXNw55qE5Y6f54K55Li65Lit5b+D77yM5Y2K5b6ENDDnmoTlnIZcclxuXHRzcC5ncmFwaGljcy5kcmF3Q2lyY2xlKDAsIDAsIDQwLCBudWxsLCAnIzAwZmYwMCcsIDIpO1xyXG5cdC8vIOWcqExheWEuc3RhZ2XkuK3nu5jliLblnIZcclxuXHRMYXlhLnN0YWdlLmdyYXBoaWNzLmRyYXdDaXJjbGUoNDAwLCAzMDAsIDgwLCBudWxsLCAnI2ZmMDAwMCcsIDIpO1xyXG5cclxuXHQvLyDlnKhzcOS4rea3u+WKoHNwMVxyXG5cdHZhciBzcDEgPSBuZXcgTGF5YS5TcHJpdGUoKTtcclxuXHRzcC5hZGRDaGlsZChzcDEpO1xyXG5cdC8v6K6+572uc3Ax55qE5Z2Q5qCH77yM5L2c55So5ZKMc3AxLnBvcyh4LHkp55u45ZCMXHJcblx0c3AxLnggPSA1MDtcclxuXHRzcDEueSA9IDE1MDtcclxuXHQvL+e7mOWItnNwMeeahOWOn+eCueS9jee9rlxyXG5cdHNwMS5ncmFwaGljcy5kcmF3TGluZSgtNTAsIDAsIDUwLCAwLCAnIzAwMDBmZicsIDEpO1xyXG5cdHNwMS5ncmFwaGljcy5kcmF3TGluZSgwLCAtNTAsIDAsIDUwLCAnIzAwMDBmZicsIDEpO1xyXG5cdC8v5Zyo5o6n5Yi25Y+w5omT5Y2wc3Ax55u45a+5TGF5YS5zdGFnZeeahOWdkOagh1xyXG5cdHZhciBzcDFHbHBiYWxQb2ludCA9IHNwLmxvY2FsVG9HbG9iYWwobmV3IGxheWEubWF0aHMuUG9pbnQoc3AxLngsIHNwMS55KSk7XHJcblx0Y29uc29sZS5sb2coJ3NwMeebuOWvuXN0YWdl55qE5Z2Q5qCH5piv77yaICcsIHNwMUdscGJhbFBvaW50LngsIHNwMUdscGJhbFBvaW50LnkpO1xyXG5cclxuXHQvL+WwhnNw5peL6L2sMzDluqZcclxuXHRzcC5yb3RhdGlvbiA9IDMwO1xyXG5cdC8v5Zyo5o6n5Yi25Y+w5omT5Y2wc3Ax55u45a+5TGF5YS5zdGFnZeeahOWdkOagh1xyXG5cdHZhciBzcDFHbHBiYWxQb2ludCA9IHNwLmxvY2FsVG9HbG9iYWwobmV3IGxheWEubWF0aHMuUG9pbnQoc3AxLngsIHNwMS55KSk7XHJcblx0Y29uc29sZS5sb2coJ3NwMeebuOWvuXN0YWdl55qE5Z2Q5qCH5piv77yaICcsIHNwMUdscGJhbFBvaW50LngsIHNwMUdscGJhbFBvaW50LnkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0MigpIHtcclxuXHQvL+iuvue9rnN0YWdl55qE6IOM5pmv6aKc6ImyXHJcblx0TGF5YS5zdGFnZS5iZ0NvbG9yID0gJyNhYWJiY2MnO1xyXG5cclxuXHQvL+WIm+W7uuS4gOS4qlNwcml0ZeadpeS9nOS4uuW8k+eahOagueiKgueCuVxyXG5cdHZhciBzcF9ib3cgPSBuZXcgTGF5YS5TcHJpdGUoKTtcclxuXHRMYXlhLnN0YWdlLmFkZENoaWxkKHNwX2Jvdyk7XHJcblx0Ly/lsIblvJPnp7vliqjliLDlsY/luZXkuK3lpK5cclxuXHRzcF9ib3cucG9zKDM2MCwgMTIwMCk7XHJcblx0Ly/nu5jliLblvJPnmoTkuK3lv4PngrlcclxuXHRzcF9ib3cuZ3JhcGhpY3MuZHJhd0xpbmUoLTEwMCwgMCwgMTAwLCAwLCBcIiMwMGZmMDBcIiwgMSk7XHJcblx0c3BfYm93LmdyYXBoaWNzLmRyYXdMaW5lKDAsIC0xMDAsIDAsIDEwMCwgXCIjMDBmZjAwXCIsIDEpO1xyXG5cclxuXHQvL+WIm+W7uuS4gOS4qlNwcml0ZeadpeWKoOi9veWbvueJh+i1hOa6kCBib3cucG5nIOS9nOS4uuW8k+aYvuekulxyXG5cdHZhciBzcF9ib3dfaW1nID0gbmV3IExheWEuU3ByaXRlKCk7XHJcblx0c3BfYm93LmFkZENoaWxkKHNwX2Jvd19pbWcpO1xyXG5cdC8v57uY5Yi25Zu+54mH55qE5Z2Q5qCH5Y6f54K5XHJcblx0c3BfYm93X2ltZy5ncmFwaGljcy5kcmF3TGluZSgtMTAwLCAwLCAxMDAsIDAsIFwiIzAwZmZmZlwiLCAxKTtcclxuXHRzcF9ib3dfaW1nLmdyYXBoaWNzLmRyYXdMaW5lKDAsIC0xMDAsIDAsIDEwMCwgXCIjMDBmZmZmXCIsIDEpO1xyXG5cdC8v5YGP56e75byT55qE5Zu+5YOP5pi+56S65Yiw5q2j56Gu5L2N572uXHJcblx0c3BfYm93X2ltZy5wb3MoMzAsIC0xNjApO1xyXG5cclxuXHQvL+WKoOi9veW8k+eahOWbvueJh+i1hOa6kFxyXG5cdHNwX2Jvd19pbWcubG9hZEltYWdlKFwicmVzL2ltZy9ib3cucG5nXCIvLyxcclxuXHRcdC8vIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgZnVuY3Rpb24gKCkgeyBjb25zb2xlLmxvZygn5Zu+54mH5Yqg6L295a6M5q+V77yBJykgfVx0KVxyXG5cdCk7XHJcblx0Ly/miorlvJPpgIbml7bpkojml4vovaw5MMKw77yM5a+55YeG5q2j5LiK5pa5XHJcblx0c3BfYm93LnJvdGF0aW9uID0gLTkwO1xyXG5cclxuXHQvL+WKoOi9veWbvumbhlxyXG5cdExheWEubG9hZGVyLmxvYWQoXCJyZXMvYXRsYXMvaW1nLmF0bGFzXCIsXHJcblx0XHRMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIG9uQXNzZXRMb2FkZWQpLCBudWxsLCBsYXlhLm5ldC5Mb2FkZXIuQVRMQVMpO1xyXG5cclxuXHQvKirliqDovb3lm77pm4blkI7nmoTlpITnkIYgKi9cclxuXHRmdW5jdGlvbiBvbkFzc2V0TG9hZGVkKCkge1xyXG5cdFx0Ly/liJvlu7rmib/ovb3nrq3nmoRMYXlhLlNwcml0ZVxyXG5cdFx0dmFyIHNwX2Fycm93ID0gbmV3IExheWEuU3ByaXRlKCk7XHJcblx0XHQvL+S9v+eUqOWbvumbhuS4reeahOeureeahOWbvuWDj+aVsOaNruW7uueri+S4gOS4qkxheWEuSW1hZ2Xlr7nosaFcclxuXHRcdHZhciBpbWdfYXJyb3cgPSBuZXcgTGF5YS5JbWFnZSgnaW1nL2Fycm93LnBuZycpO1xyXG5cdFx0Ly/lsIZpbWdfYXJyb3fmt7vliqDliLBzcF9hcnJvd1xyXG5cdFx0c3BfYXJyb3cuYWRkQ2hpbGQoaW1nX2Fycm93KTtcclxuXHRcdC8v5Zu+5YOP55qE5Y6f54K55piv5bem5LiK6KeS77yM5Li65LqG6K6p566t5aS05Zyoc3BfYXJyb3fnmoTljp/ngrnkvY3nva7vvIzlgY/np7vlm77lg4/lnZDmoIdcclxuXHRcdGltZ19hcnJvdy5wb3MoLTE1MiwgLTgpO1xyXG5cdFx0Ly/nu5jliLbovoXliqnnur/moIfms6jnrq3nmoTljp/ngrlcclxuXHRcdHNwX2Fycm93LmdyYXBoaWNzLmRyYXdMaW5lKC01MCwgMCwgNTAsIDAsIFwiI2ZmMDAwMFwiLCAxKTtcclxuXHRcdHNwX2Fycm93LmdyYXBoaWNzLmRyYXdMaW5lKDAsIC01MCwgMCwgNTAsIFwiI2ZmMDAwMFwiLCAxKTtcclxuXHRcdC8v5ZyoTGF5YS5zdGFnZeS4rea3u+WKoOeure+8jOW5tuaKiuWug+iuvue9ruaIkOWSjOW8k+WvueW6lOeahOS9jee9rlxyXG5cdFx0TGF5YS5zdGFnZS5hZGRDaGlsZChzcF9hcnJvdyk7XHJcblx0XHRzcF9hcnJvdy5wb3MoMzYwLCAxMDQwKTtcclxuXHRcdC8v566t5aS05ZCR5LiKXHJcblx0XHRzcF9hcnJvdy5yb3RhdGlvbiA9IC05MDtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQzKCkge1xyXG5cdC8v6K6+572uc3RhZ2XnmoTog4zmma/popzoibJcclxuXHRMYXlhLnN0YWdlLmJnQ29sb3IgPSAnI2FhYmJjYyc7XHJcblx0Ly/liqDovb3lpJrkuKrlm77pm4ZcclxuXHRsb2FkQXRsYXMoW1wicmVzL2F0bGFzL2ltZy5hdGxhc1wiLCBcInJlcy9hdGxhcy9jb21wLmF0bGFzXCJdKTtcclxuXHQvL+a3u+WKoOaWh+Wtl1xyXG5cdGNyZWF0ZVRpdGxlKCk7XHJcblx0Ly/ku45MYXlhLnN0YWdl5Lit5p+l5om+5Yiw5paH5a2X5qCH6aKYXHJcblx0dmFyIHRpdGxlID0gTGF5YS5zdGFnZS5nZXRDaGlsZEJ5TmFtZShcInRpdGxlXCIpO1xyXG5cdHRpdGxlLnRleHQgKz0gXCIgMTIzNDU2NzhcIjtcclxuXHQvL+WfuuS6juW4p+eOh+mHjeWkjeaJp+ihjFxyXG5cdExheWEudGltZXIuZnJhbWVMb29wKDEsIHRoaXMsIG9uRnJhbWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvbkZyYW1lKCkge1xyXG5cdC8vIGNvbnNvbGUubG9nKCdMYXlhLnRpbWVyLmRlbHRhIDogJywgTGF5YS50aW1lci5kZWx0YSk7XHJcblx0dmFyIHNwZWVkID0gMS41O1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgTGF5YS5zdGFnZS5udW1DaGlsZHJlbjsgaSsrKSB7XHJcblx0XHR2YXIgb2JqID0gTGF5YS5zdGFnZS5nZXRDaGlsZEF0KGkpO1xyXG5cdFx0aWYgKG9iai5uYW1lICE9ICdhcnJvdycpIGNvbnRpbnVlO1xyXG5cdFx0b2JqLnkgLT0gc3BlZWQgKiBMYXlhLnRpbWVyLmRlbHRhO1xyXG5cdFx0aWYgKG9iai55IDwgMjUwKSBvYmouZGVzdHJveSgpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZEF0bGFzKGF0bGFzUGF0aCkge1xyXG5cdExheWEubG9hZGVyLmxvYWQoYXRsYXNQYXRoLFxyXG5cdFx0TGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCBvbkFzc2V0TG9hZGVkKSwgbnVsbCwgbGF5YS5uZXQuTG9hZGVyLkFUTEFTKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlQXJyb3coKSB7XHJcblx0Ly/liJvlu7rmib/ovb3nrq3nmoRMYXlhLlNwcml0ZVxyXG5cdHZhciBzcF9hcnJvdyA9IG5ldyBMYXlhLlNwcml0ZSgpO1xyXG5cdC8v5L2/55So5Zu+6ZuG5Lit55qE566t55qE5Zu+5YOP5pWw5o2u5bu656uL5LiA5LiqTGF5YS5JbWFnZeWvueixoVxyXG5cdHZhciBpbWdfYXJyb3cgPSBuZXcgTGF5YS5JbWFnZSgnaW1nL2Fycm93LnBuZycpO1xyXG5cdC8v5bCGaW1nX2Fycm935re75Yqg5Yiwc3BfYXJyb3dcclxuXHRzcF9hcnJvdy5hZGRDaGlsZChpbWdfYXJyb3cpO1xyXG5cdC8v5Zu+5YOP55qE5Y6f54K55piv5bem5LiK6KeS77yM5Li65LqG6K6p566t5aS05Zyoc3BfYXJyb3fnmoTljp/ngrnkvY3nva7vvIzlgY/np7vlm77lg4/lnZDmoIdcclxuXHRpbWdfYXJyb3cucG9zKC0xNTIsIC04KTtcclxuXHQvL+e7mOWItui+heWKqee6v+agh+azqOeureeahOWOn+eCuVxyXG5cdC8vIHNwX2Fycm93LmdyYXBoaWNzLmRyYXdMaW5lKC01MCwgMCwgNTAsIDAsIFwiI2ZmMDAwMFwiLCAxKTtcclxuXHQvLyBzcF9hcnJvdy5ncmFwaGljcy5kcmF3TGluZSgwLCAtNTAsIDAsIDUwLCBcIiNmZjAwMDBcIiwgMSk7XHJcblx0Ly/lnKhMYXlhLnN0YWdl5Lit5re75Yqg566t77yM5bm25oqK5a6D6K6+572u5oiQ5ZKM5byT5a+55bqU55qE5L2N572uXHJcblx0TGF5YS5zdGFnZS5hZGRDaGlsZChzcF9hcnJvdyk7XHJcblx0c3BfYXJyb3cucG9zKDM2MCwgMTA0MCk7XHJcblx0Ly/nrq3lpLTlkJHkuIpcclxuXHRzcF9hcnJvdy5yb3RhdGlvbiA9IC05MDtcclxuXHRzcF9hcnJvdy5uYW1lID0gJ2Fycm93JztcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlQm93KCkge1xyXG5cdC8v5Yib5bu65LiA5LiqU3ByaXRl5p2l5Yqg6L295Zu+54mH6LWE5rqQIGJvdy5wbmcg5L2c5Li65byT5pi+56S6XHJcblx0dmFyIHNwX2JvdyA9IG5ldyBMYXlhLlNwcml0ZSgpO1xyXG5cdExheWEuc3RhZ2UuYWRkQ2hpbGQoc3BfYm93KTtcclxuXHQvL+WwhuW8k+enu+WKqOWIsOWxj+W5leS4reWkrlxyXG5cdHNwX2Jvdy5wb3MoMzYwLCAxMjAwKTtcclxuXHQvL+e7mOWItuW8k+eahOS4reW/g+eCuVxyXG5cdC8vIHNwX2Jvdy5ncmFwaGljcy5kcmF3TGluZSgtMTAwLCAwLCAxMDAsIDAsIFwiIzAwZmYwMFwiLCAxKTtcclxuXHQvLyBzcF9ib3cuZ3JhcGhpY3MuZHJhd0xpbmUoMCwgLTEwMCwgMCwgMTAwLCBcIiMwMGZmMDBcIiwgMSk7XHJcblx0Ly/kvb/nlKjlm77pm4bliJvlu7rlvJPnmoTlm77lg4/lubbmmL7npLpcclxuXHR2YXIgaW1nX2JvdyA9IG5ldyBMYXlhLkltYWdlKCdpbWcvYm93LnBuZycpO1xyXG5cdC8vIGltZ19ib3cuc2tpbiA9ICdjb21wL2NsaXBfbnVtLnBuZyc7XHJcblx0c3BfYm93LmFkZENoaWxkKGltZ19ib3cpO1xyXG5cdGltZ19ib3cucG9zKDMwLCAtMTYwKTtcclxuXHQvL+aKiuW8k+mAhuaXtumSiOaXi+i9rDkwwrDvvIzlr7nlh4bmraPkuIrmlrlcclxuXHRzcF9ib3cucm90YXRpb24gPSAtOTA7XHJcbn1cclxuXHJcbi8v5re75Yqg5LiA5Liq5YWo5bGA55qE6K6h5pWw5ZmoXHJcbnZhciBjb3VudCA9IDA7XHJcblxyXG5mdW5jdGlvbiBvbkFzc2V0TG9hZGVkKCkge1xyXG5cdGNyZWF0ZUJvdygpO1xyXG5cdC8vIGNyZWF0ZUFycm93KCk7XHJcblxyXG5cdC8v5byV55So5paH5a2X5a+56LGhXHJcblx0dmFyIHRpdGxlID0gTGF5YS5zdGFnZS5nZXRDaGlsZEJ5TmFtZShcInRpdGxlXCIpO1xyXG5cdHRpdGxlLnRleHQgPSAn54K55Ye75bGP5bmV5bCE566tJztcclxuXHQvL+a3u+WKoOiuoeaVsOWZqO+8jOW5tuWIneWni+WMluS4uiAnMCdcclxuXHRjb3VudCA9IDA7XHJcblx0TGF5YS5zdGFnZS5vbihMYXlhLkV2ZW50Lk1PVVNFX0RPV04sIHRoaXMsIGZ1bmN0aW9uICgpIHtcclxuXHRcdC8v6byg5qCH5oyJ5LiL5ZCO6K6h5pWw5Zmo6Ieq5Yqo5Yqg5LiAXHJcblx0XHRjb3VudCsrO1xyXG5cdFx0Ly/lnKjmlofmnKzmoIfpopjkuK3ovpPlh7rorqHmlbDlmajlj5jljJZcclxuXHRcdHRpdGxlLnRleHQgPSAn5bey5bCE5Ye6ICcgKyBjb3VudCArICcg5pSv566tJztcclxuXHRcdGNyZWF0ZUFycm93KCk7XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVRpdGxlKCkge1xyXG5cdC8v5Yib5bu65LiA5Liq5paH5pys5a6e5L6LXHJcblx0dmFyIHRpdGxlID0gbmV3IExheWEuVGV4dCgpO1xyXG5cdC8v6K6+572u6aKc6ImyXHJcblx0dGl0bGUuY29sb3IgPSBcIiNGRkZGRkZcIjtcclxuXHQvL+iuvue9ruWtl+S9k1xyXG5cdHRpdGxlLmZvbnQgPSBcIkltcGFjdFwiO1xyXG5cdC8v6K6+572u5a2X5L2T5aSn5bCPXHJcblx0dGl0bGUuZm9udFNpemUgPSA0MDtcclxuXHQvL+iuvue9ruS9jee9rlxyXG5cdHRpdGxlLnBvcyg4MCwgMTAwKTtcclxuXHQvL+WcqExheWEuc3RhZ2XkuK3mt7vliqDmlofmnKxcclxuXHRMYXlhLnN0YWdlLmFkZENoaWxkKHRpdGxlKTtcclxuXHQvL+iuvue9ruaWh+acrOWGheWuuVxyXG5cdHRpdGxlLnRleHQgPSBcIkhlbGxvIFdvcmxkXCI7XHJcblx0Ly/orr7lrpp0aXRsZeeahOWQjeWtl++8jOeUqOS6juWQjue7reeahOaTjeS9nFxyXG5cdHRpdGxlLm5hbWUgPSBcInRpdGxlXCI7XHJcbn1cclxuIl19
