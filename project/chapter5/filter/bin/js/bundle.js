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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */


var _MainScript = require("./script/MainScript");

var _MainScript2 = _interopRequireDefault(_MainScript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameConfig = function () {
    function GameConfig() {
        _classCallCheck(this, GameConfig);
    }

    _createClass(GameConfig, null, [{
        key: "init",
        value: function init() {
            //注册Script或者Runtime引用
            var reg = Laya.ClassUtils.regClass;
            reg("script/MainScript.js", _MainScript2.default);
        }
    }]);

    return GameConfig;
}();

exports.default = GameConfig;

GameConfig.width = 1280;
GameConfig.height = 720;
GameConfig.scaleMode = "showall";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "mainScenes.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();

},{"./script/MainScript":3}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GameConfig = require("./GameConfig");

var _GameConfig2 = _interopRequireDefault(_GameConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Main = function () {
	function Main() {
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

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	_createClass(Main, [{
		key: "onVersionLoaded",
		value: function onVersionLoaded() {
			//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
			Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
		}
	}, {
		key: "onConfigLoaded",
		value: function onConfigLoaded() {
			//加载IDE指定的场景
			_GameConfig2.default.startScene && Laya.Scene.open(_GameConfig2.default.startScene);
		}
	}]);

	return Main;
}();
//激活启动类


new Main();

},{"./GameConfig":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//MainScript.js
var MainScript = function (_Laya$Script) {
    _inherits(MainScript, _Laya$Script);

    function MainScript() {
        _classCallCheck(this, MainScript);

        return _possibleConstructorReturn(this, (MainScript.__proto__ || Object.getPrototypeOf(MainScript)).call(this));
    }

    _createClass(MainScript, [{
        key: 'onEnable',
        value: function onEnable() {
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
            car4.filters = [getColorFilter("#DE6552")]; //红色
            car5.filters = [getColorFilter("#5d8843")]; //绿色
            car6.filters = [getColorFilter("#99b4d1")]; //蓝色
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
    }]);

    return MainScript;
}(Laya.Script);

/**获取亮度滤镜 */


exports.default = MainScript;
function getBrightFilter(offset) {
    var colorMatrix = [1, 0, 0, 0, offset, 0, 1, 0, 0, offset, 0, 0, 1, 0, offset, 0, 0, 0, 1, offset];
    //创建颜色滤镜
    var colorFilter = new Laya.ColorFilter(colorMatrix);
    return colorFilter;
}

/**获取反色滤镜 */
function getInverseFilter() {
    var colorMatrix = [-1, 0, 0, 0, 255, 0, -1, 0, 0, 255, 0, 0, -1, 0, 255, 0, 0, 0, 1, 0];
    //创建颜色滤镜
    var colorFilter = new Laya.ColorFilter(colorMatrix);
    return colorFilter;
}

/**获取颜色填充 */
function getColorFilter(rgbCode) {
    var r,
        g,
        b = 1;
    var rgbString = rgbCode;
    try {
        r = parseInt(rgbString.substr(1, 2), 16) / 255;
        g = parseInt(rgbString.substr(3, 2), 16) / 255;
        b = parseInt(rgbString.substr(5, 2), 16) / 255;
    } catch (e) {
        r, g, b = 1;
    };

    var colorMatrix = [r, 0, 0, 0, 0, //R
    0, g, 0, 0, 0, //G
    0, 0, b, 0, 0, //B
    0, 0, 0, 1, 0];
    //创建颜色滤镜
    var colorFilter = new Laya.ColorFilter(colorMatrix);
    return colorFilter;
}

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0xheWFBaXJJREVfYmV0YTQvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0dhbWVDb25maWcuanMiLCJzcmMvTWFpbi5qcyIsInNyYy9zY3JpcHQvTWFpblNjcmlwdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O3FqQkNWQTs7O0FBQ0E7Ozs7Ozs7O0lBRXFCLFU7Ozs7Ozs7K0JBQ0g7QUFDVjtBQUNBLGdCQUFJLE1BQU0sS0FBSyxVQUFMLENBQWdCLFFBQTFCO0FBQ04sZ0JBQUksc0JBQUosRUFBMkIsb0JBQTNCO0FBQ0c7Ozs7OztrQkFMZ0IsVTs7QUFPckIsV0FBVyxLQUFYLEdBQW1CLElBQW5CO0FBQ0EsV0FBVyxNQUFYLEdBQW9CLEdBQXBCO0FBQ0EsV0FBVyxTQUFYLEdBQXNCLFNBQXRCO0FBQ0EsV0FBVyxVQUFYLEdBQXdCLE1BQXhCO0FBQ0EsV0FBVyxNQUFYLEdBQW9CLEtBQXBCO0FBQ0EsV0FBVyxNQUFYLEdBQW9CLE1BQXBCO0FBQ0EsV0FBVyxVQUFYLEdBQXdCLGtCQUF4QjtBQUNBLFdBQVcsU0FBWCxHQUF1QixFQUF2QjtBQUNBLFdBQVcsS0FBWCxHQUFtQixLQUFuQjtBQUNBLFdBQVcsSUFBWCxHQUFrQixLQUFsQjtBQUNBLFdBQVcsWUFBWCxHQUEwQixLQUExQjtBQUNBLFdBQVcsaUJBQVgsR0FBK0IsSUFBL0I7O0FBRUEsV0FBVyxJQUFYOzs7Ozs7O0FDdkJBOzs7Ozs7OztJQUNNLEk7QUFDTCxpQkFBYztBQUFBOztBQUNiO0FBQ0EsTUFBSSxPQUFPLFFBQVAsQ0FBSixFQUFzQixPQUFPLElBQVAsQ0FBWSxxQkFBVyxLQUF2QixFQUE4QixxQkFBVyxNQUF6QyxFQUF0QixLQUNLLEtBQUssSUFBTCxDQUFVLHFCQUFXLEtBQXJCLEVBQTRCLHFCQUFXLE1BQXZDLEVBQStDLEtBQUssT0FBTCxDQUEvQztBQUNMLE9BQUssU0FBTCxLQUFtQixLQUFLLFNBQUwsRUFBZ0IsTUFBaEIsRUFBbkI7QUFDQSxPQUFLLFlBQUwsS0FBc0IsS0FBSyxZQUFMLEVBQW1CLE1BQW5CLEVBQXRCO0FBQ0EsT0FBSyxLQUFMLENBQVcsU0FBWCxHQUF1QixxQkFBVyxTQUFsQztBQUNBLE9BQUssS0FBTCxDQUFXLFVBQVgsR0FBd0IscUJBQVcsVUFBbkM7QUFDQSxPQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLHFCQUFXLE1BQS9CO0FBQ0EsT0FBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixxQkFBVyxNQUEvQjtBQUNBO0FBQ0EsT0FBSyxHQUFMLENBQVMsaUJBQVQsR0FBNkIscUJBQVcsaUJBQXhDOztBQUVBO0FBQ0EsTUFBSSxxQkFBVyxLQUFYLElBQW9CLEtBQUssS0FBTCxDQUFXLGNBQVgsQ0FBMEIsT0FBMUIsS0FBc0MsTUFBOUQsRUFBc0UsS0FBSyxnQkFBTDtBQUN0RSxNQUFJLHFCQUFXLFlBQVgsSUFBMkIsS0FBSyxrQkFBTCxDQUEvQixFQUF5RCxLQUFLLGtCQUFMLEVBQXlCLE1BQXpCO0FBQ3pELE1BQUkscUJBQVcsSUFBZixFQUFxQixLQUFLLElBQUwsQ0FBVSxJQUFWO0FBQ3JCLE9BQUssZ0JBQUwsR0FBd0IsSUFBeEI7O0FBRUE7QUFDQSxPQUFLLGVBQUwsQ0FBcUIsTUFBckIsQ0FBNEIsY0FBNUIsRUFBNEMsS0FBSyxPQUFMLENBQWEsTUFBYixDQUFvQixJQUFwQixFQUEwQixLQUFLLGVBQS9CLENBQTVDLEVBQTZGLEtBQUssZUFBTCxDQUFxQixnQkFBbEg7QUFDQTs7OztvQ0FFaUI7QUFDakI7QUFDQSxRQUFLLGdCQUFMLENBQXNCLE1BQXRCLENBQTZCLGlCQUE3QixFQUFnRCxLQUFLLE9BQUwsQ0FBYSxNQUFiLENBQW9CLElBQXBCLEVBQTBCLEtBQUssY0FBL0IsQ0FBaEQ7QUFDQTs7O21DQUVnQjtBQUNoQjtBQUNBLHdCQUFXLFVBQVgsSUFBeUIsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixxQkFBVyxVQUEzQixDQUF6QjtBQUNBOzs7OztBQUVGOzs7QUFDQSxJQUFJLElBQUo7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcENBO0lBQ3FCLFU7OztBQUNqQiwwQkFBYztBQUFBOztBQUFBO0FBQVk7Ozs7bUNBQ2Y7QUFDUCxpQkFBSyxLQUFMLENBQVcsT0FBWCxHQUFxQixTQUFyQjtBQUNBLGdCQUFJLE9BQU8sS0FBSyxLQUFMLENBQVcsY0FBWCxDQUEwQixNQUExQixDQUFYO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLEtBQUwsQ0FBVyxjQUFYLENBQTBCLE1BQTFCLENBQVg7QUFDQSxnQkFBSSxPQUFPLEtBQUssS0FBTCxDQUFXLGNBQVgsQ0FBMEIsTUFBMUIsQ0FBWDtBQUNBLGdCQUFJLE9BQU8sS0FBSyxLQUFMLENBQVcsY0FBWCxDQUEwQixNQUExQixDQUFYO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLEtBQUwsQ0FBVyxjQUFYLENBQTBCLE1BQTFCLENBQVg7QUFDQSxnQkFBSSxPQUFPLEtBQUssS0FBTCxDQUFXLGNBQVgsQ0FBMEIsTUFBMUIsQ0FBWDtBQUNBLGdCQUFJLE9BQU8sS0FBSyxLQUFMLENBQVcsY0FBWCxDQUEwQixNQUExQixDQUFYO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLEtBQUwsQ0FBVyxjQUFYLENBQTBCLE1BQTFCLENBQVg7QUFDQSxnQkFBSSxPQUFPLEtBQUssS0FBTCxDQUFXLGNBQVgsQ0FBMEIsTUFBMUIsQ0FBWDtBQUNBLGdCQUFJLFFBQVEsS0FBSyxLQUFMLENBQVcsY0FBWCxDQUEwQixPQUExQixDQUFaO0FBQ0EsZ0JBQUksUUFBUSxLQUFLLEtBQUwsQ0FBVyxjQUFYLENBQTBCLE9BQTFCLENBQVo7QUFDQSxnQkFBSSxRQUFRLEtBQUssS0FBTCxDQUFXLGNBQVgsQ0FBMEIsT0FBMUIsQ0FBWjtBQUNBO0FBQ0EsaUJBQUssT0FBTCxHQUFlLENBQUMsZ0JBQWdCLENBQUMsR0FBakIsQ0FBRCxDQUFmO0FBQ0EsaUJBQUssT0FBTCxHQUFlLENBQUMsZ0JBQWdCLEdBQWhCLENBQUQsQ0FBZjtBQUNBO0FBQ0EsaUJBQUssT0FBTCxHQUFlLENBQUMsa0JBQUQsQ0FBZjtBQUNBO0FBQ0EsaUJBQUssT0FBTCxHQUFlLENBQUMsZUFBZSxTQUFmLENBQUQsQ0FBZixDQXBCTyxDQW9Cb0M7QUFDM0MsaUJBQUssT0FBTCxHQUFlLENBQUMsZUFBZSxTQUFmLENBQUQsQ0FBZixDQXJCTyxDQXFCb0M7QUFDM0MsaUJBQUssT0FBTCxHQUFlLENBQUMsZUFBZSxTQUFmLENBQUQsQ0FBZixDQXRCTyxDQXNCb0M7QUFDM0M7QUFDQSxnQkFBSSxjQUFjLElBQUksS0FBSyxVQUFULENBQW9CLFNBQXBCLEVBQStCLENBQS9CLEVBQWtDLENBQWxDLEVBQXFDLENBQXJDLENBQWxCO0FBQ0EsaUJBQUssT0FBTCxHQUFlLENBQUMsV0FBRCxDQUFmO0FBQ0E7QUFDQSxnQkFBSSxhQUFhLElBQUksS0FBSyxVQUFULENBQW9CLFNBQXBCLEVBQStCLEVBQS9CLEVBQW1DLENBQW5DLEVBQXNDLENBQXRDLENBQWpCO0FBQ0EsaUJBQUssT0FBTCxHQUFlLENBQUMsVUFBRCxDQUFmO0FBQ0E7QUFDQSxnQkFBSSxhQUFhLElBQUksS0FBSyxVQUFULENBQW9CLENBQXBCLENBQWpCO0FBQ0EsaUJBQUssT0FBTCxHQUFlLENBQUMsVUFBRCxDQUFmO0FBQ0E7QUFDQSxrQkFBTSxPQUFOLEdBQWdCLENBQUMsZ0JBQWdCLEdBQWhCLENBQUQsRUFBdUIsa0JBQXZCLEVBQTJDLGVBQWUsU0FBZixDQUEzQyxDQUFoQjtBQUNBO0FBQ0Esa0JBQU0sT0FBTixHQUFnQixDQUFDLGVBQWUsU0FBZixDQUFELEVBQTRCLFdBQTVCLEVBQXlDLFVBQXpDLENBQWhCO0FBQ0g7Ozs7RUF0Q21DLEtBQUssTTs7QUF5QzdDOzs7a0JBekNxQixVO0FBMENyQixTQUFTLGVBQVQsQ0FBeUIsTUFBekIsRUFBaUM7QUFDN0IsUUFBSSxjQUNBLENBQ0ksQ0FESixFQUNPLENBRFAsRUFDVSxDQURWLEVBQ2EsQ0FEYixFQUNnQixNQURoQixFQUVJLENBRkosRUFFTyxDQUZQLEVBRVUsQ0FGVixFQUVhLENBRmIsRUFFZ0IsTUFGaEIsRUFHSSxDQUhKLEVBR08sQ0FIUCxFQUdVLENBSFYsRUFHYSxDQUhiLEVBR2dCLE1BSGhCLEVBSUksQ0FKSixFQUlPLENBSlAsRUFJVSxDQUpWLEVBSWEsQ0FKYixFQUlnQixNQUpoQixDQURKO0FBT0E7QUFDQSxRQUFJLGNBQWMsSUFBSSxLQUFLLFdBQVQsQ0FBcUIsV0FBckIsQ0FBbEI7QUFDQSxXQUFPLFdBQVA7QUFDSDs7QUFFRDtBQUNBLFNBQVMsZ0JBQVQsR0FBNEI7QUFDeEIsUUFBSSxjQUNBLENBQ0ksQ0FBQyxDQURMLEVBQ1EsQ0FEUixFQUNXLENBRFgsRUFDYyxDQURkLEVBQ2lCLEdBRGpCLEVBRUksQ0FGSixFQUVPLENBQUMsQ0FGUixFQUVXLENBRlgsRUFFYyxDQUZkLEVBRWlCLEdBRmpCLEVBR0ksQ0FISixFQUdPLENBSFAsRUFHVSxDQUFDLENBSFgsRUFHYyxDQUhkLEVBR2lCLEdBSGpCLEVBSUksQ0FKSixFQUlPLENBSlAsRUFJVSxDQUpWLEVBSWEsQ0FKYixFQUlnQixDQUpoQixDQURKO0FBT0E7QUFDQSxRQUFJLGNBQWMsSUFBSSxLQUFLLFdBQVQsQ0FBcUIsV0FBckIsQ0FBbEI7QUFDQSxXQUFPLFdBQVA7QUFDSDs7QUFFRDtBQUNBLFNBQVMsY0FBVCxDQUF3QixPQUF4QixFQUFpQztBQUM3QixRQUFJLENBQUo7QUFBQSxRQUFPLENBQVA7QUFBQSxRQUFVLElBQUksQ0FBZDtBQUNBLFFBQUksWUFBWSxPQUFoQjtBQUNBLFFBQUk7QUFDQSxZQUFJLFNBQVMsVUFBVSxNQUFWLENBQWlCLENBQWpCLEVBQW9CLENBQXBCLENBQVQsRUFBaUMsRUFBakMsSUFBdUMsR0FBM0M7QUFDQSxZQUFJLFNBQVMsVUFBVSxNQUFWLENBQWlCLENBQWpCLEVBQW9CLENBQXBCLENBQVQsRUFBaUMsRUFBakMsSUFBdUMsR0FBM0M7QUFDQSxZQUFJLFNBQVMsVUFBVSxNQUFWLENBQWlCLENBQWpCLEVBQW9CLENBQXBCLENBQVQsRUFBaUMsRUFBakMsSUFBdUMsR0FBM0M7QUFDSCxLQUpELENBSUUsT0FBTyxDQUFQLEVBQVU7QUFBRSxXQUFHLENBQUgsRUFBTSxJQUFJLENBQVY7QUFBYzs7QUFFNUIsUUFBSSxjQUNBLENBQ0ksQ0FESixFQUNPLENBRFAsRUFDVSxDQURWLEVBQ2EsQ0FEYixFQUNnQixDQURoQixFQUNtQjtBQUNmLEtBRkosRUFFTyxDQUZQLEVBRVUsQ0FGVixFQUVhLENBRmIsRUFFZ0IsQ0FGaEIsRUFFbUI7QUFDZixLQUhKLEVBR08sQ0FIUCxFQUdVLENBSFYsRUFHYSxDQUhiLEVBR2dCLENBSGhCLEVBR21CO0FBQ2YsS0FKSixFQUlPLENBSlAsRUFJVSxDQUpWLEVBSWEsQ0FKYixFQUlnQixDQUpoQixDQURKO0FBT0E7QUFDQSxRQUFJLGNBQWMsSUFBSSxLQUFLLFdBQVQsQ0FBcUIsV0FBckIsQ0FBbEI7QUFDQSxXQUFPLFdBQVA7QUFDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipUaGlzIGNsYXNzIGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGJ5IExheWFBaXJJREUsIHBsZWFzZSBkbyBub3QgbWFrZSBhbnkgbW9kaWZpY2F0aW9ucy4gKi9cclxuaW1wb3J0IE1haW5TY3JpcHQgZnJvbSBcIi4vc2NyaXB0L01haW5TY3JpcHRcIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNvbmZpZyB7XHJcbiAgICBzdGF0aWMgaW5pdCgpIHtcclxuICAgICAgICAvL+azqOWGjFNjcmlwdOaIluiAhVJ1bnRpbWXlvJXnlKhcclxuICAgICAgICBsZXQgcmVnID0gTGF5YS5DbGFzc1V0aWxzLnJlZ0NsYXNzO1xyXG5cdFx0cmVnKFwic2NyaXB0L01haW5TY3JpcHQuanNcIixNYWluU2NyaXB0KTtcclxuICAgIH1cclxufVxyXG5HYW1lQ29uZmlnLndpZHRoID0gMTI4MDtcclxuR2FtZUNvbmZpZy5oZWlnaHQgPSA3MjA7XHJcbkdhbWVDb25maWcuc2NhbGVNb2RlID1cInNob3dhbGxcIjtcclxuR2FtZUNvbmZpZy5zY3JlZW5Nb2RlID0gXCJub25lXCI7XHJcbkdhbWVDb25maWcuYWxpZ25WID0gXCJ0b3BcIjtcclxuR2FtZUNvbmZpZy5hbGlnbkggPSBcImxlZnRcIjtcclxuR2FtZUNvbmZpZy5zdGFydFNjZW5lID0gXCJtYWluU2NlbmVzLnNjZW5lXCI7XHJcbkdhbWVDb25maWcuc2NlbmVSb290ID0gXCJcIjtcclxuR2FtZUNvbmZpZy5kZWJ1ZyA9IGZhbHNlO1xyXG5HYW1lQ29uZmlnLnN0YXQgPSBmYWxzZTtcclxuR2FtZUNvbmZpZy5waHlzaWNzRGVidWcgPSBmYWxzZTtcclxuR2FtZUNvbmZpZy5leHBvcnRTY2VuZVRvSnNvbiA9IHRydWU7XHJcblxyXG5HYW1lQ29uZmlnLmluaXQoKTtcclxuIiwiaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4vR2FtZUNvbmZpZ1wiO1xyXG5jbGFzcyBNYWluIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdC8v5qC55o2uSURF6K6+572u5Yid5aeL5YyW5byV5pOOXHRcdFxyXG5cdFx0aWYgKHdpbmRvd1tcIkxheWEzRFwiXSkgTGF5YTNELmluaXQoR2FtZUNvbmZpZy53aWR0aCwgR2FtZUNvbmZpZy5oZWlnaHQpO1xyXG5cdFx0ZWxzZSBMYXlhLmluaXQoR2FtZUNvbmZpZy53aWR0aCwgR2FtZUNvbmZpZy5oZWlnaHQsIExheWFbXCJXZWJHTFwiXSk7XHJcblx0XHRMYXlhW1wiUGh5c2ljc1wiXSAmJiBMYXlhW1wiUGh5c2ljc1wiXS5lbmFibGUoKTtcclxuXHRcdExheWFbXCJEZWJ1Z1BhbmVsXCJdICYmIExheWFbXCJEZWJ1Z1BhbmVsXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBHYW1lQ29uZmlnLnNjYWxlTW9kZTtcclxuXHRcdExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9IEdhbWVDb25maWcuc2NyZWVuTW9kZTtcclxuXHRcdExheWEuc3RhZ2UuYWxpZ25WID0gR2FtZUNvbmZpZy5hbGlnblY7XHJcblx0XHRMYXlhLnN0YWdlLmFsaWduSCA9IEdhbWVDb25maWcuYWxpZ25IO1xyXG5cdFx0Ly/lhbzlrrnlvq7kv6HkuI3mlK/mjIHliqDovb1zY2VuZeWQjue8gOWcuuaZr1xyXG5cdFx0TGF5YS5VUkwuZXhwb3J0U2NlbmVUb0pzb24gPSBHYW1lQ29uZmlnLmV4cG9ydFNjZW5lVG9Kc29uO1xyXG5cclxuXHRcdC8v5omT5byA6LCD6K+V6Z2i5p2/77yI6YCa6L+HSURF6K6+572u6LCD6K+V5qih5byP77yM5oiW6ICFdXJs5Zyw5Z2A5aKe5YqgZGVidWc9dHJ1ZeWPguaVsO+8jOWdh+WPr+aJk+W8gOiwg+ivlemdouadv++8iVxyXG5cdFx0aWYgKEdhbWVDb25maWcuZGVidWcgfHwgTGF5YS5VdGlscy5nZXRRdWVyeVN0cmluZyhcImRlYnVnXCIpID09IFwidHJ1ZVwiKSBMYXlhLmVuYWJsZURlYnVnUGFuZWwoKTtcclxuXHRcdGlmIChHYW1lQ29uZmlnLnBoeXNpY3NEZWJ1ZyAmJiBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXSkgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0uZW5hYmxlKCk7XHJcblx0XHRpZiAoR2FtZUNvbmZpZy5zdGF0KSBMYXlhLlN0YXQuc2hvdygpO1xyXG5cdFx0TGF5YS5hbGVydEdsb2JhbEVycm9yID0gdHJ1ZTtcclxuXHJcblx0XHQvL+a/gOa0u+i1hOa6kOeJiOacrOaOp+WItu+8jHZlcnNpb24uanNvbueUsUlEReWPkeW4g+WKn+iDveiHquWKqOeUn+aIkO+8jOWmguaenOayoeacieS5n+S4jeW9seWTjeWQjue7rea1geeoi1xyXG5cdFx0TGF5YS5SZXNvdXJjZVZlcnNpb24uZW5hYmxlKFwidmVyc2lvbi5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vblZlcnNpb25Mb2FkZWQpLCBMYXlhLlJlc291cmNlVmVyc2lvbi5GSUxFTkFNRV9WRVJTSU9OKTtcclxuXHR9XHJcblxyXG5cdG9uVmVyc2lvbkxvYWRlZCgpIHtcclxuXHRcdC8v5r+A5rS75aSn5bCP5Zu+5pig5bCE77yM5Yqg6L295bCP5Zu+55qE5pe25YCZ77yM5aaC5p6c5Y+R546w5bCP5Zu+5Zyo5aSn5Zu+5ZCI6ZuG6YeM6Z2i77yM5YiZ5LyY5YWI5Yqg6L295aSn5Zu+5ZCI6ZuG77yM6ICM5LiN5piv5bCP5Zu+XHJcblx0XHRMYXlhLkF0bGFzSW5mb01hbmFnZXIuZW5hYmxlKFwiZmlsZWNvbmZpZy5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkNvbmZpZ0xvYWRlZCkpO1xyXG5cdH1cclxuXHJcblx0b25Db25maWdMb2FkZWQoKSB7XHJcblx0XHQvL+WKoOi9vUlEReaMh+WumueahOWcuuaZr1xyXG5cdFx0R2FtZUNvbmZpZy5zdGFydFNjZW5lICYmIExheWEuU2NlbmUub3BlbihHYW1lQ29uZmlnLnN0YXJ0U2NlbmUpO1xyXG5cdH1cclxufVxyXG4vL+a/gOa0u+WQr+WKqOexu1xyXG5uZXcgTWFpbigpO1xyXG4iLCIvL01haW5TY3JpcHQuanNcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFpblNjcmlwdCBleHRlbmRzIExheWEuU2NyaXB0IHtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyBzdXBlcigpOyB9XHJcbiAgICBvbkVuYWJsZSgpIHtcclxuICAgICAgICBMYXlhLnN0YWdlLmJnQ29sb3IgPSAnIzk5YjRkMSc7XHJcbiAgICAgICAgdmFyIGNhcjEgPSB0aGlzLm93bmVyLmdldENoaWxkQnlOYW1lKCdjYXIxJyk7XHJcbiAgICAgICAgdmFyIGNhcjIgPSB0aGlzLm93bmVyLmdldENoaWxkQnlOYW1lKCdjYXIyJyk7XHJcbiAgICAgICAgdmFyIGNhcjMgPSB0aGlzLm93bmVyLmdldENoaWxkQnlOYW1lKCdjYXIzJyk7XHJcbiAgICAgICAgdmFyIGNhcjQgPSB0aGlzLm93bmVyLmdldENoaWxkQnlOYW1lKCdjYXI0Jyk7XHJcbiAgICAgICAgdmFyIGNhcjUgPSB0aGlzLm93bmVyLmdldENoaWxkQnlOYW1lKCdjYXI1Jyk7XHJcbiAgICAgICAgdmFyIGNhcjYgPSB0aGlzLm93bmVyLmdldENoaWxkQnlOYW1lKCdjYXI2Jyk7XHJcbiAgICAgICAgdmFyIGNhcjcgPSB0aGlzLm93bmVyLmdldENoaWxkQnlOYW1lKCdjYXI3Jyk7XHJcbiAgICAgICAgdmFyIGNhcjggPSB0aGlzLm93bmVyLmdldENoaWxkQnlOYW1lKCdjYXI4Jyk7XHJcbiAgICAgICAgdmFyIGNhcjkgPSB0aGlzLm93bmVyLmdldENoaWxkQnlOYW1lKCdjYXI5Jyk7XHJcbiAgICAgICAgdmFyIGNhcjEwID0gdGhpcy5vd25lci5nZXRDaGlsZEJ5TmFtZSgnY2FyMTAnKTtcclxuICAgICAgICB2YXIgY2FyMTEgPSB0aGlzLm93bmVyLmdldENoaWxkQnlOYW1lKCdjYXIxMScpO1xyXG4gICAgICAgIHZhciBjYXIxMiA9IHRoaXMub3duZXIuZ2V0Q2hpbGRCeU5hbWUoJ2NhcjEyJyk7XHJcbiAgICAgICAgLy/kv67mlLnkuq7luqZcclxuICAgICAgICBjYXIxLmZpbHRlcnMgPSBbZ2V0QnJpZ2h0RmlsdGVyKC0xMDApXTtcclxuICAgICAgICBjYXIyLmZpbHRlcnMgPSBbZ2V0QnJpZ2h0RmlsdGVyKDEwMCldO1xyXG4gICAgICAgIC8v5Y+N6Imy5pi+56S6XHJcbiAgICAgICAgY2FyMy5maWx0ZXJzID0gW2dldEludmVyc2VGaWx0ZXIoKV07XHJcbiAgICAgICAgLy/loavlhYXpopzoibJcclxuICAgICAgICBjYXI0LmZpbHRlcnMgPSBbZ2V0Q29sb3JGaWx0ZXIoXCIjREU2NTUyXCIpXTsvL+e6ouiJslxyXG4gICAgICAgIGNhcjUuZmlsdGVycyA9IFtnZXRDb2xvckZpbHRlcihcIiM1ZDg4NDNcIildOy8v57u/6ImyXHJcbiAgICAgICAgY2FyNi5maWx0ZXJzID0gW2dldENvbG9yRmlsdGVyKFwiIzk5YjRkMVwiKV07Ly/ok53oibJcclxuICAgICAgICAvL+iuvue9rumYtOW9sea7pOmVnFxyXG4gICAgICAgIHZhciBzaGFkZUZpbHRlciA9IG5ldyBMYXlhLkdsb3dGaWx0ZXIoXCIjMDAwMDAwXCIsIDgsIDgsIDgpO1xyXG4gICAgICAgIGNhcjcuZmlsdGVycyA9IFtzaGFkZUZpbHRlcl07XHJcbiAgICAgICAgLy/liJvlu7rkuIDkuKrlj5HlhYnmu6TplZxcclxuICAgICAgICB2YXIgZ2xvd0ZpbHRlciA9IG5ldyBMYXlhLkdsb3dGaWx0ZXIoXCIjZmZmZjAwXCIsIDEwLCAwLCAwKTtcclxuICAgICAgICBjYXI4LmZpbHRlcnMgPSBbZ2xvd0ZpbHRlcl07XHJcbiAgICAgICAgLy/liJvlu7rkuIDkuKrmqKHns4rmu6TplZxcclxuICAgICAgICB2YXIgYmx1ckZpbHRlciA9IG5ldyBMYXlhLkJsdXJGaWx0ZXIoNSk7XHJcbiAgICAgICAgY2FyOS5maWx0ZXJzID0gW2JsdXJGaWx0ZXJdO1xyXG4gICAgICAgIC8v5o+Q6auY5Lqu5bqm44CB5Y+N6Imy44CB5aGr5YWF6aKc6ImyXHJcbiAgICAgICAgY2FyMTAuZmlsdGVycyA9IFtnZXRCcmlnaHRGaWx0ZXIoMTAwKSwgZ2V0SW52ZXJzZUZpbHRlcigpLCBnZXRDb2xvckZpbHRlcihcIiNERTY1NTJcIildO1xyXG4gICAgICAgIC8v5aGr5YWF6aKc6Imy44CB5Y+g5Yqg5Y+R5YWJ5ZKM6Zi05b2xXHJcbiAgICAgICAgY2FyMTEuZmlsdGVycyA9IFtnZXRDb2xvckZpbHRlcihcIiNlZmFiY2RcIiksIHNoYWRlRmlsdGVyLCBnbG93RmlsdGVyXTtcclxuICAgIH1cclxufVxyXG5cclxuLyoq6I635Y+W5Lqu5bqm5ruk6ZWcICovXHJcbmZ1bmN0aW9uIGdldEJyaWdodEZpbHRlcihvZmZzZXQpIHtcclxuICAgIHZhciBjb2xvck1hdHJpeCA9XHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICAxLCAwLCAwLCAwLCBvZmZzZXQsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsIDAsIG9mZnNldCxcclxuICAgICAgICAgICAgMCwgMCwgMSwgMCwgb2Zmc2V0LFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxLCBvZmZzZXQsXHJcbiAgICAgICAgXTtcclxuICAgIC8v5Yib5bu66aKc6Imy5ruk6ZWcXHJcbiAgICB2YXIgY29sb3JGaWx0ZXIgPSBuZXcgTGF5YS5Db2xvckZpbHRlcihjb2xvck1hdHJpeCk7XHJcbiAgICByZXR1cm4gY29sb3JGaWx0ZXI7XHJcbn1cclxuXHJcbi8qKuiOt+WPluWPjeiJsua7pOmVnCAqL1xyXG5mdW5jdGlvbiBnZXRJbnZlcnNlRmlsdGVyKCkge1xyXG4gICAgdmFyIGNvbG9yTWF0cml4ID1cclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC0xLCAwLCAwLCAwLCAyNTUsXHJcbiAgICAgICAgICAgIDAsIC0xLCAwLCAwLCAyNTUsXHJcbiAgICAgICAgICAgIDAsIDAsIC0xLCAwLCAyNTUsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDEsIDAsXHJcbiAgICAgICAgXTtcclxuICAgIC8v5Yib5bu66aKc6Imy5ruk6ZWcXHJcbiAgICB2YXIgY29sb3JGaWx0ZXIgPSBuZXcgTGF5YS5Db2xvckZpbHRlcihjb2xvck1hdHJpeCk7XHJcbiAgICByZXR1cm4gY29sb3JGaWx0ZXI7XHJcbn1cclxuXHJcbi8qKuiOt+WPluminOiJsuWhq+WFhSAqL1xyXG5mdW5jdGlvbiBnZXRDb2xvckZpbHRlcihyZ2JDb2RlKSB7XHJcbiAgICB2YXIgciwgZywgYiA9IDE7XHJcbiAgICB2YXIgcmdiU3RyaW5nID0gcmdiQ29kZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgciA9IHBhcnNlSW50KHJnYlN0cmluZy5zdWJzdHIoMSwgMiksIDE2KSAvIDI1NTtcclxuICAgICAgICBnID0gcGFyc2VJbnQocmdiU3RyaW5nLnN1YnN0cigzLCAyKSwgMTYpIC8gMjU1O1xyXG4gICAgICAgIGIgPSBwYXJzZUludChyZ2JTdHJpbmcuc3Vic3RyKDUsIDIpLCAxNikgLyAyNTU7XHJcbiAgICB9IGNhdGNoIChlKSB7IHIsIGcsIGIgPSAxOyB9O1xyXG5cclxuICAgIHZhciBjb2xvck1hdHJpeCA9XHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICByLCAwLCAwLCAwLCAwLCAvL1JcclxuICAgICAgICAgICAgMCwgZywgMCwgMCwgMCwgLy9HXHJcbiAgICAgICAgICAgIDAsIDAsIGIsIDAsIDAsIC8vQlxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxLCAwLCAvL0FcclxuICAgICAgICBdO1xyXG4gICAgLy/liJvlu7rpopzoibLmu6TplZxcclxuICAgIHZhciBjb2xvckZpbHRlciA9IG5ldyBMYXlhLkNvbG9yRmlsdGVyKGNvbG9yTWF0cml4KTtcclxuICAgIHJldHVybiBjb2xvckZpbHRlcjtcclxufSJdfQ==
