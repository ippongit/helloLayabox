//是否使用IDE自带的node环境和插件，设置false后，则使用自己环境(使用命令行方式执行)
let useIDENode = process.argv[0].indexOf("LayaAir") > -1 ? true : false;
//获取Node插件和工作路径
let ideModuleDir = useIDENode ? process.argv[1].replace("gulp\\bin\\gulp.js", "").replace("gulp/bin/gulp.js", "") : "";
let workSpaceDir = useIDENode ? process.argv[2].replace("--gulpfile=", "").replace("\\server\\gulpfile.js", "").replace("/server/gulpfile.js", "")+"/" : "./../";

var ssoAccessToken = useIDENode ? process.argv[4].replace("--logintoken=",""):"";
//console.log('useIDENode=', useIDENode, 'ideModuleDir=', ideModuleDir, 'workSpaceDir=', workSpaceDir, process.argv);


var gulp = require(ideModuleDir + 'gulp');
var fs = require('fs');
var request = require(ideModuleDir + 'request');
var zip = require(ideModuleDir + 'gulp-zip');
var gulpSequence = require(ideModuleDir + 'gulp-sequence');
var crypto = require("crypto");
var decompress = require(ideModuleDir + "decompress");
var path = require('path');
var cp = require('child_process');

var api_root = 'https://api.masteropen.layabox.com/';
var dev_center_root = 'https://developers.masteropen.layabox.com/';
var uploadUrl = dev_center_root + 'game/uploadgamefile';
var deploy_to_layacloud_upload_url = dev_center_root + 'game/uploadproductiongamefile';
var download_root = 'http://download.cloud.layabox.com/';
var algo = 'sha256';

var developer_uid = 0;
var accessToken = '';

var projectPath = workSpaceDir;

var serverCompilePath = projectPath + '/server/bin';
var serverZipFileName = 'server.zip';
var serverPackagePath = serverCompilePath + '/' + serverZipFileName;

let browserify = require(ideModuleDir + "browserify");
let source_stream = require(ideModuleDir + "vinyl-source-stream");
let tsify = require(ideModuleDir + "tsify");
var Stream = require('stream');

function getConfig(path){
    try{
        return JSON.parse(fs.readFileSync(path));
    }catch (e){
        return null;
    }
}

function compileas(config, cb){

    var projectInfo = getConfig(projectPath +'/layacloud.json');
    
    cp.exec(`"${workSpaceDir}/client/.laya/layajs" "${workSpaceDir}/server/asconfig.json";iflash=false;windowshow=false;chromerun=false;quickcompile=true;subpath=;out=.laya/temp.js`,
		function (error, stdout, stderr) {
			//console.log(`stdout: ${stdout}`);
			//console.log(`stderr: ${stderr}`);
			if (error !== null) {
				console.error(`编译出错: ${error}`);
			}else{                
                var asconfig = getConfig(projectPath +'/server/asconfig.json');
                var source = fs.readFileSync(projectPath+'/server/.laya/temp.js');
                source += '';
                var reg = new RegExp("extends laya.cloud.ServerScriptBase\\s+var\\s(\\w+)=\\(function\\(_super\\)({[\\s\\S]*?})\\)\\(ServerScriptBase\\)?","g");
                var match;
                var classes = [];
                while (match = reg.exec(source)){
                    var classname = match[1];
                    var classcontent = match[2];
                    classes.push(classname);
                    //console.log('class=', classname);
                    //console.log('class content=', classcontent);
                    classcontent = classcontent.substring(classcontent.indexOf('Laya.imps(__proto,{"laya.cloud.IServerScript":true})')+52, classcontent.lastIndexOf('return'));
                    classcontent = classcontent.replace(/__proto\.(\w+)=function/g, function(matched, funname, index, input){
                        //console.log(arguments);
                        return 'function '+funname;
                    });
                    fs.writeFileSync(serverCompilePath + '/' + classname + '.js', classcontent);
                }

                if (classes.indexOf(config.default_room) == -1){
                    console.log('默认房间['+config.default_room+']的脚本不存在, 将使用默认帧同步服务逻辑');
                }

                for (var k in config.room_define){
                    if (classes.indexOf(k) == -1){
                        console.log('房间类型['+k+']的脚本不存在, 将使用默认帧同步服务逻辑');
                    }
                }

                if (fs.existsSync(serverCompilePath + '/ascon.max.js')){
                    fs.unlinkSync(serverCompilePath + '/ascon.max.js');
                }
                if (fs.existsSync(serverCompilePath + '/index.html')){
                    fs.unlinkSync(serverCompilePath + '/index.html');
                }                
                console.log('编译完成');
                cb();
			}
		}
	)
}

