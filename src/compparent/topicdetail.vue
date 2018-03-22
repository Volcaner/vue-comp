<template>
	<div class="main">
		<div id="topicdetail" class="topicdetail">
			<div v-show='bIsPullDown' class="refrash">
				<p>下拉刷新</p>
			</div>

			<div class="topic clearfix">
				<div class="user_info foruser clearfix">
					<div class="user_pic" @click='linkToSbDetailInfo(thread_info.authorid)'>
						<img :src='thread_info.avatarimg' alt="">
					</div>
					<div class="user_name">
						<p class="username"><span @click='linkToSbDetailInfo(thread_info.authorid)'>{{thread_info.author}}<b v-show='thread_info.groupname'>&nbsp;&nbsp;({{thread_info.groupname}})</b></span></p>
						<p class="identity"><b :class='thread_info.level != "1" && thread_info.level != "2"?"icon iconfont":"icon iconfont manger"'>{{thread_info.grouptitle}}</b><b>楼主</b></p>
					</div>
					<div class="follow">
						<p v-if='thread_info.followed==1' @click='clickToFollowSb(thread_info)' class="icon iconfont followed">&#xe698;</p>
						<p v-if='thread_info.followed==2' @click='clickToFollowSb(thread_info)' class="icon iconfont">&#xe659;</p>
					</div>
				</div>

				<div class="user_article">
					<p class="topical">{{thread_info.subject}}</p>
					<p class="datetime">{{thread_info.subtime}}</p>
					<p class="messageword" v-html='thread_info.message'></p>
					<!-- <template v-show='thread_info.imgurl > 0' v-for='item in thread_info.imgurl'>
						<img :src='item' alt="pic" @click='previewImage($event)'><br />
					</template> -->
					<!-- <ul v-show='thread_info.imgurl > 0'>
						<li v-for='item in thread_info.imgurl'>
							<img :src='item' alt="pic" @click='previewImage($event)'><br />
						</li>
					</ul> -->
					<!-- video -->
					<div class="videoShow" v-if='thread_info.v_count && 1 == thread_info.v_count'>
						<div id="mod_player" class="v_box prism-player">
							<!-- <video id="videoShowD" @play='alert("play")' @stop='alert("stop")' @pause='alert("pause")' :src='ossFileHead + "/" + fileFolder + "/video/" + thread_info.v_url[0]' poster="" 
								style="object-fit:contain"
								controls="controls" 
								x-webkit-airplay="true"
								webkit-playsinline="true"
								playsinline="true"
								preload="auto"
								x5-video-player-type="h5" 
								x5-video-player-fullscreen="false">
							</video> -->
						</div>
						<!-- <div class="v_pre">
							<img class="preVideo" :src='thread_info.v_url[1]' alt="">
							<span class="icon iconfont play" @click='click2PlayVideo'>&#xe627;</span>
						</div>
						<div class="v_control">
							
						</div> -->
					</div>
				</div>

				<div class="user_foot clearfix">
					<!-- 已关注 -->
					<div v-if='thread_info.tcount==1' class="follow_s" @click='clickToFllowTopic(thread_info)'><b class="icon iconfont">&#xe63f;</b>已关注</div>
					<!-- 点击关注 -->
					<div v-if='thread_info.tcount==2' class="follow_s" @click='clickToFllowTopic(thread_info)'><b class="icon iconfont">&#xe601;</b>点击关注</div>  

					<div v-show='bIsManager && thread_info.displayorder>0' class="stick_s" @click='clickToStick(thread_info)'><b class="icon iconfont">&#xe63e;</b>取消置顶</div>
					<div v-show='bIsManager && thread_info.displayorder==0' class="stick_s" @click='clickToStick(thread_info)'><b class="icon iconfont">&#xe63e;</b>设置置顶</div>

					<div v-show='bIsManager || uid==thread_info.authorid' class="cancel_s" @click='clickToCancel(thread_info)'><b class="icon iconfont">&#xe616;</b>删除</div>

					<div class="discuss_s">
						<p>
							<span v-if='thread_info.scount == 1' class="icon iconfont" @click='clickToAgree(thread_info)'>&#xe63a;<b>{{thread_info.recommend_add}}</b></span>
							<span v-if='thread_info.scount == 2' class="icon iconfont" @click='clickToAgree(thread_info)'>&#xe602;<b>{{thread_info.recommend_add}}</b></span>

							<span class="icon iconfont" @click='linkToComment(thread_info)'>&#xe64e;<b>{{thread_info.replies}}</b></span>
						</p>
					</div>
				</div>
			</div>

			<div class="discuss">
				<div class="discuss_order clearfix">
					<p @click='clickAllReply()' href="###" :class='{active: bIsAllReply}'>全部回复</p>
					<p @click='clickLzReply()' href="###" :class='{active: !bIsAllReply}'>楼主回复</p>
				</div>

				<div v-show='bIsAllReply && allpost.length > 0' class="allreply reply_cls">
					<ul>
						<template v-for='item in allpost'>
							<li class="clearfix">
								<div class="user_info  clearfix">
									<div class="user_pic"  @click='linkToSbDetailInfo(item.authorid)'>
										<img :src='item.avatarimg' alt="">
									</div>
									<div class="user_name">
										<p class="username"><span  @click='linkToSbDetailInfo(item.authorid)'>{{item.author}}</span><b>{{item.grouptitle}}</b></p>
									</div>
								</div>
								<div class="user_article">
									<div v-show='item.r_author && item.r_message' class="reply">
										<ul>
											<li>
												<label>回复&nbsp;<b>{{item.r_author}}</b>:&nbsp;</label><span v-html='item.r_message'></span>
											</li>
										</ul>
									</div>
									<p class="discussword" v-html='item.message'></p>
								</div>
								<div class="user_foot clearfix">
									<!-- 点击关注 -->
									<!-- <div class="follow"><b class="icon iconfont">&#xe601;</b>点击关注</div> -->
									<!-- 已关注 -->
									<div class="follow">
										<p class="datetime">{{item.subtime}}</p>
									</div>  
									<div class="discuss">
										<p>
											<span v-if='item.scount == 1' class="icon iconfont" @click='clickToAgreeOther(item)'>&#xe63a;<b>{{item.supports}}</b></span>
											<span v-if='item.scount == 2' class="icon iconfont" @click='clickToAgreeOther(item)'>&#xe602;<b>{{item.supports}}</b></span>

											<span class="icon iconfont" @click='linkToComment(item)'>&#xe64e;<b>{{item.replies}}</b></span>
										</p>
									</div>
								</div>
							</li>
						</template>
					</ul>
				</div>

				<div v-show='!bIsAllReply && allpost.length > 0' class="lzreply reply_cls">
					<ul>
						<template v-for='item in allpost'>
							<li class="clearfix">
								<div class="user_info  clearfix">
									<div class="user_pic">
										<img :src='item.avatarimg' alt="">
									</div>
									<div class="user_name">
										<p class="username"><span>{{item.author}}</span><b>{{item.grouptitle}}</b></p>
									</div>
								</div>
								<div class="user_article">
									<div v-show='item.r_author && item.r_message' class="reply">
										<ul>
											<li>
												<label>回复&nbsp;<b>{{item.r_author}}</b>:&nbsp;</label><span v-html='item.r_message'></span>
											</li>
										</ul>
									</div>
									<p class="discussword" v-html='item.message'></p>
								</div>
								<div class="user_foot clearfix">
									<!-- 点击关注 -->
									<!-- <div class="follow"><b class="icon iconfont">&#xe601;</b>点击关注</div> -->
									<!-- 已关注 -->
									<div class="follow">
										<p class="datetime">{{item.subtime}}</p>
									</div>  
									<div class="discuss">
										<p>
											<span v-if='item.scount == 1' class="icon iconfont" @click='clickToAgreeOther(item)'>&#xe63a;<b>{{item.supports}}</b></span>
											<span v-if='item.scount == 2' class="icon iconfont" @click='clickToAgreeOther(item)'>&#xe602;<b>{{item.supports}}</b></span>

											<span class="icon iconfont" @click='linkToComment(item)'>&#xe64e;<b>{{item.replies}}</b></span>
										</p>
									</div>
								</div>
							</li>
						</template>
					</ul>
				</div>

				<div v-show='allpost.length <= 0' class="noreplay reply_cls">
					<span>
						<img src="./../images/noreply.png" alt="">
					</span>
					<p>还没有任何评论哦～</p>
				</div>
			</div>

			<div class="footer">
				<div>
					<span class="emoticon icon iconfont" @click="showInsertPic">&#xe60c;</span>
					<!-- <textarea id="textarea" v-model='commentVal' rows="" name="words" value="" placeholder="发表评论"></textarea>
					<pre id="pre"></pre> -->
					<!-- <span class="icon iconfont" @click='submitToComment(thread_info)'>&#xe63a;</span> -->
					<!-- <span class="icon iconfont" @click='submitToComment(thread_info)'>&#xe626;</span> -->
					<div id="conBox" class="conBox" contentEditable="true" @input='getRanger' @paste='getRanger' @click='getRanger(); getEditer($event);' @focus='getRanger' @change='getRangerooo'>
						<p>
							<br>
						</p>
					</div>
					<span class="icon iconfont" @click='submitToComment(thread_info)'>评论</span>
				</div>
				<InsertPic v-if='bIsInsertPic' @insertPic='insertPic'></InsertPic>
			</div>

			<div v-show='bIsSlideUp' class="loadon">
				<p>上滑加载</p>
			</div>
		</div>

		<div class="replysb hide">
			<div class="reply_input">
				<div class="insertwords">
					<textarea name="insertwords" rows="5" value="" placeholder=""></textarea>
				</div>
				
				<div class="insertpics clearfix">
					<p class="emoticon icon iconfont">&#xe60c;</p>
					<p class="picture icon iconfont">&#xe680;</p>
				</div>
			</div>
			<div class="reply_footer">
				<input type="button" name="submit" value="提交">
				<input type="button" name="cancel" value="取消">
			</div>
		</div>

		<div class="tips hide">
			<div class="tip_box">
				<span>确定取消关注作者吗？</span>
				<p>
					<input type="button" name="cancel" value="取消">
					<input type="button" name="confirm" value="确定">
				</p>
			</div>
		</div>

		<commentarea v-show='bIsComment' :author='child_author' :rpid='child_pid' :btnName='commentBtn_name' @cancel='closeComment' @comment="okComment"></commentarea>
		<popchoosetip v-show='bIsPopTip' :strTips='strTips' @callback='afterCancel' @hide='hidePopTip' style="z-index: 9999;"></popchoosetip>

		<popTipPlay v-show='bIsPlayTip' :strTips='strTips' @hide='hidePopTip' @callback='continuePlay' style="z-index: 9999;"></popTipPlay>
	</div>
