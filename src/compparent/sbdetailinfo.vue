<template>
	<div class="main">
		<div id="sbinfo" class="sbinfo">
			<div v-show='bIsPullDown' class="refrash">
				<p>下拉刷新</p>
			</div>

			<div class="sbheader">
				<div class="sbheadpic">
					<img :src='userinfo.avatarimg' alt="robbin">
				</div>	
				<div class="sbname">
					<p>
						{{userinfo.username}}
						<label>新手上路</label>
					</p>
				</div>
				<div v-show='userinfo.groupname' class="gname">
					<p>
						<span>(<b>{{userinfo.groupname}}</b>)</span>
					</p>
				</div>
				<div class="sbhandle">
					<span class="fans">粉丝<b>{{userinfo.follower}}</b></span>
					<span class="topics">话题<b>{{userinfo.threads}}</b></span>
				</div>
				<div class="sbfollow">
					<!-- <span v-if='userinfo.followed==2' @click='clickToFollowSb(userinfo)' class="icon iconfont" :style="{color: '#ff3f80'}">&#xe659;</span> -->
					<span v-if='userinfo.followed==2' @click='clickToFollowSb(userinfo)' class="icon iconfont" :style="{color: '#ff3f80'}"><img src="./../images/follow.png"alt=""></span>
					<span v-if='userinfo.followed==1' @click='clickToFollowSb(userinfo)' class="icon iconfont" :style="{color: '#fff'}">&#xe698;</span>
				</div>
				<div class="mg" v-show='(ismanager==1 && userinfo.level!=1) || (ismanager==2 && userinfo.level!=1 && userinfo.level!=2)'>
					<span class="icon iconfont" @click='click2MgSb'>&#xe609;</span>
				</div>
			</div>

			<div class="sbtopic">
				<ul v-if='userthread&&userthread.length > 0'>
					<template v-for='item in userthread'>
						<li class="clearfix">
							<div class="user_article" @click='linkToTopicDetail(item.tid); addClickActive($event);'>
								<p class="title">{{item.subject}}</p>
								<p class="datetime">{{item.subtime}}</p>
								<p class="mainword" v-if='1!=item.v_count' v-html='item.message'></p>
								<p class="mainword" v-if='1==item.v_count'>[视频]</p>
							</div>
							<div class="user_foot">
								<!-- 已关注 -->
								<div v-if='item.tcount==1' class="follow" @click='clickToFllowTopic(item)'><b class="icon iconfont">&#xe63f;</b>已关注</div>
								<!-- 点击关注 -->
								<div v-if='item.tcount==2' class="follow" @click='clickToFllowTopic(item)'><b class="icon iconfont">&#xe601;</b>点击关注</div>  

								<div class="discuss">
									<p>
										<span v-if='item.scount == 1' class="icon iconfont" @click='clickToAgree(item)'>&#xe63a;<b>{{item.recommend_add}}</b></span>
										<span v-if='item.scount == 2' class="icon iconfont" @click='clickToAgree(item)'>&#xe602;<b>{{item.recommend_add}}</b></span>

										<span class="icon iconfont" @click='linkToComment(item)'>&#xe64e;<b>{{item.replies}}</b></span>
									</p>
								</div>
							</div>
						</li>
					</template>
				</ul>

				<div v-if='!userthread||userthread.length <= 0' class="noTopic">
					<span>
						<img src="./../images/detailedinfo.png" alt="">
					</span>
					<p>还没有任何话题哦～</p>
				</div>
			</div>

			<div v-show='!userthread || userthread.length < 0' class="notopic">
				<span>
					<img src="./../images/no_topic.png" alt="no_topic">
				</span>
				<p>还没有任何话题哦～</p>
			</div>

			<div v-show='bIsSlideUp' class="loadon">
				<p>上滑加载</p>
			</div>
		</div>

		<commentarea v-show='bIsComment' :author='child_author' :rpid='child_pid' :btnName='"评论"' @cancel='closeComment' @comment="okComment"></commentarea>
		<mgsbdata v-show="bIsShowBan" :banned='userinfo.userinfo' :chaUid='authorid' @close='click2CloseMgSb' @setBan='click2SetBan' @uapdateRemark='uapdateRemark'></mgsbdata>
	</div>