function compilets(config, cb){
    var myfork = cp.fork(ideModuleDir +"/typescript/bin/tsc", ['-p', projectPath + 'server/', '--outDir', projectPath + 'server/bin'], {
        silent: true
    });
    myfork.stdout.on("data", (data) => {
        console.log(data + "");
    });
    myfork.stderr.on("data", (err) => { // 出错
        console.log("编译出错", err + "");
    });
    myfork.on("close", (code) => { // 出错
        if (0===code){
            var scripts = [config.default_room];
            for (var k in config.room_define){
                scripts.push(k);
            }
            function merge(script){
                //console.log(arguments);
                var stream = new Stream.Transform({objectMode: true});
                //console.log(stream);
                stream._transform = function (originalFile, unused, callback) {       
                    if (!this.sourceCode) {
                        var headCode = 'var layacloud=this;\nvar laya={cloud:{ServerScriptBase:null}};\n'
                        this.sourceCode = headCode;
                        this.push(headCode);
                    }
                    originalFile = originalFile.toString().replace('return '+script, 'layacloud.'+script+'='+script+';\n\treturn '+script+';');
                    this.sourceCode += originalFile;
                    this.push(originalFile);
                    callback();
                }
                stream._flush=function(callback){
                    var reg = /var\s(\w+)\s=\s\/\*\*\s@class\s\*\/\s\(function \(_super\)\s({[\s\S]*?})\(laya.cloud.ServerScriptBase\)\);/g
                    var match;
                    var classes = [];
                    var attachedCode = 'var layacloud=this;\n';
                    while (match = reg.exec(this.sourceCode)){
                        var classname = match[1];
                        var classcontent = match[2];

                        classes.push(classname);

                        var funMatch;
                        var regFun = /(\w+)\.prototype\.(\w+)\s=\sfunction\s/g;
                        while (funMatch = regFun.exec(classcontent)){
                            var funname = funMatch[2];
                            attachedCode += 'function '+funname+'(){\n';
                            attachedCode += '\t'+classname+'instance.'+funname+'.apply(this, arguments)';
                            attachedCode += '}\n'
                            //console.log(funname);
                        }
                        attachedCode += 'var '+classname+'instance = new '+classname+'()';
                    }
                    this.push(attachedCode);
                    callback();
                }
                return stream;
            }
            var finishedCompileScript = [];
            for (var index in scripts){
                var script = scripts[index];
                browserify({
                    entries: [serverCompilePath + '/' + script + '.js']
                }).bundle()
                .pipe(merge(script))
                //使用source把输出文件命名为bundle.js
                .pipe(source_stream(script + '.js'))
                //把bundle.js复制到bin/js目录
                
                .pipe(gulp.dest(serverCompilePath))
                .pipe(function(){
                    var stream = new Stream.Transform({objectMode: true});
                    stream._transform = function (originalFile, unused, callback) {
                        callback();
                    };
                    stream._flush=function(callback){
                        callback();
                        finishedCompileScript.push(script);
                        if (finishedCompileScript.length == scripts.length){
                            console.log('编译完成');
                            cb();
                        } 
                    }
                                       
                    return stream;
                }())
                ;                
            }
        }
    });
}

function compilejs(config, cb){
    
    console.log('编译完成');
    return gulp.src([projectPath+'/server/src/*.js'])
    .pipe(gulp.dest(serverCompilePath));
}


gulp.task('default', function(){
    //默认任务
    console.log('default task, nothing will be done.');
});