</template>
<script>
	import {RefrashOrLoadonByScroll} from './../compjs/refrashorloadonbyscroll.js';
	import {ReturnToTop} from './../compjs/returntotop.js';
	import commentarea from './../compchild/comment.vue';
	import InsertPic from './../compchild/insertpic.vue';
	import popchoosetip from './../compchild/popchoosetip.vue';
	import wx from 'weixin-js-sdk';
	import sha1 from 'sha1';
	// var {AliyunUpload} = require('./../lib/aliyunUpload.js');
	export default({
		data() {
			return {
				thread_info: {
					fid: '',  // 群组ID
					authorid: '',  // 作者ID
					author: '',  // 作者名
					subject: '',  // 帖子标题
					message: '',  // 帖子内容
					subtime: '',  // 帖子发布时间 格式：2017-01-01 15:00:00
					name: '',  // 群组名 如：淘宝流量
					avatarimg: require('./../images/robbin.jpg'),  // 作者头像
					grouptitle: '新手上路',  // 作者等级 如：新手上路
					replies: 0,  // 评论数
					recommend_add: 0,  // 点赞数
					displayorder: 0,  // 0为普通贴，>0为置顶帖
					imgurl: [],  // 帖子内容图片
					imgcount: 0,  // 图片个数
					tcount: 2,  // 该主帖是否已关注 1已关注，2未关注
					scount: 2,  // 该主帖是否已点赞 1已点赞，2未点赞
					atcount: '',  // 有效的at个数
					atuser: '',  // at的用户
					tid: '',
					pid: '',
					strTips: '',
				},
				allpost: [
					// {
					// 	subtime: '2017-01-01 15:00:00',  // 帖子发布时间 格式：2017-01-01 15:00:00
					// 	pid: '回复贴ID',  // 回复贴ID
					// 	authorid: '作者ID',  // 作者ID
					// 	author: '作者名',  // 作者名
					// 	replies: 12,  // 评论数
					// 	supports: 22,  // 点赞数
					// 	message: '帖子内容',  // 帖子内容
					// 	avatarimg: require('./../images/robbin.jpg'),  // 作者头像
					// 	grouptitle: '新手上路',  // 作者等级 如：新手上路
					// 	r_author: '被回复的帖子作者',  // 被回复的帖子作者
					// 	isfloor: '',  // 是否回复一楼(0为回复除一楼的其他楼，则有以下两条数据；0为回复一楼，则以下两条数据不存在)
					// 	r_message: '被回复的帖子内容',  // 被回复的帖子内容
					// 	ishost: 0,  // 是否为楼主（0非楼主，1是楼主用户名旁有'楼主'标签）
					// 	scount: 1,  // 该主帖是否已点赞 1已点赞，2未点赞
					// },
				],
				count: 0,
				bIsAllReply: true,
				tid: '',
				uid: '',
				bIsManager: false,
				commentVal: '',
				more: 1,
				pageCount: 0,
				comp_name: '',
				booRefrash: false,
				booLoadon: true,
				child_author: 'aaa',
				child_pid: 'aaa',
				bIsComment: false,
				bIsPopTip: false,

				// emoji
				bIsInsertPic: false,
				editer: '',
				ranger: '',

				commentBtn_name: '',
				// fileFolder: '',
				ossFileHead: window.ossFileHead,

				// medio
				networkType: '',
				coverURL: '',
				mediaId: '',
				popTipPlay: false,
				player: '',
				playState: '',  // playing  ended  paused   super
			}
		},
		mounted() {
			let that = this;
			
			this.$store.state.comp_name = JSON.parse(localStorage.comp_name);
			this.comp_name = this.$store.state.comp_name;
			// document.title = this.comp_name;

			this.$store.state.tid = JSON.parse(localStorage.tid);
			this.$store.state.uid = JSON.parse(localStorage.uid);
			this.$store.state.ismanager = JSON.parse(localStorage.ismanager);
			this.tid = this.$store.state.tid;
			this.uid = this.$store.state.uid;
			if(this.$store.state.ismanager == 1 || this.$store.state.ismanager == 2) {
				this.bIsManager = true;
			}

			this.allpost = [];
			this.pageCount = 0;
			let url = window.publicPath + '/home.php';
			let params = {
				op: 'thread_detail', 
				tid: this.tid, 
				page: this.pageCount, 
				onlyhost: 0
			};
			this.ajax(url, params, function(res) {
				that.drawPages(res);

				// 请求 oss 
				// that.post4OSS();
				// that.fileFolder = "hidden/compRoot/" + that.thread_info.authorid;
			});

			document.body.onload = function() {
				that.initRefrashOrLoadon();

				// var textarea = document.getElementById('textarea');
				// var pre = document.getElementById('pre');

				// textarea.oninput = function() {
				//     pre.textContent = textarea.value;
				//     textarea.style.height = pre.offsetHeight + 'px';
				// };
			};

			setInterval(function() {
				that.getNetworkType();
			}, 1000)
		},
		beforeCreate() {
            var myScript2 = document.createElement("script");
            myScript2.type = "text/javascript";
            myScript2.src ="./../../../../redev/wechat_for_comp/lib/aliplayer-h5-min.js";
            document.body.appendChild(myScript2);
		},
		created() {
			// 配置微信JS-SDK
			this.getWxConfig();
		},
		methods: {
			initRefrashOrLoadon: function() {
				let that = this;
				// 下拉刷新+上滑加载
				let target = document.querySelector('div.topicdetail');
				let refrashEl = document.querySelector('div.refrash');
				let loadonEl = document.querySelector('div.loadon');
				that.reElHeight = refrashEl.offsetHeight;
				that.windowHeight = document.body.offsetHeight;

				let obj = {
					target: target,
					refrashEl: refrashEl,
					loadonEl: loadonEl,
					booRefrash: that.booRefrash,
					booLoadon: that.booLoadon,
				};

				that.refrashOrLoadonByScroll(obj, function(afterrefrashCallback) {
					// refrash
				}, function(afterLoadonCallback) {
					// loadon
					let url = window.publicPath + '/home.php';
					let params = {};
					if(that.bIsAllReply) {
						params = {
							op: 'thread_detail', 
							tid: that.tid, 
							page: ++that.pageCount, 
							onlyhost: 0
						};
					}
					else {
						params = {
							op: 'thread_detail', 
							tid: that.tid, 
							page: ++that.pageCount, 
							onlyhost: 1
						};
					}
					that.ajax(url, params, function(res) {
						setTimeout(function() {
							that.drawPages(res);
							afterLoadonCallback(that.booLoadon);
						}, 50);
					});
				});

				// to top
				let topObj = {
					targetEl: document.querySelector('div.main'),
					footerEl: document.querySelector('div.footer'),
				}
				that.returnToTop(topObj);
			},
			ajax: function(url, params, callback) {
				this.$http.post(url, params, {emulateJSON: true}).then(function(res) {
					// console.log(res);
					callback(res);
				}, function(error) {
					// console.log(error);
					window.location.href = window.publicPath + "/dist/error404/error404.html"; 
				});
			},
			drawPages: function(res) {
				let that = this;
				if(res && res.body) {
					let result = res.body;

					let thread_info = result.thread_info;
					if(thread_info) {
						thread_info.avatarimg += "?" + Math.round(Math.random()*8999 + 1000);
						that.thread_info = thread_info;

						that.coverURL = thread_info.v_url?(thread_info.v_url.shotCut?thread_info.v_url.shotCut:''):'';
				      	that.mediaId = thread_info.v_url?(thread_info.v_url.videoId?thread_info.v_url.videoId:''):'';

						// if() {
						// 	var 
						// }
						
						if(thread_info.v_count && 1 == thread_info.v_count) {
							// 请求 媒体信息
							that.$http.post(window.publicPath + '/getSts.php', {action: 'upload'}, {emulateJSON: true}).then(function(stsRes) {
						      	// console.log(stsRes);

						      	// 请求 媒体信息    TODO??????????????????????????
								// let fileUrl = "http://compinput.oss-cn-hangzhou.aliyuncs.com" + thread_info.v_url?(thread_info.v_url.videoName?thread_info.v_url.videoName:''):'';
								that.$http.post(window.publicPath + '/aliMts/getMts.php', {action: 'getSignature', mediaId: that.mediaId, expireTime: stsRes.body.Expiration}, {emulateJSON: true}).then(function(mtsRes) {
									// console.log(mtsRes);

									

							      	that.player = new Aliplayer({
							            id: 'mod_player',
							            width: '100%',
							            height: '100%',
							            autoplay: false,
							            // playsinline: true,
							            // useH5Prism: true,
							            rePlay: true,
							            x5_type: 'flash',
							            // x5_video_position: 'center',
							            // preload: true,
							            // disableFullScreen: false,
							            // x5_fullscreen: true,
							            

							            //支持播放地址播放,此播放优先级最高
							            // source : "http://cdnvod.ant188.com/comproot/video/71c3dfbc22a34a0fa40e5c5870395d80/act-ss-mp4-ld/20170929210850.mp4",

							            //播放方式三：仅MTS用户使用
							            vid : that.mediaId,
							            accId: stsRes.body.AccessKeyId,
							            accSecret: stsRes.body.AccessKeySecret,
							            stsToken: stsRes.body.SecurityToken,
							            domainRegion: 'cn-hangzhou',
							            authInfo: '{"ExpireTime":"'+ stsRes.body.Expiration +'","MediaId":"'+ that.mediaId +'","Signature":"'+ JSON.parse(mtsRes.body) +'"}',
							            cover: that.coverURL,
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

						                document.querySelector("video").addEventListener("touchstart", function() {
						                	document.querySelector(".prism-controlbar").style.display = "block";
						                }, false);

						                setInterval(function() {
						                	document.querySelector(".prism-controlbar").style.display = "none";
						                }, 8500)
						            });

						            that.player.on("play", function() {
					                	console.log("play");

					     				// if("wifi" != that.networkType.toLowerCase() && "super" != that.playState) {
										// 	that.player.pause();
										// 	that.playState = "paused";

										// 	that.strTips = "您正在使用非wifi网络，确定继续播放？";
										// 	that.bIsPlayTip = true;
										// }
										// else {
											that.playState = "playing";

											document.querySelector(".prism-cover").style.display = "none";
						                	document.querySelector("video").style.width = "100%";
						                	document.querySelector("video").style.height = "100%";
										// }
					                });

						            that.player.on("ended", function() {
					                	console.log("ended");
					                	that.playState = "ended";

					                	document.querySelector(".prism-cover").style.display = "block";
					                	document.querySelector("video").style.width = "0";
					                	document.querySelector("video").style.height = "0";
					                });

					                that.player.on("pause", function() {
					                	console.log("pause");
					                	that.playState = "paused";

					                	document.querySelector(".prism-cover").style.display = "block";
					                	document.querySelector("video").style.width = "0";
					                	document.querySelector("video").style.height = "0";
					                });

									// var setLayout = function() {    
									//     //设置播放器容器的高度
									//     var height = 100; //根据实际情况设置高度
									// 	player.el().style.height = height;
									// };
					    			// player.on("requestFullScreen", function(){
									//     setLayout();
									// });
								}, function() {});
					      	}, function() {});
						}
					}

					if(result.count) {
						that.count = result.count;
					}

					let allpost = result.allpost;
					if(allpost) {
						if(allpost.length > 0) {
							allpost.forEach(function(item, index) {
								item.avatarimg += "?" + Math.round(Math.random()*8999 + 1000);
								that.allpost.push(item);
							});	
						}
						
						if(that.count > allpost.length) {
							that.booLoadon = false;
						}
					}

					// 
					setTimeout(function() {
						let imageList = document.querySelectorAll(".messageword img[name=images]");
						let imageUrlList = [];
						if(imageList && imageList.length > 0) {
							for(let j = 0; j < imageList.length; j++) {
								imageUrlList.push(imageList[j].src);
							}

							for(let k = 0; k < imageList.length; k++) {
								// with({b: k}) {
									let el = imageList[k];
									// console.log(el);
									el.addEventListener("click", function(e) {
										// console.log("aaaaaaaaaaaaaaaaa" + k);
										that.previewImage(e, imageUrlList);
									}, false);
								// }
							}
						}
					}, 0);
				}
				else {
					// alert("帖子不存在！");
					// window.location.href = window.publicPath + "/dist/communityhome/communityhome.html"; 
				}
			},
			refrashOrLoadonByScroll: function(obj, refrashCallback, loadonCallback) {
				RefrashOrLoadonByScroll(obj, refrashCallback, loadonCallback);
			},
			returnToTop: function(obj) {
				ReturnToTop(obj);
			},
			clickAllReply: function() {
				let that = this;
				this.bIsAllReply = true;
				this.allpost = [];
				this.booLoadon = true;
				this.initRefrashOrLoadon(this.booLoadon);

				this.pageCount = 0;
				let url = window.publicPath + '/home.php';
				let params = {
					op: 'thread_detail', 
					tid: this.tid, 
					page: this.pageCount, 
					onlyhost: 0
				};
				this.ajax(url, params, function(res) {
					that.drawPages(res);
				});
			},
			clickLzReply: function() {
				let that = this;
				this.bIsAllReply = false;
				this.allpost = [];
				this.booLoadon = true;
				this.initRefrashOrLoadon(this.booLoadon);

				this.pageCount = 0;
				let url = window.publicPath + '/home.php';
				let params = {
					op: 'thread_detail', 
					tid: this.tid, 
					page: this.pageCount, 
					onlyhost: 1
				};
				this.ajax(url, params, function(res) {
					that.drawPages(res);
				});
			},
			clickToFollowSb: function(userinfo) {
				let that = this;
				this.$http.post(window.publicPath + '/home.php', {op: 'user_focus', fuid: userinfo.authorid}, {emulateJSON: true}).then(function(res) {
					// console.log(res);
					let result = res.body;

					switch(Number(result.result)) {
						case 1: {
							userinfo.followed = 1;
							break;
						}
						case 2: {
							userinfo.followed = 2;
							break;
						}
					}
				}, function(error) {
					// console.log(error);
					window.location.href = window.publicPath + "/dist/error404/error404.html"; 
				});
			},
			clickToFllowTopic: function(item) {
				// console.log(item.tid + " " + item.tcount);
				// item.tcount = 1;

				this.$http.post(window.publicPath1 + '/home.php', {op: 'thread_focus', tid: item.tid}, {emulateJSON: true}).then(function(res) {
					// console.log(res);
					let result = res.body;
					switch(Number(result.result)) {
						case 1: {
							item.tcount = 1;
							break;
						}
						case 2: {
							item.tcount = 2;
							break;
						}
					}
				}, function(error) {
					// console.log(error);
					window.location.href = window.publicPath + "/dist/error404/error404.html"; 
				});
			},
			clickToStick: function(thread_info) {
				this.$http.post(window.publicPath + '/home.php', {op: 'top_thread', tid: this.tid}, {emulateJSON: true}).then(function(res) {
					// console.log(res);
					let result = res.body;
					switch(parseInt(result.result)) {
						case 1: {
							// 置顶成功
							thread_info.displayorder = 1;
							break;
						}
						case 0: {
							// 取消置顶成功
							thread_info.displayorder = 0;
							break;
						}
						case -1: {
							// 系统错误
							break;
						}
						case -4: {
							// 没有操作权限
							break;
						}
					}
				}, function(error) {
					// console.log(error);
					window.location.href = window.publicPath + "/dist/error404/error404.html"; 
				});
			},
			clickToCancel: function(thread_info) {
				let that = this;
				this.bIsPopTip = true;
				this.strTips = '确定删除话题吗？';
			},
			afterCancel: function(bool) {
				let that = this;
				if(bool) {
					this.$http.post(window.publicPath + '/home.php', {op: 'delete_thread', tid: this.tid}, {emulateJSON: true}).then(function(res) {
						// console.log(res);
						let result = parseInt(res.body.result);

						if(-4 == result) {
							// 没有操作权限
						}
						else if(0 == result) {
							// 删除失败
						}
						else if(0 < result){
							// 删除成功
							// if(that.thread_info.v_count && 1 == that.thread_info.v_count) {
							// 	AliyunUpload.delete(that.fileFolder + "/video/" + that.thread_info.v_url[0], function(o) {
							// 		console.log(o)
							// 		window.location.href = window.publicPath + "/dist/communityhome/communityhome.html"; 
							// 	}, function(error) {
							// 		// 请求 oss 
							// 		that.post4OSS(function() {
							// 			AliyunUpload.delete(that.fileFolder + "/video/" + that.thread_info.v_url[0], function(oo) {
							// 				window.location.href = window.publicPath + "/dist/communityhome/communityhome.html"; 
							// 			}, function(oo) {});
							// 		});
							// 	});
							// }
							// else {
							// 	window.location.href = window.publicPath + "/dist/communityhome/communityhome.html"; 
							// }
							
							// window.location.href = window.publicPath + "/dist/communityhome/communityhome.html";
							let reurl = "c_" + "communityhome";
							window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
						}
					}, function(error) {
						// console.log(error);
						window.location.href = window.publicPath + "/dist/error404/error404.html"; 
					});
				}
			},
			continuePlay: function() {
				this.playState = "super";
				this.player.play();
			},
			hidePopTip: function(bool) {
				this.bIsPopTip = bool;
			},
			clickToAgree: function(item) {  // 点赞主贴的时候只需要传 tid
				// console.log(item.tid + " " + item.scount);
				// item.scount = 1;

				this.$http.post(window.publicPath1 + '/home.php', {op: 'thread_support', tid: item.tid, pid: item.pid}, {emulateJSON: true}).then(function(res) {
					// console.log(res);
					let result = res.body;
					switch(Number(result.result)) {
						case 1: {
							item.scount = 1;
							item.recommend_add++;
							break;
						}
						case 2: {
							item.scount = 2;
							item.recommend_add--;
							break;
						}
					}
				}, function(error) {
					// console.log(error);
					window.location.href = window.publicPath + "/dist/error404/error404.html"; 
				});
			},
			clickToAgreeOther: function(item) {  // 点赞回复的时候只需要传 pid
				// console.log(this.tid + " " + item.scount);
				// item.scount = 1;

				this.$http.post(window.publicPath1 + '/home.php', {op: 'thread_support', pid: item.pid}, {emulateJSON: true}).then(function(res) {
					// console.log(res);
					let result = res.body;
					switch(Number(result.result)) {
						case 1: {
							item.scount = 1;
							item.supports++;
							break;
						}
						case 2: {
							item.scount = 2;
							item.supports--;
							break;
						}
					}
				}, function(error) {
					// console.log(error);
					window.location.href = window.publicPath + "/dist/error404/error404.html"; 
				});
			},
			submitToComment: function(item) {
				let that = this;
				let strComment = document.querySelector("div#conBox").innerHTML;
				if(strComment != null) {
					this.$http.post(window.publicPath2 + '/forum.php', {mod: 'post',action: 'new_reply', rpid: item.pid, uid: this.uid, message: strComment}, {emulateJSON: true}).then(function(res) {
						// console.log(res);
						let result = res.body;

						switch(Number(result)) {
							case 1: {
								// 为评论成功
								location.reload();
								break;
							}
							case -1: {
								// 内容为空或太短
								alert("内容为空或太短");
								break;
							}
							case -2: {
								// 内容太长
								alert("内容太长");
								break;
							}
							case -3: {
								// 未选择回复内容
								alert("未选择回复内容");
								break;
							}
							case -4: {
								// 用户未登录
								alert("用户未登录");
								break;
							}
						};
					}, function(error) {
						// console.log(error);
						window.location.href = window.publicPath + "/dist/error404/error404.html"; 
					});
				}
			},
			linkToSbDetailInfo: function(authorid) {
				// console.log(authorid);

				localStorage.authorid = JSON.stringify(authorid);

				if(authorid == this.uid) {
					// window.location.href = window.publicPath + "/dist/minedetailinfo/minedetailinfo.html"; 
					let reurl = "c_" + "minedetailinfo";
					window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
				}
				else {
					// window.location.href = window.publicPath + "/dist/sbdetailinfo/sbdetailinfo.html?p_uid=" + authorid;
					let reurl = "c_" + "sbdetailinfo";
					window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl + "&p_uid=" + authorid;
				}
			},
			linkToComment: function(item) {
				// window.location.href = window.publicPath + "/dist/comment/comment.html?rpid=" + item.pid + "&author=" + item.author;
				this.child_author = item.author;
				this.child_pid = item.pid;
				if(this.bIsComment) {
					this.bIsComment = false;
				}else {
					this.bIsComment = true;

					this.commentBtn_name = "回复";

					// document.querySelector(".commentarea div#conBox").innerHTML = "<p>回复 " + item.author + "：</p>";
				}
			},
			closeComment: function(booComment) {
				this.bIsComment = booComment;
			},
			okComment: function(booComment) {
				if(booComment) {
					location.reload();
				}
			},
			previewImage: function(e, urlList) {
				let current=e.target.attributes[0].value;
				let that = this;
				wx.ready(function() {
					wx.previewImage({
						current: current, // 当前显示图片的http链接  
						urls: urlList // 需要预览的图片http链接列表 
					});
				});

				wx.error(function (res) {
				    // alert(e);
				});
				
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
									'previewImage($event)',
									'getNetworkType',
								],
							});
						}
					}
				}, function(error) {
					// console.log(error);
				});
			},
			showInsertPic: function() {
				this.bIsInsertPic = !this.bIsInsertPic;
			},
			getRanger: function() {
				let that = this;
				if (window.getSelection) {
					let se = window.getSelection();
					if (se.getRangeAt && se.rangeCount) {
						this.ranger = se.getRangeAt(0);
					}
				}
				else if(document.selection && document.selection.createRange) {
					this.ranger = document.selection.createRange();
				}
			},
			getEditer: function(e) {
				this.editer = e.currentTarget;

				// emoji 隐藏
				this.bIsInsertPic = false;
			},
			getRangerooo: function() {
				alert(88888)
			},
			insertPic: function(text) {
				let that = this;
				let targetEl = document.querySelector(".footer #conBox");
				try {
					if (window.getSelection) {
						let se = window.getSelection();
						let range;

						if(that.editer == "" || that.editer == null || that.editer == undefined) {
							return;
						}
						else if(that.editer == targetEl) {
							if (se.getRangeAt && se.rangeCount) {
								range = se.getRangeAt(0);
								if(targetEl != range.commonAncestorContainer || targetEl != range.commonAncestorContainer.parentNode || targetEl != range.commonAncestorContainer.parentNode.parentNode) {
									se.removeAllRanges();
									se.addRange(that.ranger);
									range = se.getRangeAt(0);
								}
								range.deleteContents();
			                    let el = document.createElement("div");
			                    el.innerHTML = text;
			                    let frag = document.createDocumentFragment(), node, lastNode;
			                    frag.appendChild(document.createTextNode(' '));
			                    while ((node = el.firstChild)) {
			                        lastNode = frag.appendChild(node);
			                    }
			                    range.insertNode(frag);
			                    if (lastNode) {
			                        // range = range.cloneRange();
			                        range.setStart(lastNode, 0);

			                        window.setTimeout(function() {
							            range = document.createRange();
							            range.setStartAfter(lastNode);
							            range.collapse(true);
							            se.removeAllRanges();
							            se.addRange(range);
							            that.ranger = document.createRange();
							            that.ranger.setStartAfter(lastNode);
							            that.ranger.collapse(true);
							        }, 0);
			                    }
			                    document.getElementById("conBox").blur();
							}
						}
					}
					else if(document.selection && document.selection.createRange) {
						let se = document.selection;
						let range = document.selection.createRange();
						if(targetEl == range.commonAncestorContainer || targetEl == range.commonAncestorContainer.parentNode || targetEl == range.commonAncestorContainer.parentNode.parentNode) {
							if (typeof text === 'string') {
						        range.text = text;
						    } else {
						        range.pasteHTML(text.outerHTML);
						        document.getElementById("conBox").blur();
						    }
						}
					}
				} catch(err) {

			    }
			},
			click2PlayVideo: function() {
				let video = document.getElementById('videoShowD');
				video.play();
				document.querySelector(".v_pre").style.display = "none";
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

				// if("wifi" != this.networkType.toLowerCase() && "playing" == this.playState) {
				// 	this.player.pause();
				// 	this.playState = "paused";


				// 	this.strTips = "您正在使用非wifi网络，确定继续播放？";
				// 	this.bIsPlayTip = true;
				// }
			},
		},
		components: {
			'commentarea': commentarea,
			'InsertPic': InsertPic,
			'popchoosetip': popchoosetip,
			'popTipPlay': popchoosetip,
		},
	});
</script>
<style type="text/css" media="screen">
	
</style>