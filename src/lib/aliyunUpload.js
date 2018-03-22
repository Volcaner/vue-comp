import Zepto from 'zepto';
(function($) {
	$.AliyunUpload = function() {
		var self = this;
		var client;
		// var STS;
		// var urllib;
		// var Buffer;
		var OSS = require('ali-oss');

		// options;
		this.options = undefined;

		self.init = function(options) {
			// aliyun
			// var re='oss-cn-hangzhou';
			// var KeyId='LTAIuio3BmR3xlxV';
			// var KeySecret='SaNNLqkclS0UbU0HzqtR9m0r8tyx47';
			// var bu='ngsimage';
			
			// STS = OSS.STS;
			// var sts = new STS({
			// 	accessKeyId: options.accessKeyId,
			// 	accessKeySecret: options.accessKeySecret,
			// });
			
			// urllib = OSS.urllib;
			// Buffer = OSS.Buffer;
			// OSS = OSS.Wrapper;
			// STS = OSS.STS;

			// return urllib.request(window.location.host + '/yich/redev/getTst.php', {
			//         method: 'post'
			//     }).then(function(result) {
			//         var creds = JSON.parse(result.data);
			//         client = new OSS({
			//             region: region,
			//             accessKeyId: creds.key,
			//             accessKeySecret: creds.secret,
			//             stsToken: creds.token,
			//             bucket: bucket
			//         });
			//     }, function(error) {
			//     	console.log(error);
			//     });

			client = new OSS.Wrapper({
			    region: options.region,
			    accessKeyId: options.accessKeyId,
			    accessKeySecret: options.accessKeySecret,
			    stsToken: options.stsToken,
			    bucket: options.bucket,
			});

			self.options = options;
		}

		var _showTime = function() {
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth()+1;
			var day = date.getDate();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var second = date.getSeconds();
			var str=(year+''+month+''+day+''+hour+''+minute+''+second);
			return str;
		};

		/**
		 * [upload 上传单张图片]
		 * @param  {[type]}   fileFolder [description]
		 * @param  {[type]}   file       [description]
		 * @param  {Function} callback   [description]
		 * @return {[type]}              [description]
		 */
		self.upload = function(fileFolder, file, callback, progress, failCallback) {
		    console.log(fileFolder);
		    console.log(file.name);
		    var newname = stripscript(file.name);

		    var rs = '';
		    for (var i = 0; i < newname.length; i++) {
		        rs = rs + newname.substr(i, 1).replace(' ', '');
		    }
		    rs = _showTime() + "_" + rs;
		    var __src = fileFolder + rs;
		    // var newName = 
		    console.log(client);
		    client.multipartUpload(__src, file, {
		        progress: function*(val) {
		            if (progress) {
		                progress(val);
		            }
		        }
		    }).then(function(res) {
		        var imgurl = "http://ngsimage.oss-cn-hangzhou.aliyuncs.com/" + __src;
		        callback({
		            url: imgurl,
		            name: rs,
		        });
		    }).catch(function(error) {
		        console.log(error);
	        	failCallback(error);
		    });
		};

		var stripscript = function(s) { 
			var pattern = new RegExp("[`~!@#$^&*()=|{}':%;',\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]") 
			var rs = ""; 
			for (var i = 0; i < s.length; i++) { 
				rs = rs+s.substr(i, 1).replace(pattern, ''); 
			} 
			return rs;
		};

		/**
		 * [createList 创建文件夹（虚拟）]
		 * @param  {[type]}   fileFolder [description]
		 * @param  {Function} callback   [description]
		 * @return {[type]}              [description]
		 */
		self.createList = function(fileFolder, callback, failCallback) {
			client.put(fileFolder + "/", new OSS.Buffer(""))
				.then(function(object) {
					callback(object);
				}).catch(function(error) {
					console.log(error);
				 	failCallback(error);
				});  // new Buffer()
		};

		/**
		 * [getList 获取 文件夹下 所有文件]
		 * @param  {[type]}   fileFolder [description]
		 * @param  {Function} callback   [description]
		 * @return {[type]}              [description]
		 */
		self.getList = function(fileFolder, callback, failCallback) {
			client.list({
				prefix: fileFolder,
   				delimiter: '/'
			}).then(function(res) {
				var arrObj = [];
				if(res.objects) {
					res.objects.forEach(function(item, index) {
						arrObj.push((item.url));
					});
				}
				callback(arrObj);
			}).catch(function(error) {
				console.log(error);
			 	failCallback(error);
			});
		};
		self.getList2 = function(fileFolder, callback, failCallback) {
			client.list(fileFolder).then(function(res) {
				var arrObj = [];
				if(res.objects) {
					res.objects.forEach(function(item, index) {
						arrObj.push((item.url));
					});
				}
				callback(arrObj);
			}).catch(function(error) {
				console.log(error);
			 	failCallback(error);
			});
		};

		/**
		 * [delete 删除单个文件]
		 * @param  {[type]}   fileName [description]
		 * @param  {Function} callback [description]
		 * @return {[type]}            [description]
		 */
		self.delete = function(fileName, callback, failCallback) {
			client.delete(fileName, {quiet: false})
				.then(function(object) {
					callback(object);
				}).catch(function(error) {
					console.log(error);
				 	failCallback(error);
				});
		};

		/**
		 * [deleteMulti 删除多个文件数组]
		 * @param  {[type]} arrFileNames [description]
		 * @return {[type]}              [description]
		 */
		self.deleteMulti = function(arrFileNames, callback, failCallback) {
			client.deleteMulti(arrFileNames)
				.then(function(object) {
					callback(object);
				}).catch(function(error) {
					console.log(error);
				 	failCallback(error);
				});
		};
	};
})(Zepto);
var AliyunUpload = new $.AliyunUpload();
export {AliyunUpload};