gulp.task('compile', function(cb){

    //解析config.json，并保存到输出目录
    var config = getConfig(projectPath + '/server/src/config.json');
    if (null == config){
        throw new Error('服务端配置文件['+projectPath + '/server/src/config.json'+']错误');
    }

    //检查config的合法性
    if ('game_id' in config && 'version' in config && 'default_room' in config && 'room_define' in config){
        //修改版本号，并放到输出目录
        var versions = config.version.split('.');
        var major = parseInt(versions[0]);
        var minor = parseInt(versions[1]);
        var build = parseInt(versions[2]);
        config.version = major+'.'+minor+'.'+(++build);
        //写回源文件
        fs.writeFileSync(projectPath + '/server/src/config.json', JSON.stringify(config, null, 4));
        //写入输出文件
        if (!fs.existsSync(serverCompilePath)){
            fs.mkdirSync(serverCompilePath);
        }
        fs.writeFileSync(serverCompilePath + '/config.json', JSON.stringify(config));
    }else{
        throw new Error('服务端配置文件['+projectPath + '/server/src/config.json'+']错误');
    }

    projectInfo = getConfig(projectPath +'/layacloud.json');
    
    console.log('开始编译...');
    switch (projectInfo.lang){
        case 'as':
            compileas(config, cb);
            break;
        case 'ts':
            compilets(config, cb);
            break;
        case 'js':
            return compilejs(config);
            break;
        default:
            throw new Error('配置文件['+projectPath + '/layacloud.json'+']中的语言类型[lang]错误');
            break;
    }

    
});

gulp.task('package', function(){
    //如果原来zip存在, 删除
    if (fs.existsSync(serverPackagePath)){
        fs.unlinkSync(serverPackagePath);
    }
    
    console.log('打包完成');
    return gulp.src([serverCompilePath+'/*.json', serverCompilePath+'/*.js'])
    .pipe(zip(serverZipFileName))
    .pipe(gulp.dest(serverCompilePath));

});

function _uploadTask(cb){
    var projectInfo = getConfig(projectPath + '/layacloud.json');

    checkAuth(function(data){
        var blocksize = 1024 * 1;
        var file = {
            blockcount:1,
            index:0,
            fileName : 'server.zip'
        }
        var config = getConfig(serverCompilePath + '/config.json');
        var version = config.version;
        var formData = {};
        formData['game_version'] = version;
        formData['appid'] = projectInfo.appid;
        formData['developer_uid'] = developer_uid;
        formData['access_token'] = accessToken;

        formData['server_index'] = file.index;
        formData['server_filename'] = file.fileName;
        formData['server_total'] = 1;
        formData['server'] = fs.createReadStream(serverPackagePath);
        request.post({url:uploadUrl,formData:formData}, function(err, response, body){
            //console.log(err, response, body);
            if (err){
                throw err;
            }
            var result = JSON.parse(body);
            if (result.ret == 0){
                console.log('上传成功');
                cb();
            }else{
                if (result.ret == 156){
                    console.log('正在开通云端测试...')
                    //没有开通云端测试, 尝试开通
                    callDevCenterAPI('game/opencloudtest', {
                        appid: projectInfo.appid
                    }, function(err, response, body){
                        if (err){
                            throw err;
                        }
                        var openCloudResult = JSON.parse(body);
                        //console.log(body);
                        if(openCloudResult.ret == 151) {
                            throw new Error("云端测试配额已用完");
                        } else if(openCloudResult.ret == 159){
                            throw new Error("你购买云端测试产品需要续费");
                        } else if(openCloudResult.ret == 160){
                            throw new Error("你开通云端测试产品游戏个数超出限制");
                        } else {
                            console.log('开通云端测试中...');
                            checkStatusCount = 0;
                            checkStatus(cb);
                        }
                    });
                }
                else{
                    throw new Error(result.ret+':'+result.msg);
                } 
            }
        });
    });
}

gulp.task('uploadTask', function(cb){
    _uploadTask(cb);
});

gulp.task('deploy_to_layacloud', function(cb){
    //console.log('说明');
    gulpSequence('compile', 'package', 'deploy_to_layacloud_task', cb);
});