</template>
<script>
	import {RefrashOrLoadonByScroll} from './../compjs/refrashorloadonbyscroll.js';
	import {ReturnToTop} from './../compjs/returntotop.js';
	import commentarea from './../compchild/comment.vue';
	import mgsbdata from './../compchild/mgsbdata.vue';
	export default({
		data() {
			return {
				userinfo: {
					avatarimg: require('./../images/robbin.jpg'),  // 头像
					username: '用户名',  // 用户名
					followed: 2,
					follower: 12,  // 粉丝数
					credits: 22,  // 积分数
					threads: 21,  // 主贴数
				},
				userthread: [
					// {
					// 	subtime: '2017-04-01 15:55:28',  // 发表的主贴的时间 如：2017-04-01 15:55:28
					// 	tid: '32431243',  // 发表的主贴的ID
					// 	pid: '54325432',  // 一楼对应的pid
					// 	subject: '发表的主贴的标题',  // 发表的主贴的标题
					// 	replies: 66,  // 发表的主贴的评论数
					// 	recommend_add: 56,  // 发表的主贴的点赞数
					// 	message: '发表的主贴的内容',  // 发表的主贴的内容
					// 	tcount: 1,  // 发表的主贴是否已关注 1为关注，2为未关注
					// 	scount: 2,  // 发表的主贴是否已点赞 1为已赞，2为未赞
					// 	imgcount: 1,  // 图片个数
					// 	imgurl: [
					// 		require('./../images/robbin.jpg'),
					// 	],
					// },
				],
				count: 0,
				authorid: '',
				pageCount: 0,
				bIsSlideUp: true,
				bIsLoadon: false,
				more: 1,
				comp_name: '',
				booRefrash: false,
				booLoadon: true,
				child_author: '',
				child_pid: '',
				bIsComment: false,
				ismanager: '',
				bIsShowBan: false,
				commentItem: {},
			}
		},
		mounted() {
			let that = this;
			
			this.$store.state.comp_name = JSON.parse(localStorage.comp_name);
			this.$store.state.ismanager = JSON.parse(localStorage.ismanager);
			this.comp_name = this.$store.state.comp_name;
			this.ismanager = this.$store.state.ismanager;
			// document.title = this.comp_name;

			// this.refrashOrLoadon();

			// this.$store.state.authorid = JSON.parse(localStorage.authorid);
			// let authorid = this.$store.state.authorid;
			// this.authorid = authorid;
			this.authorid = this.getReg("p_uid");

			let url = window.publicPath + '/home.php';
			let params = {
				op: 'user_detail', 
				p_uid: this.authorid, 
				page: this.pageCount
			};
			this.ajax(url, params, function(res) {
				that.drawPages(res);
			});

			// 下拉刷新+上滑加载
			document.body.onload = function() {
				// init
				let target = document.querySelector('div.sbinfo');
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
					let loadonUrl = window.publicPath + '/home.php';
					let loadonParams = {
						op: 'user_detail', 
						p_uid: that.authorid, 
						page: ++that.pageCount
					};
					that.ajax(loadonUrl, loadonParams, function(res) {
						setTimeout(function() {
							that.drawPages(res);
							afterLoadonCallback(that.booLoadon);
						}, 50);
					});
				});

				// to top
				let topObj = {
					targetEl: document.querySelector('div.main'),
					// footerEl: document.querySelector('div.footer'),
				}
				that.returnToTop(topObj);
			};
		},
		updated() {
			// console.log("updated");
		},
		methods: {
			clickToFollowSb: function(userinfo) {
				let that = this;
				this.$http.post(window.publicPath + '/home.php', {op: 'user_focus', fuid: this.authorid}, {emulateJSON: true}).then(function(res) {
					// console.log(res);
					let result = res.body;

					switch(Number(result.result)) {
						case 1: {
							// 关注
							userinfo.follower++;
							userinfo.followed = 1;
							break;
						}
						case 2: {
							// 取关
							userinfo.follower--;
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
				item.tcount = 1;

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
			linkToTopicDetail: function(tid) {
				// console.log(tid);

				localStorage.tid = JSON.stringify(tid);

				// window.location.href = window.publicPath + "/dist/topicdetail/topicdetail.html";
				let reurl = "c_" + "topicdetail";
				window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
			},
			clickToAgree: function(item) {
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
			linkToComment: function(item) {
				// window.location.href = window.publicPath + "/dist/comment/comment.html?rpid=" + item.pid + "&author=" + item.author;
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

				let userinfo = result.userinfo;
				if(userinfo) {
					userinfo.avatarimg += "?" + Math.round(Math.random()*8999 + 1000);
					this.userinfo = userinfo;
				}

				let userthread = result.userthread;
				if(userthread) {
					if(userthread.length > 0) {
						userthread.forEach(function(item, index) {
							that.userthread.push(item);
						});
					}
					
					if(that.count > userthread.length) {
						that.booLoadon = false;
					}
				}

				this.count = result.count;
			},
			refrashOrLoadonByScroll: function(obj, refrashCallback, loadonCallback) {
				RefrashOrLoadonByScroll(obj, refrashCallback, loadonCallback);
			},
			returnToTop: function(obj) {
				ReturnToTop(obj);
			},
			getReg: function(name) {
				let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
				let r = window.location.search.substr(1).match(reg);
				if(r!=null) return  unescape(r[2]); return null;
			},
			click2MgSb: function() {
				this.bIsShowBan = true;
				this.htmlScrollPok();
			},
			click2CloseMgSb: function() {
				this.bIsShowBan = false;
				this.htmlScrollOk();
			},
			click2SetBan: function() {

			},
			uapdateRemark: function(steRemarks) {
				this.userinfo.groupname = steRemarks;
			},
			htmlScrollOk: function() {
				let htmlEl = document.querySelector('html');
				var htmlTop = parseFloat(htmlEl.getBoundingClientRect().top);
				htmlEl.style.overflow = "auto";
				htmlEl.style.position = "absolute";
				htmlEl.style.top = "0px";
				document.body.scrollTop = Math.abs(htmlTop);
			},
			htmlScrollPok: function() {
				let htmlEl = document.querySelector('html');
				var scrollTop = document.body.scrollTop;
				htmlEl.style.overflow = "hidden";
				htmlEl.style.position = "fixed";
				htmlEl.style.top = -scrollTop + "px";
			},
			addClickActive: function(e) {
				e.currentTarget.parentNode.style.background = "rgba(0, 0, 0, 0.05)";
			},
		},
		watch: {

		},
		components: {
			'commentarea': commentarea,
			'mgsbdata': mgsbdata,
		},
	});
</script>
<style type="text/css" media="screen">
</style>