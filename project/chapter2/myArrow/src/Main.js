import GameConfig from "./GameConfig";
class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;

		// init();
		//init2();
		init3();
	}
}
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
	sp_bow_img.loadImage("res/img/bow.png"//,
		// Laya.Handler.create(this, function () { console.log('图片加载完毕！') }	)
	);
	//把弓逆时针旋转90°，对准正上方
	sp_bow.rotation = -90;

	//加载图集
	Laya.loader.load("res/atlas/img.atlas",
		Laya.Handler.create(this, onAssetLoaded), null, laya.net.Loader.ATLAS);

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
	Laya.loader.load(atlasPath,
		Laya.Handler.create(this, onAssetLoaded), null, laya.net.Loader.ATLAS);
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