gulp.task('deploy_to_layacloud_task', function(cb){
    var projectInfo = getConfig(projectPath + '/layacloud.json');

    checkAuth(function(data){
        var blocksize = 1024 * 1;
        var file = {
            blockcount:1,
            index:0,
            fileName : 'server.zip'
        }
        var config = getConfig(serverCompilePath + '/config.json');
        var version = config.version;
        var formData = {};
        formData['game_version'] = version;
        formData['appid'] = projectInfo.appid;
        formData['developer_uid'] = developer_uid;
        formData['access_token'] = accessToken;

        formData['server_index'] = file.index;
        formData['server_filename'] = file.fileName;
        formData['server_total'] = 1;
        formData['server'] = fs.createReadStream(serverPackagePath);
        request.post({url:deploy_to_layacloud_upload_url,formData:formData}, function(err, response, body){
            //console.log(err, response, body);
            if (err){
                throw err;
            }
            var result = JSON.parse(body);
            if (result.ret == 0){
                console.log('上传成功');
                cb();
            }else{
                // if (result.ret == 156){
                //     console.log('正在开通云端测试...')
                //     //没有开通云端测试, 尝试开通
                //     callDevCenterAPI('game/opencloudtest', {
                //         appid: projectInfo.appid
                //     }, function(err, response, body){
                //         if (err){
                //             throw err;
                //         }
                //         var openCloudResult = JSON.parse(body);
                //         //console.log(body);
                //         if(openCloudResult.ret == 151) {
                //             throw new Error("云端测试配额已用完");
                //         } else if(openCloudResult.ret == 159){
                //             throw new Error("你购买云端测试产品需要续费");
                //         } else if(openCloudResult.ret == 160){
                //             throw new Error("你开通云端测试产品游戏个数超出限制");
                //         } else {
                //             console.log('开通云端测试中...');
                //             checkStatusCount = 0;
                //             checkStatus(cb);
                //         }
                //     });
                // }
                // else{
                    throw new Error(result.ret+':'+result.msg);
                // } 
            }
        });
    });
});

var maxCheckStatusCount = 30;
var checkStatusCount = 0;
function checkStatus(cb){
    setTimeout(function(){
        console.log('检查云端测试开通状态...');
        if (checkStatusCount > maxCheckStatusCount){
            throw new Error('云端测试开通失败');
        }
        checkStatusCount++;
        var projectInfo = getConfig(projectPath +'/layacloud.json');
        callDevCenterAPI('game/getgamebygid',{
            'appid':projectInfo.appid
        },function(err, response, body){
            if (err){
                throw err;
            }
            var data = JSON.parse(body);
            //console.log(body);
            if(data.ret == 0 && data.data.cloudtest_status == 2) {
                _uploadTask(cb);
            } else {
                checkStatus(cb);
            }
        });
    }, 1000)
}

gulp.task('upload', function(cb){
    gulpSequence('compile', 'package', 'uploadTask', cb);
});

gulp.task('checklocaldebugupdate', function(cb){
    console.log('正在检查本地调试服务器更新...');
    var localDebugUrl = download_root + 'localdebug.zip';
    var localDebugHashUrl = download_root + 'localdebug.hash';
    var localDebugDir = ideModuleDir+'../out/layarepublic/layaCloud/localdebug';
    var hashFile = localDebugDir + '/hash.txt';
    var fullPath = localDebugDir + '/localdebug.zip';
    request(localDebugHashUrl, function(error, response, remote_hash){
        var hash = '';
        if (fs.existsSync(hashFile)){
            hash = fs.readFileSync(hashFile)+'';
        }

        if (hash.toUpperCase() != remote_hash.toUpperCase()){
            console.log('正在更新调试服务器...');
            if (!fs.existsSync(localDebugDir)){
                fs.mkdirSync(localDebugDir);
            }
            var stream = fs.createWriteStream(fullPath);
            request(localDebugUrl).on('error', function(e){
                cb(e);
            }).pipe(stream).on('close', function () {
                const shasum = crypto.createHash(algo);
                const file  = fs.createReadStream(fullPath);
                file.on('data', function (d) {
                    shasum.update(d);
                }).on('end', function () {
                    const d = shasum.digest('hex');
                    //console.log('calc file sha256:',d, ', expected is: ', hash);
                    if(d.toUpperCase() == remote_hash.toUpperCase()){
                        //hash校验通过，返回下载成功
                        //解压缩
                        
                        decompress(fullPath, localDebugDir).then(function(files){
                            fs.writeFileSync(hashFile, remote_hash);
                            console.log('调试服务器更新完成');
                            cb();
                        }, function(err){
                            console.log('unzip error', err);
                            cb(err);
                        }).catch(function(e){
                            cb(e);
                        });
                        
                    }else{
                        //hash校验不通过，返回下载失败
                        cb(new Error('下载本地调试服务器校验失败'));
                    }
                });
            });
        }else{
            console.log('调试服务器已经是最新版本');
            cb();
        }
    });
});

