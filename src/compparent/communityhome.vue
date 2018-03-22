<template>
	<div class="main">
		<div id="home" class="home clearfix">
			<div class="content">
				<div v-show='bIsPullDown' class="refrash">
					<p>下拉刷新</p>
				</div>

				<div class="compinfo clearfix">
					<div class="compIcon" @click='enterBreif()'>
						<img :src='compIcon' alt="">
					</div>

					<div class="compName">
						<h1 @click='enterBreif()'>{{compName}}</h1>
						<p class="clearfix">
							<span>话题<b>{{compThreads}}</b></span>
							<span>关注<b>{{compUsers}}</b></span>
						</p>
					</div>

					<div class="memberSign">
						<button :class='{"signed": compSign == 1}' @click='clickToSign' type="button">{{strSign}}</button>
					</div>
				</div>

				<div class="stickypost" v-show='bIsStickypost'>
					<transition-group name="staggered-fade" tag='ul' v-bind:css="false" v-on:before-enter="beforeEnter" v-on:enter="enter">  <!-- v-on:leave="leave" -->
						<li v-for='(item, index) in arrStickyCache' v-bind:data-index="index" v-bind:key='item' class="clearfix clickActive" @click='linkToSticky(item.tid)'>
							<b>置顶</b>
							<span>{{item.subject}}</span>
						</li>
					</transition-group>

					<div class="showmore" v-show='arraySticky.length>5 && !bIsShowStickyMore'>
						<span @click='showMore()' class="icon iconfont clickActive">更多</span>
					</div>

					<div class="hidemore" v-show='arraySticky.length>5 && bIsShowStickyMore'>
						<span @click='showMore()' class="icon iconfont clickActive">收起</span>
					</div>
				</div>

				<div class="manager clearfix clickActive hide" @click='enterBreif()'>
					<span>管理员</span>
					<span>
						<b class="icon iconfont">&#xe656;</b>
						<ul>
							<template v-for='item in arrayManager'>
								<li>
									<img :src='item.avatarimg' alt="">
								</li>
							</template>
						</ul>
					</span>
				</div>

				<div v-show='bIsOrdinarypost' class="ordinarypost">
					<!-- <p>
						<span>
							<strong>看帖</strong>
							<b class="icon iconfont">&#xe656;</b>
						</span>
					</p> -->
					<ul>
						<template v-for='(item, index) in arrayOrdinary'>
							<li class="clearfix">
								<div class="user_info clearfix" @click='linkToSbDetailInfo(item.authorid)'>
									<div class="user_pic">
										<img :src='item.avatarimg' alt="">
									</div>
									<div class="user_name">
										<p class="username"><span>{{item.author}}<b v-show='item.groupname'>&nbsp;&nbsp;({{item.groupname}})</b></span><b :class='item.level != "1" && item.level != "2"?"icon iconfont":"icon iconfont manger"'>{{item.grouptitle}}</b></p>
										<p class="datetime">{{item.subtime}}</p>
									</div>
								</div>
								<div class="user_article">
									<p class="title" @click='linkToTopicDetail(item.tid); addClickActive($event);'>{{item.subject}}</p>
									<p class="mainword" v-html='item.message' @click='linkToTopicDetail(item.tid); addClickActive($event);'></p>
									<!-- /*img*/ -->
									<ul v-if='item.imgcount > 1' class="clearfix" @click='linkToTopicDetail(item.tid); addClickActive($event);'>
										<template v-for='imgItem in item.imgurl'>
											<li>
												<div :style="{background:'url('+imgItem+') center / cover no-repeat', width: '100%', height: '210px'}"></div>
											</li>
										</template>
									</ul>
									<div class="img" v-if='item.imgcount == 1 && item.imgurl && item.imgurl.length > 0' :style="{background:'url('+item.imgurl[0]+') center / cover no-repeat'}" @click='linkToTopicDetail(item.tid); addClickActive($event);'></div>
									<!-- video -->
									<div class="videoShow" v-if='item.v_count && 1 == item.v_count'>
										<div :id='"mod_player_"+item.idIndex' class="v_box">
											<!-- <div :id='"mod_player_"+index' class="v_box" :style='"background-image: url(" + item.v_url.shotCut +")"'> -->
											<!-- <video :id='"videoShow_" + index' :src='item.v_url[0]' poster="" 
												style="object-fit:contain"
												x-webkit-airplay="true"
												webkit-playsinline="true"
												playsinline="true"
												preload="auto"
												x5-video-player-type="h5" 
												x5-video-player-fullscreen="true">
											</video> -->
										</div>
										<!-- <div class="v_pre">
											<img :src='item.v_url[1]' alt="">
											<span class="icon iconfont">&#xe627;</span>
										</div>
										<div class="v_control"></div> -->
									</div>
								</div>
								<div class="user_foot clearfix">
									<!-- 已关注 -->
									<div v-if='item.tcount==1' class="follow" @click='clickToFllowTopic(item)'><b class="icon iconfont">&#xe63f;</b>已关注</div>
									<!-- 点击关注 -->
									<div v-if='item.tcount==2' class="follow" @click='clickToFllowTopic(item)'><b class="icon iconfont">&#xe601;</b>点击关注</div>  
									<div class="discuss">
										<p>
											<span v-if='item.scount==1' class="icon iconfont" @click='clickToAgree(item)'>&#xe63a;<b>{{item.recommend_add}}</b></span>
											<span v-if='item.scount==2' class="icon iconfont" @click='clickToAgree(item)'>&#xe602;<b>{{item.recommend_add}}</b></span>
											<span class="icon iconfont clickActive" @click='linkToComment(item)'>&#xe64e;<b>{{item.replies}}</b></span>
										</p>
									</div>
								</div>
							</li>
						</template>
					</ul>
				</div>

				<div v-show='!bIsOrdinarypost && !bIsStickypost' class="no_topic">
					<span>
						<img src="./../images/no_topic.png" alt="no_topic">
					</span>
					<p>还没有任何话题哦～</p>
				</div>

				<div v-show='bIsSlideUp' class="loadon">
					<p>加载中...</p>
				</div>
			</div>

			<div class="footer">
				<!-- <div class="breif_btn" @click='enterBreif()'>
					<span class="icon iconfont">&#xe632;</span>
					<a href="###">管理员</a>
				</div> -->
				<div class="news_btn" @click='enterNews()'>
					<span class="icon iconfont">&#xe93e;</span>
					<a href="###">消息</a>
					<b v-show='bIsNews'></b>
				</div>
				<div class="mine_btn" @click='enterMine()'>
					<span class="icon iconfont">&#xe60b;</span>
					<a href="###">我的</a>
				</div>
				<div class="topic_btn" @click='enterTopic()'>
					<span class="icon iconfont">&#xe626;&nbsp;发表话题</span>
				</div>
			</div>
		</div>

		<div v-show='bIsTips' class="tips">
			<span class="icon iconfont">&#xe63f;</span>
			<p>{{tipWords}}</p>
		</div>

		<div v-show='bIsFromService' class="switch" @click='click2Switch'>
			<p>管理<br />社区</p>
		</div>

		<commentarea v-show='bIsComment' :author='child_author' :rpid='child_pid' :btnName='"评论"' @cancel='closeComment' @comment="okComment"></commentarea>

		<div class="issueType" v-show='bIsIssueTypeShow' @click='click2HideIssuePop'>
			<div class="typeBox">
				<div class="typeChoose">
					<ul class="clearfix">
						<li>
							<span @click='clickToIssue("TXT")'><img src="./../images/icons_3.png" alt="i"></span>
							<p @click='clickToIssue("TXT")'>图文</p>
						</li>
						<li>
							<span @click='clickToIssue("VIDEO")'><img src="./../images/icons_4.png" alt=""></span>
							<p @click='clickToIssue("VIDEO")'>视频</p>
						</li>
					</ul>
				</div>
				<div class="typeCancel">
					<input type="button" name="" value="取消" @click='hideIssueBtn'>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	import {RefrashOrLoadonByScroll} from './../compjs/refrashorloadonbyscroll.js';
	import {ReturnToTop} from './../compjs/returntotop.js';
	import {FadeAway} from './../compjs/fadeaway.js';
	import commentarea from './../compchild/comment.vue';
	import wx from 'weixin-js-sdk';
	import sha1 from 'sha1';
	export default({
		data() {
			return {
				pageCount: 0,
				bIsNews: false,  // 是否有新消息
				bIsStickypost: false,
				bIsOrdinarypost: false,
				ismanager: null,  // 管理员等级（0为非成员，1为群主，2普通管理员，4普通成员）
				uid: null,  // 用户ID
				fid: null,
				more: 1,  // 帖子是否还有
				bIsTips: false,
				tipWords: '',
				comp_name: '',
				arraySticky: [
					// {
					// 	tid: 'tid0',
					// 	subject: '0标题最多显示一行，超过一行显示省略号，标题最多显示一行，超过一行显示省略号'
					// },
				],
				arrStickyCache: [],
				bIsShowStickyMore: false,
				bIsClickShowMoreBtn: false,
				arrayOrdinary: [
					// {
					// 	subtime: '2017-01-01 15:00:00',        //帖子发布时间 格式：2017-01-01 15:00:00
					// 	tid: 'tid1',            //主贴ID
					// 	pid: 'pid1',            //一楼对应的pid
					// 	authorid: 'authorid1',       //作者ID
					// 	author: '王先森_nlg5',         //作者名
					// 	subject: '标题最多显示三行，超过三行…',        //帖子标题
					// 	replies: '12',        //评论数
					// 	recommend_add: '76',  //点赞数
					// 	message: '我是内容我是汉仪旗黑我是内容我是汉仪旗黑我是内容我是汉仪旗黑我是内容我是汉仪旗黑我是内容我是汉仪旗黑我是内容我是汉仪旗黑我是内容我是汉仪旗黑我是内容我是汉仪旗黑',        //帖子内容
					// 	imgurl: [
					// 		'http://192.168.0.234/yich/uc_server/data/avatar/000/00/01/15_avatar_middle.jpg',
					// 		'http://192.168.0.234/yich/uc_server/data/avatar/000/00/01/15_avatar_middle.jpg',
					// 	],         //帖子内容图片
					// 	imgcount: '2',       //图片个数
					// 	avatarimg: 'http://192.168.0.234/yich/uc_server/data/avatar/000/00/01/15_avatar_middle.jpg',      //作者头像
					// 	grouptitle: '新手上路',     //作者等级 如：新手上路
					// 	tcount: '2',         //该主帖是否已关注 1已关注，2未关注
					// 	scount: '2',         //该主帖是否已点赞 1已点赞，2未点赞
					// },
				],
				count: 0,
				arrayManager: [],
				bIsPullDown: true,
				bIsSlideUp: false,
				booRefrash: true,
				booLoadon: true,
				reElHeight: 0,
				taElHeight: 0,
				windowHeight: 0,
				child_author: '',
				child_pid: '',
				bIsComment: false,
				bIsFromService: false,
				commentItem: {},

				// issue video
				bIsIssueTypeShow: false,
				players: [],
				playinger: {},

				// comp info
				compName: '--',
				compThreads: '0',
				compUsers: '0',
				compIcon: require('../images/robbin.jpg'),
				compSign: 0,
				strSign: '签到',
			}
		},
		beforeCreate() {
			// loading show
			// this.Loading.show("load");
			
			// document.title = localStorage.comp_name?JSON.parse(localStorage.comp_name):".";
			
			var myScript2 = document.createElement("script");
            myScript2.type = "text/javascript";
            myScript2.src ="./../../../../redev/wechat_for_comp/lib/aliplayer-h5-min.js";
            document.body.appendChild(myScript2);
		},
		created() {
			// 配置微信JS-SDK
			this.getWxConfig();
		},
		beforeMount() {  // TODO: 解决 ios 系统，mounted 挂载不上，导致页面不显示数据
			let that = this;

			// post for init layout
			this.pageCount = 0;
			this.arrayOrdinary = [];
			let url = window.publicPath + '/home.php';
			let params = {
				op: 'home_thread', 
				page: this.pageCount
			};
			this.ajax(url, params, function(res) {
				that.drawPages(res);

				// manager
				let mUrl = window.publicPath + '/home.php';
				let mParams = {
					op: 'group_managers'
				};
				setTimeout(function() {
					that.ajax(mUrl, mParams, function(res) {
						let mResult = res.body;
						if(mResult && mResult.groupusers) {
							// if(mResult.groupusers.manager && mResult.groupusers.manager.length > 0) {
							// 	that.arrayManager = mResult.groupusers.manager;
							// 
							// 	that.arrayManager.forEach(function(man, mindex) {
							// 		man.avatarimg += "?" + Math.round(Math.random()*8999 + 1000);
							// 	});
							// }
							
							if(mResult.groupusers.info) {
								that.compName = mResult.groupusers.info.name?mResult.groupusers.info.name:'--';
								that.compThreads = mResult.groupusers.info.threads?mResult.groupusers.info.threads:'0';
								that.compUsers = mResult.groupusers.info.users?mResult.groupusers.info.users:'0';
								that.compIcon = mResult.groupusers.info.icon?mResult.groupusers.info.icon:'../images/robbin.jpg';
							}
						}
					});
				}, 0);
			});
		},
		mounted: function mounted() {
			let that = this;

			// init
			document.body.onload = function() {
				let target = document.querySelector('div.content');
				let refrashEl = document.querySelector('div.refrash'); 
				let loadonEl = document.querySelector('div.loadon');
				let footerEl = document.querySelector('div.footer');
				that.reElHeight = refrashEl.offsetHeight;
				that.windowHeight = document.body.offsetHeight;

				let obj = {
					target: target,
					refrashEl: refrashEl,
					loadonEl: loadonEl,
					footerEl: footerEl,
					booRefrash: that.booRefrash,
					booLoadon: that.booLoadon,
				};

				that.refrashOrLoadonByScroll(obj, function(afterrefrashCallback) {
					// refrash
					that.pageCount = 0;
					that.arrayOrdinary = [];
					that.arraySticky = [];
					that.arrStickyCache = [];
					that.bIsShowStickyMore = false;
					let refrashUrl = window.publicPath + '/home.php';
					let refrashParams = {
						op: 'home_thread', 
						page: that.pageCount
					};
					that.ajax(refrashUrl, refrashParams, function(res) {
						setTimeout(function() {
							that.drawPages(res);
							afterrefrashCallback();
						}, 50);
					});
				}, function(afterLoadonCallback) {
					// loadon
					let loadonUrl = window.publicPath + '/home.php';
					let loadonParams = {
						op: 'home_thread', 
						page: ++that.pageCount
					};
					that.ajax(loadonUrl, loadonParams, function(res) {
						setTimeout(function() {
							that.drawPages(res);

							if(res.body) {
								// count
								let count = res.body.count;

								// ordinarypost(普通帖) 
								if(res.body.threads) {
									let allthread = res.body.threads.allthread;
									if(allthread) {
										if(that.count > allthread.length) {
											that.booLoadon = false;
										}
									}
								}
							}
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

				// 监听 scroll , 关闭 评论
				document.querySelector(".main").addEventListener("scroll", function() {
					that.closeComment(false);
				}, false);
			};

			// issue topic ok ?
			if(localStorage && localStorage.bIsIssueOk) {
				that.$store.state.bIsIssueOk = JSON.parse(localStorage.bIsIssueOk);
				if(that.$store.state.bIsIssueOk) {
					that.bIsTips = true;
					that.tipWords = "发表成功";

					setTimeout(function() {
						that.bIsTips = false;
						that.$store.state.bIsIssueOk = false;
						localStorage.bIsIssueOk = JSON.stringify(that.$store.state.bIsIssueOk);
					}, 1000);
				}
			}

			// wifi???
			setInterval(function() {
				that.getNetworkType();
			}, 1000)
		},
		updated() {
			
		},
		methods: {
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
				let result = res.body;

				if(result) {
					// cache
					// 解决刷新界面，store又初始化----感觉这个地方很狗血，用了store，又用localstorage，  TODO：需要优化？
					localStorage.fid = JSON.stringify(result.fid?result.fid:"");
					localStorage.uid = JSON.stringify(result.uid?result.uid:"");
					localStorage.ismanager = JSON.stringify(result.ismanager?result.ismanager:"");
					that.$store.state.ismanager = result.ismanager;
					that.$store.state.fid = result.fid;
					that.$store.state.uid = result.uid;

					// bIsFromService
					if(result.isservice) {
						that.bIsFromService = true;
					}
					else {
						that.bIsFromService = false;
					}

					// comp_name
					that.comp_name = result.comp_name;
					// document.title = that.comp_name;
					that.$store.state.comp_name = that.comp_name;
					localStorage.comp_name = JSON.stringify(that.comp_name?that.comp_name:"");

					// news ?
					if(0 < parseInt(result.news)) {
						that.bIsNews = true;
					}

					// more ?
					// that.more = result.more;
					// if(1 == parseInt(that.more)) {
					// 	that.booLoadon = true;
					// }else {
					// 	that.booLoadon = false;
					// }

					// count
					that.count = result.count;

					// uid
					that.uid = result.uid;

					// ismanager
					that.ismanager = result.ismanager;

					// sign status
					that.compSign = result.sign;
					if(1 == that.compSign) {
						that.strSign = "已签到";
					}
					else {
						that.strSign = "签到";
					}

					// stickypost(置顶帖) ?
					if(result.threads) {
						let topthread = result.threads.topthread;
						if(topthread && 0 < topthread.length) {
							that.arraySticky = [];
							that.arrStickyCache = [];
							that.bIsStickypost = true;
							topthread.forEach(function(item, index) {
								that.arraySticky.push(item);
								if(index < 3) {
									that.arrStickyCache.push(item);
								}
							});
						}
					}
					
					// ordinarypost(普通帖) ?
					if(result.threads) {
						let allthread = result.threads.allthread;
						if(allthread) {
							if(0 < allthread.length) {
								that.bIsOrdinarypost = true;

								allthread.forEach(function(item, index) {
									item.avatarimg += "?" + Math.round(Math.random()*8999 + 1000);
									item.idIndex = that.getRandom();
									that.arrayOrdinary.push(item);

									// 视频
									if(item.v_count && 1 == item.v_count) {
										// 请求 媒体信息
										that.$http.post(window.publicPath + '/getSts.php', {action: 'upload'}, {emulateJSON: true}).then(function(stsRes) {
									      	// console.log(stsRes);

									      	// 请求 媒体信息    TODO??????????????????????????
											// let fileUrl = "http://compinput.oss-cn-hangzhou.aliyuncs.com" + thread_info.v_url?(thread_info.v_url.videoName?thread_info.v_url.videoName:''):'';
											let coverURL = item.v_url?(item.v_url.shotCut?item.v_url.shotCut:''):'';
				      						let mediaId = item.v_url?(item.v_url.videoId?item.v_url.videoId:''):'';
											that.$http.post(window.publicPath + '/aliMts/getMts.php', {action: 'getSignature', mediaId: mediaId, expireTime: stsRes.body.Expiration}, {emulateJSON: true}).then(function(mtsRes) {
												// console.log(mtsRes);
												document.querySelector('#mod_player_' + item.idIndex).html = '';
										      	let player = new Aliplayer({
										            id: 'mod_player_' + item.idIndex,
										            width: '100%',
										            height: '100%',
										            autoplay: false,
										            // playsinline: window.isiOS?true:false,
										            // useH5Prism: true,
										            rePlay: false,
										            x5_type: 'flash',
										            // x5_video_position: 'center',
										            // preload: true,
										            // disableFullScreen: false,
										            // x5_fullscreen: true,
										            

										            //支持播放地址播放,此播放优先级最高
										            // source : "http://cdnvod.ant188.com/comproot/video/71c3dfbc22a34a0fa40e5c5870395d80/act-ss-mp4-ld/20170929210850.mp4",

										            //播放方式三：仅MTS用户使用
										            vid : mediaId,
										            accId: stsRes.body.AccessKeyId,
										            accSecret: stsRes.body.AccessKeySecret,
										            stsToken: stsRes.body.SecurityToken,
										            domainRegion: 'cn-hangzhou',
										            authInfo: '{"ExpireTime":"'+ stsRes.body.Expiration +'","MediaId":"'+ mediaId +'","Signature":"'+ JSON.parse(mtsRes.body) +'"}',
										            cover: coverURL,
										            skinLayout: [
										            	{name: "bigPlayButton", align: "blabs", x: 30, y: 160}
										            ]
									            },function(player){
									                console.log('播放器创建好了。');

									                that.players.push(player);

									                player.on("play", function(aa) {
									                	console.log("play");

									                	if(that.players && that.players.length > 0) {
									                		that.players.forEach(function(pl, pIndex) {
									                			// console.log(pl);
									                			if(pl._options.id != aa.target.id && (pl.played||pl.loaded)) {
									                				pl.pause();
									                			}
									                		});
									                	}
									                	
									                	that.playinger.id = aa.target.id;

									     				document.querySelector("#" + aa.target.id + " .prism-cover").style.display = "none";
									     				document.querySelector("#" + aa.target.id + " video").style.width = "100%";
						                				document.querySelector("#" + aa.target.id + " video").style.height = "100%";
									                });

										            player.on("ended", function(aa) {
									                	console.log("ended");

									                	document.querySelector("#" + aa.target.id + " .prism-cover").style.display = "block";
									                	document.querySelector("#" + aa.target.id + " video").style.width = "0";
						                				document.querySelector("#" + aa.target.id + " video").style.height = "0";
									                });

									                player.on("pause", function(aa) {
									                	console.log("pause");

									                	document.querySelector("#" + aa.target.id + " .prism-cover").style.display = "block";
									                	document.querySelector("#" + aa.target.id + " video").style.width = "0";
					                					document.querySelector("#" + aa.target.id + " video").style.height = "0";
									                });
									            });
											}, function() {});
								      	}, function() {});
									}
								});

								that.arrayOrdinary.forEach(function(item, index) {
									// 限制为3张
									if(item.imgurl && item.imgurl.length > 3) {
										item.imgurl.splice(3, item.imgurl.length);
									}

									// delHtmlTag
									item.message = that.delHtmlTag(item.message);
								});
							}

							if(that.count > allthread.length) {
								that.booLoadon = false;
							}
						}
					}

					// loading hide
					setTimeout(function() {
						that.Loading.hide("load");
					}, 1000);
				}
			},
			enterNews: function() {
				this.bIsNews = false;
				// window.location.href = window.publicPath + "/dist/news/news.html"; 
				let reurl = "c_" + "news";
				window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
			},
			enterBreif: function() {
				// window.location.href = window.publicPath + "/dist/managementteam/managementteam.html"; 
				let reurl = "c_" + "managementteam";
				window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
			},
			enterMine: function() {
				// window.location.href = window.publicPath + "/dist/minedetailinfo/minedetailinfo.html"; 
				let reurl = "c_" + "minedetailinfo";
				window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
			},
			enterTopic: function() {
				// window.location.href = window.publicPath + "/dist/issuetopic/issuetopic.html"; 
				this.bIsIssueTypeShow = true;
			},
			linkToSticky: function(tid) {
				console.log(tid);

				localStorage.tid = JSON.stringify(tid?tid:"");

				// window.location.href = window.publicPath + "/dist/topicdetail/topicdetail.html";
				let reurl = "c_" + "topicdetail";
				window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
			},
			linkToTopicDetail: function(tid) {
				console.log(tid);

				localStorage.tid = JSON.stringify(tid?tid:"");

				// window.location.href = window.publicPath + "/dist/topicdetail/topicdetail.html";
				let reurl = "c_" + "topicdetail";
				window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
			},
			linkToSbDetailInfo: function(authorid) {
				console.log(authorid);

				localStorage.authorid = JSON.stringify(authorid?authorid:"");

				if(authorid == this.uid) {
					// window.location.href = window.publicPath + "/dist/minedetailinfo/minedetailinfo.html"; 
					let reurl = "c_" + "minedetailinfo";
					window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
				}
				else {
					// window.location.href = window.publicPath + "/dist/sbdetailinfo/sbdetailinfo.html?p_uid=" + authorid;
					let reurl = "c_" + "sbdetailinfo";
					window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
				}
			},
			clickToFllowTopic: function(item) {
				console.log(item.tid + " " + item.tcount);
				// item.tcount = 1;

				this.$http.post(window.publicPath1 + '/home.php', {op: 'thread_focus', tid: item.tid}, {emulateJSON: true}).then(function(res) {
					console.log(res);
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
					console.log(error);
					window.location.href = window.publicPath + "/dist/error404/error404.html"; 
				});
			},
			clickToAgree: function(item) {
				console.log(item.tid + " " + item.scount);
				// item.scount = 1;

				this.$http.post(window.publicPath1 + '/home.php', {op: 'thread_support', tid: item.tid, pid: item.pid}, {emulateJSON: true}).then(function(res) {
					console.log(res);
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
					console.log(error);
					window.location.href = window.publicPath + "/dist/error404/error404.html"; 
				});
			},
			showMore: function() {
				let that = this;
				let showBtnEl = document.querySelector('div.showmore');
				this.bIsClickShowMoreBtn = true;
				if(this.bIsShowStickyMore) {
					this.bIsShowStickyMore = false;
					showBtnEl.className = "showmore";

					let cacheLength = this.arrStickyCache.length;
					for(let i = 0; i < cacheLength; i++) {
						if(that.arrStickyCache.length > 3) {
							that.arrStickyCache.splice(that.arrStickyCache.length-1, 1);
						}
					}
				}
				else if(!this.bIsShowStickyMore) {
					this.bIsShowStickyMore = true;
					showBtnEl.className = "showmoreOk showmore";

					this.arraySticky.forEach(function(item, index) {
						if(index >= 3) {
							that.arrStickyCache.push(item);
						}
					});
				}
			},
			linkToComment: function(item) {
				// window.location.href = window.publicPath + "/dist/comment/comment.html?rpid=" + item.pid + "&author=" + escape(item.author);
				this.commentItem = item;
				this.child_author = item.author;
				this.child_pid = item.pid;
				if(this.bIsComment) {
					this.bIsComment = false;
				}else {
					this.bIsComment = true;
				}
			},
			closeComment: function(booComment) {
				this.bIsComment = booComment;
			},
			okComment: function(booComment) {
				if(booComment) {
					this.commentItem.replies++;
					this.bIsComment = false;
				}
				else {
					this.bIsComment = false;
				}
			},
			refrashOrLoadonByScroll: function(obj, refrashCallback, loadonCallback) {
				RefrashOrLoadonByScroll(obj, refrashCallback, loadonCallback);
			},
			returnToTop: function(obj) {
				ReturnToTop(obj);
			},
			beforeEnter: function (el) {
		    	el.style.opacity = 0;
		    	el.style.height = 0;
		    },
		    enter: function (el, done) {
		    	if(this.bIsClickShowMoreBtn) {
		    		var delay = (parseInt(el.dataset.index)-5) * 25;
					setTimeout(function () {
						Velocity(
							el,
							{ opacity: 1, height: el.children[1].getBoundingClientRect().height + "px"},
							{ complete: done }
						)
					}, delay)
		    	}
		    	else {
		    		var delay = parseInt(el.dataset.index) * 25;
					setTimeout(function () {
						Velocity(
							el,
							{ opacity: 1, height: el.children[1].getBoundingClientRect().height + "px"},
							{ complete: done }
						)
					}, delay)
		    	}
		    },
		    leave: function (el, done) {
		    	if(this.bIsClickShowMoreBtn) {
		    		var delay = (parseInt(el.dataset.index)-5) * 150
					setTimeout(function () {
						Velocity(
							el,
							{ opacity: 0, height: 0 },
							{ complete: done }
						)
					}, delay)
		    	}
		    	else {
		   			// var delay = parseInt(el.dataset.index) * 0
					// setTimeout(function () {
					// 	Velocity(
					// 		el,
					// 		{ opacity: 0, height: 0 },
					// 		{ complete: done }
					// 	)
					// }, delay)
		    	}
		    },
		    getReg: function(name) {
				let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
				let r = window.location.search.substr(1).match(reg);
				if(r!=null) return  unescape(r[2]); return null;
			},
			click2Switch: function() {
				// window.location.href = window.publicPath3 + "/dist/compswitch/compswitch.html";
				let reurl = "s_" + "compswitch";
				window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
			},
			clickToIssue: function(type) {
				let that = this;
				switch (type) {
					case "TXT": {
						// window.location.href = window.publicPath + "/dist/issuetopic/issuetopic.html"; 
						let reurl = "c_" + "issuetopic";
						window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
						break;
					}
					case "VIDEO": {
						// window.location.href = window.publicPath + "/dist/issuevideo/issuevideo.html"; 
						let reurl = "c_" + "issuevideo";
						window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
						break;
					}
				}
			},
			click2HideIssuePop: function(e) {
				if(e.currentTarget == e.target) {
					this.bIsIssueTypeShow = false;
				}
			},
			hideIssueBtn: function() {
				this.bIsIssueTypeShow = false;
			},
			delHtmlTag: function(str) {
				let reg = /<img name="emojis"[^>]+>/g;
				let emReg = /id=".*?"/;
				let arrEmoji = [];
				str = str.replace(reg, function(match) {
					let id = "__" + match.match(emReg) + "__";
					arrEmoji.push({img: match, id: id});
					return id;
				});

				str = str.replace(/<[^>]+>/g,"");  // 去掉所有的html标记

				for(let i = 0; i < arrEmoji.length; i++) {
					str = str.replace(arrEmoji[i].id, function(ma) {
						return arrEmoji[i].img;
					});
				}

				return str;
			},
			addClickActive: function(e) {
				e.currentTarget.parentNode.parentNode.style.background = "rgba(0, 0, 0, 0.05)";
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
			getRandom: function() {
				let arrAtoZ = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
				let intRandom = arrAtoZ[Math.round(Math.random()*25)] + (Math.round(Math.random()*899)+100).toString();
				return intRandom;
			},
			clickToSign: function() {
				let that = this;
				if(1 != this.compSign) {
					let url = window.publicPath + '/home.php';
					let params = {
						op: 'comp_sign'
					};
					this.ajax(url, params, function(res) {
						console.log(res);
						let result = res.body;
						if(result && "1" == result.result) {
							console.log("签到成功");

							that.compSign = 1;
							that.strSign = "已签到";

							FadeAway({
								text: "+3",
								parentNode: document.querySelector(".memberSign"),
							});
						}
						else if("-1" == result) {
							console.log("今天已签到，请勿重复签到");

							that.compSign = 1;
							that.strSign = "已签到";
						}
						else {
							console.log("签到失败");
						}
					});
				}
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
		},
	});
</script>
<style lang="less" scoped>
</style>