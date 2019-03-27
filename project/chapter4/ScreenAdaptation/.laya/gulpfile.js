//是否使用IDE自带的node环境和插件，设置false后，则使用自己环境(使用命令行方式执行)
let useIDENode = process.argv[0].indexOf("LayaAir") > -1 ? true : false;
//获取Node插件和工作路径
let ideModuleDir = useIDENode ? process.argv[1].replace("gulp\\bin\\gulp.js", "").replace("gulp/bin/gulp.js", "") : "";
let workSpaceDir = useIDENode ? process.argv[2].replace("--gulpfile=", "").replace("\\.laya\\gulpfile.js", "").replace("/.laya/gulpfile.js", "") : "./../";

//引用插件模块
let gulp = require(ideModuleDir + "gulp");
let browserify = require(ideModuleDir + "browserify");
let source = require(ideModuleDir + "vinyl-source-stream");
var es2015 = require(ideModuleDir + 'babel-preset-es2015');

//使用browserify，转换es6到es5，并输出到bin/js目录
gulp.task("default", function () {
	return browserify({
		basedir: workSpaceDir,
		//是否开启调试，开启后会生成jsmap，方便调试es6源码，但会影响编译速度
		debug: true,
		entries: ['src/Main.js'],
		cache: {},
		packageCache: {}
	})
		//使用babel转换es6代码
		.transform(ideModuleDir + "babelify", { presets: [es2015] })
		.bundle()
		//使用source把输出文件命名为bundle.js
		.pipe(source('bundle.js'))
		//把bundle.js复制到bin/js目录
		.pipe(gulp.dest(workSpaceDir + "/bin/js"));
});