gulp.task('checksdkupdate', function(cb){
    console.log('正在检查SDK更新...');
    var projectInfo = getConfig(projectPath +'/layacloud.json');
    var hashUrl = download_root + 'layacloud_template_'+projectInfo.lang+'.hash';
    var resourceUrl = download_root + 'layacloud_template_'+projectInfo.lang+'.zip';
    request(hashUrl, function(error, response, remote_hash){
        if (!projectInfo.hash || projectInfo.hash.toUpperCase() != remote_hash.toUpperCase()){
            console.log('正在更新SDK...');
            var tempDownloadPath = path.resolve(__dirname, './tempdownload/');
            if (!fs.existsSync(tempDownloadPath)){
                fs.mkdirSync(tempDownloadPath);
            }
            var fullPath = tempDownloadPath + 'layacloud_template_'+projectInfo.lang+'.zip';
            var stream = fs.createWriteStream(fullPath);
            request(resourceUrl).on('error', function (e) {
                console.log(e);
                cb(new Error('下载SDK文件失败'));
            }).pipe(stream).on('close', function () {
                var shasum = crypto.createHash(algo);
                var file = fs.createReadStream(fullPath);
                file.on('data', function (d) {
                    shasum.update(d);
                }).on('end', function () {
                    var d = shasum.digest('hex');
                    //console.log('calc file sha256:', d, ', expected is: ', remote_hash);
                    if (d.toUpperCase() == remote_hash.toUpperCase()) {
                        decompress(fullPath, projectPath, {
                            filter: file => (path.basename(file.path) != 'Main.'+projectInfo.lang) && 
                                (path.basename(file.path) != 'config.json') && 
                                (path.basename(file.path) != 'single.'+projectInfo.lang) && 
                                (path.basename(file.path) != 'common.'+projectInfo.lang)
                        }).then(function(files){
                            projectInfo.hash = remote_hash;
                            fs.writeFileSync(projectPath +'/layacloud.json', JSON.stringify(projectInfo));
                            console.log('SDK更新完成');
                            cb();
                        }, function(err){
                            console.log(err);
                            cb(err);
                        })["catch"](function (e) {
                            console.log(e);
                            cb(e);
                        });                        
                    }
                    else {
                        //hash校验不通过，返回下载失败
                        cb(new Error('模板文件校验失败'));
                    }
                });
            });
        }else{
            console.log('CloudSDK已经是最新版本');
            cb();
        }
    });
});

gulp.task('checkupdate', function(cb){
    console.log('正在检查更新...');
    gulpSequence('checklocaldebugupdate', 'checksdkupdate', cb);
});

gulp.task('debug', ['compile'], function(){
    var localDebugDir = ideModuleDir+'../out/layarepublic/layaCloud/localdebug';
    var pidFile = localDebugDir + '/pid';
    if (fs.existsSync(pidFile)){
        console.error('服务器正在运行, 请先停止之前运行的服务器');
        return;
    }
    console.log('正在启动调试服务...');
    var proc = cp.spawn(localDebugDir + '/gserver.exe', ['-debug=true','-path='+serverCompilePath], {
    });

    fs.appendFileSync(pidFile, proc.pid+'\n');
    proc.stdout.on('data', function(data){
        console.log(data+'');
    })

    proc.stderr.on('data', function(data){
        console.log(data+'');
    });
    
    proc.on('error', function(err){
        console.error(err);
    });

    proc.on('close', function(code){
        console.log('debug process exit with code: ' + code);
        if (fs.existsSync(pidFile)){
            fs.unlinkSync(pidFile);
        }        
        console.log('layacloud localdebug server closed.');
    });
});

