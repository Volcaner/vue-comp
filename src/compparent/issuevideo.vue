<template>
	<div class="main">
		<div id="topic" class="topic">
			<div class="issuearea">
				<!-- <div class="video_pre">
					<video id="embedPlay" src="./../../lib/video/20170929210850.mp4" loop="true" playsinline="true" x-webkit-airplay="true" webkit-playsinline preload="none"></video>
				</div> -->

				<div class="video_input">
					<ul class="clearfix" v-show='!bIsChoosedVideo'>
						<li>
							<p>
								<span class="icon iconfont">&#xe606;</span>
								<span>拍摄视频</span>
								<span>（不超过1分钟）</span>
							</p>
							<input type="file" accept="video/*" capture="camcorder" @click='clearFileInput' @change='getVideo($event)'>
						</li>
						<li>
							<p>
								<span class="icon iconfont">&#xe63c;</span>
								<span>选择视频</span>
								<span>（格式：avi，flv，小于100M）</span>
							</p>
							<input type="file" accept="video/*" multiple="1" @click='clearFileInput' @change='getVideo($event)'>
						</li>
					</ul>

					<div class="video_pre" v-show='bIsChoosedVideo'>
						<div id="mod_player" class="video_box prism-player">
							<!-- <video id="embedPlay" src="./../../lib/video/20170929210850.mp4" poster="" x-webkit-airplay="true" webkit-playsinline playsinline preload="none"></video> -->
						</div>
						<div class="video_cancel icon iconfont" @click='click2CancelVideo'>&#xe7b1;</div>
						<!-- <div class="video_prepic" v-show='!bIsPlayed' @click='click2Play'>
							<span class="icon iconfont">&#xe627;</span>
						</div> -->
					</div>
				</div>

				<div class="title_input">
					<textarea v-model='titleVal' name="title" placeholder="请输入标题" rows="5" @click='getEditer($event)' maxlength="80"></textarea>
					<p><span>{{titleVal.length}}/80</span></p>
				</div>

				<div class="control" v-show='bIsmanager'>
					<p class="stick clearfix">
						<label><input type="checkbox" name="stick" value="" @click='clickToStick()'>置顶</label>
					</p>
					<p class="synchro clearfix hide">
						<label><input type="checkbox" name="synchro" value="" @click='clickToSynchro()'>同步到文章推送（每日16:00推送，今日还剩<b>{{synchroCount}}</b>篇）</label>
					</p>
					<p class="note hide">
						<b>注：</b>
						<span>1. 勾选第二项时，标题需控制在64个字以内。</span>
						<span>2. 勾选第二项时，建议在内容中添加图片，否则将使用默认图。</span>
					</p>
				</div>
			</div>

			<div class="footer">
				<div class="submit_btn" @click='clickToSubmit()'>
					<span>提交</span>
				</div>
			</div>

			<div v-show='bIsTips' class="tips">
				<div class="tip_box">
					<!-- <span>{{tipWords}}</span> -->
					<img src="../images/submiting.gif" height="32" width="32" alt="">
				</div>
			</div>

			<progressbar v-show='bIsProgress' :barnum='barnum'></progressbar>

			<popchoosetip v-show='bIsPopTip' :strTips='strTips' @hide='hidePop' @callback='continueUpload'></popchoosetip>
		</div>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>	
	import progressbar from "./../compchild/progressBar.vue";
	import popchoosetip from "./../compchild/popchoosetip.vue";
	import wx from 'weixin-js-sdk';
	import sha1 from 'sha1';
	export default({
		data() {
			return {
				uid: '',
				bIsmanager: false,
				bIsChoosedVideo: false,
				bIsPlayed: false,
				bIsShowTip: false,
				editer: '',
				titleVal: '',
				bIsTop: false,
				istop: 0,
				files: [],
				nt_code: '',  // 防止多次提交
				bIsTips: false,
				tipWords: '上传中...',
				bIsProgress: false,
				barnum: 0,

				// 视频mts
				mediaId: '',
				networkType: '',
				bIsPopTip: false,
				strTips: '',  // 退出此次编辑？
				mediaFile: '',
				mediaName: '',
				uploader: '',
				player: '',
				uploadState: 'ready',  // ready  uploading  failed  successed  paused
				coverURL: '',
				barTimaer: '',
			}
		},
		beforeCreate() {
			console.log("beforeCreate");
			var myScript0 = document.createElement("script");
            myScript0.type = "text/javascript";
            myScript0.src ="./../../../../redev/wechat_for_comp/lib/vod-sdk-upload-1.0.6.min.js";
            document.body.appendChild(myScript0);

            var myScript1 = document.createElement("script");
            myScript1.type = "text/javascript";
            myScript1.src ="./../../../../redev/wechat_for_comp/lib/aliyun-sdk.min.js";
            document.body.appendChild(myScript1);

            var myScript2 = document.createElement("script");
            myScript2.type = "text/javascript";
            myScript2.src ="./../../../../redev/wechat_for_comp/lib/aliplayer-h5-min.js";
            document.body.appendChild(myScript2);
		},
		created() {
			// 配置微信JS-SDK
			this.getWxConfig();
		},
		mounted() {
			// 解决刷新界面，store又初始化----感觉这个地方很狗血，用了store，又用localstorage，  TODO：需要优化？
			this.$store.state.fid = localStorage.fid?JSON.parse(localStorage.fid):'';
			this.$store.state.uid = localStorage.uid?JSON.parse(localStorage.uid):'';
			this.uid = this.$store.state.uid;
			this.$store.state.ismanager = localStorage.ismanager?JSON.parse(localStorage.ismanager):'';
			let that = this;
			
			this.$store.state.comp_name = localStorage.comp_name?JSON.parse(localStorage.comp_name):'';
			this.comp_name = this.$store.state.comp_name;
			// document.title = this.comp_name;

			let ismanager = this.$store.state.ismanager;
			if(1 == ismanager || 2 == ismanager) {
				this.bIsmanager = true;
			}

			this.$http.post(window.publicPath + '/home.php', {op: 'push_auth'}, {emulateJSON: true}).then(function(res) {
				// console.log(res);
				if(res && res.body) {
					let result = res.body;

					that.nt_code = result.result.nt_code?result.result.nt_code:"";
				}
			}, function(error) {
				window.location.href = window.publicPath + "/dist/error404/error404.html"; 
			});

			setInterval(function() {
				that.getNetworkType();
			}, 1000)
		},
		methods: {
			clearFileInput: function(e) {
				e.currentTarget.value = "";
			},
			getVideo: function(e) {
				let that = this;
				let bIsNull = /^\s*$/g;
				that.mediaFile = e.target.files[0];

				if(that.mediaFile.size/(1024*1024) > 80) {
					alert("视频文件过大！");
				}
				else {
					if("wifi" != this.networkType.toLowerCase()) {
						this.bIsPopTip = true;
						this.strTips = "您正在使用非wifi网络，确定继续上传？";
					}
					else {
						this.uploadVideo(that.mediaFile);
					}
				}
			},
			uploadVideo: function(file) {
				let that = this;
				let type = file.type.split("/")[1].toLowerCase();
				console.log(type);
				// alert(type);
				if(type != "mp4" && type != "mov" && type != "wmv" && type != "avi" && type != "mpeg" && type != "ogg" && type != "3gp" && type != "flv" && type != "m3u8" && type != "rmvb") {  
					// type != "mp4" && type != "mov" && type != "wmv" && type != "avi" && type != "mpeg" && type != "ogg" && type != "3gp" && type != "flv" && type != "m3u8" && type != "rmvb"
					alert("视频大小/时长/格式不符，添加失败！");
				}
				else if(file.size/(1024*1024) > 80) {
					alert("视频太大！");
				}
				else {
					that.bIsChoosedVideo = true;

					// 上传进度条开启
					that.bIsProgress = true;
					
					let vodTitle = file.name.split(".")[0];
					let vodName = vodTitle + "." + type;
					that.mediaName = vodName;
					let newTime = that.showTime();
					
					// 请求 sts
					that.$http.post(window.publicPath + '/getSts.php', {action: 'upload', title: vodTitle, name: vodName}, {emulateJSON: true}).then(function(stsRes) {
						// console.log(stsRes);

						that.uploader = new VODUpload({
							// 开始上传
						    'onUploadstarted': function (uploadInfo) {
						      // console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
						      that.uploadState = "uploading";

						      // that.uploader.setUploadAuthAndAddress(uploadInfo, stsRes.body.UploadAuth, stsRes.body.UploadAddress);
						    },
						    // 文件上传成功
						    'onUploadSucceed': function (uploadInfo) {
								// console.log("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);

								that.uploadState = "successed";

								// setTimeout(function() {
									
									// 请求 媒体信息
									let fileUrl = "http://compinput.oss-cn-hangzhou.aliyuncs.com" + uploadInfo.object;
									that.$http.post(window.publicPath + '/aliMts/getMts.php', {action: 'getMediaInfo', fileUrl: fileUrl, expireTime: stsRes.body.Expiration}, {emulateJSON: true}).then(function(mtsRes) {
								      	// console.log(mtsRes);

								      	that.coverURL = mtsRes.body.MediaList.Media[0].CoverURL;
								      	that.mediaId = mtsRes.body.MediaList.Media[0].MediaId;

								      	that.player = new Aliplayer({
								            id: 'mod_player',
								            width: '100%',
								            height: '100%',
								            autoplay: false,
								            // playsinline: true,
								            // useH5Prism: true,
								            rePlay: true,
								            x5_type: 'flash',
								            // x5_video_position: 'contain',
								            // preload: true,
								            // disableFullScreen: false,
								            // x5_fullscreen: true,

								            //支持播放地址播放,此播放优先级最高
								            // source : "http://cdnvod.ant188.com/comproot/video/71c3dfbc22a34a0fa40e5c5870395d80/act-ss-mp4-ld/20170929210850.mp4",

								            //播放方式三：仅MTS用户使用
								            vid : mtsRes.body.MediaList.Media[0].MediaId,
								            accId: stsRes.body.AccessKeyId,
								            accSecret: stsRes.body.AccessKeySecret,
								            stsToken: stsRes.body.SecurityToken,
								            domainRegion: 'cn-hangzhou',
								            authInfo: '{"ExpireTime":"'+ stsRes.body.Expiration +'","MediaId":"'+ mtsRes.body.MediaList.Media[0].MediaId +'","Signature":"'+ mtsRes.body.signature +'"}',
								            cover: mtsRes.body.MediaList.Media[0].CoverURL,
								            skinLayout: [
								            	{name: "bigPlayButton", align: "blabs", x: 30, y: 160},
								            	{name: "H5Loading", align: "cc"},
								            	{name: "errorDisplay", align: "tlabs", x: 0, y: 0},
		      									{name: "infoDisplay", align: "cc"},
								            	{
													name: "controlBar", align: "blabs", x: 0, y: 0,
													children: [
														{name: "progress", align: "tlabs", x: 0, y: 0},
														{name: "playButton", align: "tl", x: 15, y: 12},
														{name: "timeDisplay", align: "tl", x: 10, y: 7},
														// {name: "fullScreenButton", align: "tr", x: 20, y: 25},
														// {name: "streamButton", align: "tr",x: 10, y: 10},
														{name: "speedButton", align: "tr",x: 10, y: 10},
														{name: "volume", align: "tr", x: 20, y: 10},
														// {name: "snapshot", align: "tr", x: 20, y: 25}
													]
												}
								            ]
							            },function(player){
							                console.log('播放器创建好了。');
							                that.bIsProgress = false;

							                document.querySelector("video").addEventListener("touchstart", function() {
							                	document.querySelector(".prism-controlbar").style.display = "block";
							                }, false);

							                that.barTimaer = setInterval(function() {
							                	var barEl = document.querySelector(".prism-controlbar");
							                	if(barEl && barEl.length > 0) {
							                		document.querySelector(".prism-controlbar").style.display = "none";
							                	}
							                }, 8500)
							            });

							            that.player.on("play", function() {
						                	console.log("play");

						                	document.querySelector(".prism-cover").style.display = "none";
						                	document.querySelector("video").style.width = "100%";
						                	document.querySelector("video").style.height = "100%";
						                });

							            that.player.on("ended", function() {
						                	console.log("ended");

						                	document.querySelector(".prism-cover").style.display = "block";
						                	document.querySelector("video").style.width = "0";
						                	document.querySelector("video").style.height = "0";
						                });

						                that.player.on("pause", function() {
						                	console.log("pause");

						                	document.querySelector(".prism-cover").style.display = "block";
						                	document.querySelector("video").style.width = "0";
						                	document.querySelector("video").style.height = "0";
						                });
							      	}, function() {});
								// }, 5000);
						    },
						    // 文件上传失败
						    'onUploadFailed': function (uploadInfo, code, message) {
						      // console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message);
						      that.uploadState = "failed";
						    },
						    // 文件上传进度，单位：字节
						    'onUploadProgress': function (uploadInfo, totalSize, uploadedSize) {
						        // console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + Math.ceil(uploadedSize * 100 / totalSize) + "%");
								that.barnum =  (uploadedSize / totalSize).toFixed(2);
								that.uploadState = "uploading";
						    },
						    // 安全令牌超时
						    'onUploadTokenExpired': function () {
						        // console.log("onUploadTokenExpired");
						        // that.uploader.resumeUploadWithToken(accessKeyId, accessKeySecret, secretToken, expireTime);
						        that.uploadState = "paused";
						    }
						});
						
						var userData = {
							Vod: {
								UserData: "",
								Title: newTime,
								CateId: 683190424
							}
						};
						userData = JSON.stringify(userData);
						that.uploader.init(stsRes.body.AccessKeyId, stsRes.body.AccessKeySecret, stsRes.body.SecurityToken, 3600);
						that.uploader.addFile(file, "http://oss-cn-hangzhou.aliyuncs.com", "compinput", "/comproot/video/" + that.uid + "/" + newTime + "_" + vodName, userData);
						that.uploader.startUpload();
					}, function(error) {});
				}
			},
			hidePop: function(bool) {
				this.bIsPopTip = false;
			},
			continueUpload: function(bool) {
				let that = this;
				if(bool) {
					if("ready" == this.uploadState) {
						this.uploadVideo(this.mediaFile);
					}
					else if("paused" == this.uploadState) {
						this.uploader.startUpload();
					}
				}
				else {
					this.mediaFile = '';
				}
			},
			click2Play: function() {
				document.getElementById("embedPlay").play();
				this.bIsPlayed = true;
			},
			click2CancelVideo: function() {
				let that = this;
				this.bIsChoosedVideo = false;
				this.mediaId = '';
				this.mediaName = '';
				this.coverURL = '';
				this.mediaFile = '';
				this.uploader = '';
				this.player.dispose();
				this.barnum = 0;
				this.barTimaer = '';
				document.querySelector("#mod_player").innerHTML = '';
			},
			getEditer: function(e) {
				this.editer = e.currentTarget;
			},
			clickToStick: function() {
				this.bIsTop = !this.bIsTop;
				if(this.bIsTop) {
					this.istop = 1;
				}
				else {
					this.istop = 0;
				}
			},
			clickToSubmit: function() {
				let that = this;
				let bIsNull = /^\s*$/g;

				if(!bIsNull.test(this.titleVal) && !bIsNull.test(this.mediaId)) {
					let fid = that.$store.state.fid;
					let uid = that.$store.state.uid;

					// loading show
					this.bIsTips = true;

					// oss 存储 vedio
					// this.bIsProgress = true;
					// formData 
					let formData = new FormData();
					formData.append("v_name", that.mediaName);
					formData.append("v_id", that.mediaId);
					formData.append("preImg", that.coverURL);
					formData.append("mod", "post");
					formData.append("action", "new_thread");
					formData.append("isvideo", "1");
					formData.append("subject", that.titleVal);
					formData.append("istop", that.istop);
					formData.append("nt_code", that.nt_code);
					
					// that.bIsProgress = true;
					
					that.$http.post(window.publicPath2 + '/forum.php', 
						// {mod: "post", action: "new_thread", isvideo: 1, subject: that.titleVal, istop: that.istop, nt_code: that.nt_code, v_file: that.files[0], preImg: imgSrc},
						formData,
						{progress: function(e) {
							// console.log(e);
							// that.barnum = parseFloat(e.loaded/e.total).toFixed(2);
						}},
						{emulateJSON: true}).then(function(res) {
						// console.log(res);
						// that.bIsProgress = false;
						let result = Number(res.body);

						// loading hide
						that.bIsTips = false;

						switch(Number(result)) {
							case 1: {
								// 为发帖成功
								that.$store.state.bIsIssueOk = true;
								localStorage.bIsIssueOk = JSON.stringify(that.$store.state.bIsIssueOk);
								// window.location.href = window.publicPath + "/dist/communityhome/communityhome.html"; 
								let reurl = "c_" + "communityhome";
								window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
								break;
							}
							case 0: {
								// 上传图片失败
								alert("上传图片失败");
								break;
							}
							case -1: {
								// 标题或内容为空
								alert("标题或内容为空");
								break;
							}
							case -2: {
								// 标题太长
								alert("标题太长");
								break;
							}
							case -3: {
								// 内容太长
								alert("内容太长");
								break;
							}
							case -55: {
								// 用户未登录
								alert("用户未登录");
								break;
							}
							case -66: {
								// 没有足够的操作权限
								alert("没有足够的操作权限");
								break;
							}
							case -77: {
								// 文章推送数已满
								alert("文章推送数已满");
								break;
							}
							case -8: {
								// 图片格式错误（'jpg', 'jpeg', 'gif', 'png', 'bmp'）
								alert("图片格式错误（'jpg', 'jpeg', 'gif', 'png', 'bmp'）");
								break;
							}
							case -9: {
								// 图片未保存
								alert("图片未保存");
								break;
							}
							case -10: {
								// 图片保存出错
								alert("图片保存出错");
								break;
							}
							default: {
								// 上传失败
								alert("上传失败");
								break;
							}
						}
					}, function(error) {
						// console.log(error);
						// that.bIsProgress = false;

						// loading hide
						that.bIsTips = false;

						// window.location.href = window.publicPath + "/dist/error404/error404.html"; 
					});
				}
				else {
					alert("视频或标题不能为空！");
				}
			},
			showTime: function() {
				var date = new Date();
				var year = date.getFullYear();
				var month = date.getMonth()+1;
				var day = date.getDate();
				var hour = date.getHours();
				var minute = date.getMinutes();
				var second = date.getSeconds();
				var str=(year+''+month+''+day+''+hour+''+minute+''+second);
				return str;
			},
			getWxConfig: function() {
				// let that = this;
				let url = window.publicPath1 + '/wechat_member.php'; 

				this.$http.post(url, {action: 'getticket'}, {emulateJSON: true}).then(function(res) {
					if(res && res.body) {
						let result = res.body;
						if(-4 == Number(result.ticket)) {
							alert("未获取token");
						}
						else if(-3 == Number(result.ticket)) {
							alert("未获取ticket");
						}
						else {
							// console.log(result);
							let ticket = result.ticket;
							let timestamp = parseInt(new Date().getTime() / 1000);
							let noncestr = sha1(new Date());
							let url = location.href.split('#')[0];
							let string = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url;
							let signature = sha1(string);

							//接口入住权限验证配置
							wx.config({
								debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
								appId: result.appid, // 必填，公众号的唯一标识 
								timestamp: timestamp, // 必填，生成签名的时间戳 
								nonceStr: noncestr, // 必填，生成签名的随机串 
								signature: signature, // 必填，签名，见附录1 
								jsApiList: [
									'getNetworkType',
								],
							});
						}
					}
				}, function(error) {
					// console.log(error);
				});
			},
			getNetworkType: function() {
				let that = this;
				wx.getNetworkType({
					success: function (res) {
						// console.log(res.networkType);
						that.networkType = res.networkType;
					},
					fail: function (res) {
						// alert(JSON.stringify(res));
					}
			    });
			},
		},
		watch: {
			'networkType': function(newVal, oldVal) {
				// console.log("wacth: " + newVal);

				if("wifi" != this.networkType.toLowerCase() && "uploading" == this.uploadState) {
					this.uploadState = "paused";
					this.uploader.stopUpload();

					this.strTips = "您正在使用非wifi网络，确定继续上传？";
					this.bIsPopTip = true;
				}
			},
		},
		components: {
			'progressbar': progressbar,
			'popchoosetip': popchoosetip,
		},
	})
</script>
<style lang="less" scoped>
</style>