gulp.task('run', ['compile'], function(){
    var localDebugDir = ideModuleDir+'../out/layarepublic/layaCloud/localdebug';
    var pidFile = localDebugDir + '/pid';
    if (fs.existsSync(pidFile)){
        console.error('服务器正在运行, 请先停止之前运行的服务器');
        return;
    }
    console.log('正在启动服务...')
    var proc = cp.spawn(localDebugDir+'/gserver.exe', ['-path='+serverCompilePath], {
    });
    fs.appendFileSync(pidFile, proc.pid+'\n');
    proc.stdout.on('data', function(data){
        console.log('' + data);
    })

    proc.stderr.on('data', function(data){
        console.log('' + data);
    });
    
    proc.on('close', function(code){
        console.log('run process exit with code: ' + code);
        if (fs.existsSync(pidFile)){
            fs.unlinkSync(pidFile);
        }
        console.log('layacloud localdebug server closed.');
    });
});

gulp.task('stop', function(cb){
    var localDebugDir = ideModuleDir+'../out/layarepublic/layaCloud/localdebug';
    var pidFile = localDebugDir + '/pid';
    if (fs.existsSync(pidFile)){
        var pids = fs.readFileSync(pidFile)+'';
        var array = pids.split('\n');
        var hasError = false;
        console.log('正在关闭调试服务器...');
        request.get({url:'http://127.0.0.1:16689/stop'}, function(err, response, body){
            if (err){
                console.error('关闭调试服务器失败, ', err);
                fs.unlinkSync(pidFile);
                console.log('layacloud localdebug server closed.');
                cb();
                return;
            }
            var ret = JSON.parse(body);
            if (ret.code==0){
                console.log('关闭调试服务器成功');
            }else{
                console.error('关闭调试服务器失败, code=', ret.code);
            }
            cb();
        });
        if (hasError){
            fs.unlinkSync(pidFile);
        }
    }else{
        console.log('layacloud localdebug server closed.');
        cb();
    }    
});

gulp.task('reloadscript', function(cb){
    console.log('正在重新加载脚本...');
    request.get({url:'http://127.0.0.1:16689/reloadscripts'}, function(err, response, body){
        if (err){
            console.error('重新加载脚本失败, ', err);
            cb();
            return;
        }
        var ret = JSON.parse(body);
        if (ret.code==0){
            console.log('重新加载脚本成功');
        }else{
            console.error('重新加载脚本失败, code=', ret.code);
        }
        cb();
    });
});

function checkAuth(callback){
    callAPI('sso', {'access_token':ssoAccessToken}, function(err, response, body){
        if (err){
            throw err;
        }
        var ssoResult = JSON.parse(body);
        //console.log('sso result:', ssoResult);
        if (ssoResult.ret == 0){
            var userInfo = JSON.parse(ssoResult.data.userInfo);
            try {
                userInfo.channelExt = JSON.parse(userInfo.channelExt);
            } catch (e){}
            callDevCenterAPI('auth/reg_login', {
                'userId':userInfo.userId,
                'username':userInfo.channelExt.username || userInfo.channelExt.mobile || userInfo.channelExt.email || userInfo.userId,
                'email':'',
                'mobile':'',
                'avatarUrl':''
            }, function(err, response, body){
                if (err){
                    throw err;
                }
                var devCenterResult = JSON.parse(body);                
                //console.log('dev result:', devCenterResult);
                if (devCenterResult.ret == 0){
                    developer_uid = devCenterResult.data.uid || devCenterResult.data.developer_uid;
                    accessToken = devCenterResult.data.token;

                    callback(devCenterResult.data);
                }else{
                    throw new Error(devCenterResult.ret+':'+devCenterResult.msg);                    
                }
            })
        }else{
            console.error('用户身份失效, 需要重新登录('+ssoResult.ret+':'+ssoResult.msg+')');
            console.error('laya_ide_relogin');
        }
    });
}


function callAPI(url, data, callback){
    request({url:api_root+url, qs:data}, callback);
}

function callDevCenterAPI(url, data, callback){
    data['developer_uid'] = developer_uid;
    data['access_token'] = accessToken;
    //console.log(dev_center_root+url, data);
    request({url:dev_center_root+url, qs:data}, callback);
}