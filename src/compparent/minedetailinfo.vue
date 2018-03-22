<template>
	<div class="main">
		<div id="mine" class="mine">
			<div v-show='bIsPullDown' class="refrash">
				<p>下拉刷新</p>
			</div>

			<div class="mineheader clearfix">
				<div class="minepic" @click='linkToUpdateHeadpic(myinfo)'>
					<img :src='myinfo.avatarimg' alt="">
				</div>

				<div class="mineinfo">
					<span>{{myinfo.username}}</span>
					<label>新手上路</label>
					<p>
						<span class="fans">粉丝<b>{{myinfo.follower}}</b></span>
						<span class="scores">积分<b>{{myinfo.credits}}</b></span>
						<span class="topics">话题<b>{{myinfo.threads}}</b></span>
					</p>
				</div>
			</div>

			<div class="mineorder clearfix">
				<p title="ISSUE_TOPIC" @click='orderActive'>
					<strong>{{myinfo.threads}}</strong>
					<span>发表的话题</span>
				</p>
				<p title="ISSUE_COMMENT" @click='orderActive'>
					<strong>{{myinfo.posts}}</strong>
					<span>发表的留言</span>
				</p>
				<p title="FOLLOW_TOPIC" @click='orderActive'>
					<strong>{{myinfo.fThreads}}</strong>
					<span>关注的话题</span>
					<b v-show='myinfo.ft_count == 1'></b>
				</p>
				<p title="FOLLOW_AUTHOR" @click='orderActive'>
					<strong>{{myinfo.fUsers}}</strong>
					<span>关注的作者</span>
					<b v-show='myinfo.fu_count == 1'></b>
				</p>
			</div>

			<div name="ISSUE_TOPIC" v-show='bIsIssueTopic' class="public">
				<ul>
					<template v-for='item in private'>
						<li class="clearfix">
							<div class="user_article" @click='linkToTopicDetail(item.tid); addClickActive($event);'>
								<p class="title">{{item.subject}}</p>
								<p class="datetime">{{item.subtime}}</p>
								<p class="mainword" v-if='1!=item.v_count' v-html='item.message'></p>
								<p class="mainword" v-if='1==item.v_count'>[视频]</p>
							</div>
							<div class="user_foot">
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

				<div v-show='bIsNoCont' class="noContent">
					<span>
						<img src="./../images/issuedtopic.png" alt="">
					</span>
					<p>还没有发表任何话题哦～</p>
				</div>
			</div>

			<div name="ISSUE_COMMENT" v-show='bIsIssueComment' class="public">
				<ul>
					<template v-for='item in private'>
						<li>
							<p class="datetime">{{item.subtime}}</p>
							<p class="miancomment" v-html='item.my_message'></p>
							<p class="whichtopic" @click='linkToTopicDetail(item.tid); addClickActive($event);'>
								<span>评论话题</span><b>{{item.subject}}</b>
							</p>
						</li>
					</template>
				</ul>

				<div v-show='bIsNoCont' class="noContent">
					<span>
						<img src="./../images/publishedmess.png" alt="">
					</span>
					<p>还没有发表留言哦～</p>
				</div>
			</div>

			<div name="FOLLOW_TOPIC" v-show='bIsFollowTopic' class="public">
				<ul>
					<template v-for='item in private'>
						<li class="clearfix">
							<div class="user_info clearfix">
								<div class="user_pic" @click='linkToSbDetailInfo(item.authorid)'>
									<img :src='item.avatarimg' alt="">
									<b v-show='parseInt(item.viewed) == 0'></b>
								</div>
								<div class="user_name">
									<p class="username"><span @click='linkToSbDetailInfo(item.authorid)'>{{item.author}}</span><b :class='item.level != "1" && item.level != "2"?"icon iconfont":"icon iconfont manger"'>{{item.grouptitle}}</b></p>
									<p class="datetime">{{item.subtime}}</p>
								</div>
							</div>
							<div class="user_article" @click='linkToTopicDetail(item.tid); addClickActive($event);'>
								<p class="title">{{item.subject}}</p>
							</div>
							<div class="user_foot clearfix">
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

				<div v-show='bIsNoCont' class="noContent">
					<span>
						<img src="./../images/followedtopic.png" alt="">
					</span>
					<p>还没有关注的话题哦～</p>
				</div>
			</div>

			<div name="FOLLOW_AUTHOR" v-show='bIsFollowAuthor' class="public">
				<ul>
					<template v-for='item in private'>
						<li class="clearfix">
							<div class="user_info clearfix">
								<div class="user_pic" @click='linkToSbDetailInfo(item.uid)'>
									<img :src='item.avatarimg' alt="">
									<b v-show='parseInt(item.viewed) == 0'></b>
								</div>
								<div class="user_name">
									<p class="username"><span @click='linkToSbDetailInfo(item.uid)'>{{item.username}}</span></p>
									<p class="userfans">
										<span class="fans">粉丝<b>{{item.follower}}</b></span>
										<span class="scores">积分<b>{{item.credits}}</b></span>
										<span class="topics">话题<b>{{item.threads}}</b></span>
									</p>
								</div>
								<div class="follow">
									<p v-if='item.followed==2' @click='clickToFollowSb(item)' class="icon iconfont">&#xe659;</p>
									<p v-if='item.followed==1' @click='clickToFollowSb(item)' class="icon iconfont followed">&#xe698;</p>
								</div>
							</div>

							<div v-show='item.subject!=null && item.subject!="" && item.subject!=undefined' class="user_article" @click='linkToTopicDetail(item.tid); addClickActive($event);'>
								<p class="newtopic_name">{{item.subject}}</p>
								<p class="newtopic_time">{{item.subtime}}</p>
							</div>
						</li>
					</template>
				</ul>

				<div v-show='bIsNoCont' class="noContent">
					<span>
						<img src="./../images/followedauthor.png" alt="">
					</span>
					<p>还没有关注的作者哦～</p>
				</div>
			</div>

			<div v-show='bIsSlideUp' class="loadon">
				<p>上滑加载</p>
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

		<commentarea v-show='bIsComment' :author='child_author' :rpid='child_pid' :btnName='"评论"' @cancel='closeComment' @comment="okComment"></commentarea>
	</div>
</template>
<script>
	import {RefrashOrLoadonByScroll} from './../compjs/refrashorloadonbyscroll.js';
	import {ReturnToTop} from './../compjs/returntotop.js';
	import commentarea from './../compchild/comment.vue';
	export default({
		data() {
			return {
				myinfo: {
					avatarimg: require('./../images/robbin.jpg'),
					credits: '',
					follower: '',
					ft_count: 0,
					fu_count: 0,
					threads: '',
					username: '',

					// mine 
					threads: 0,
					posts: 0,
					fThreads:  0,
					fUsers:  0,
				},
				private: [
					{
						tid: '我发表的主贴的ID',  // 我发表的主贴的ID
						subject: '我发表的主贴的标题',  // 我发表的主贴的标题
						subtime: '2017-04-01 15:55:28',  // 我发表的主贴的时间 如：2017-04-01 15:55:28
						message: '我发表的主贴的内容',  // 我发表的主贴的内容
						recommend_add: '12',  // 我发表的主贴的点赞数
						replies: '22',  // 我发表的主贴的评论数
						imgurl: [
							require('./../images/robbin.jpg'),
						],  // 我发表的主贴的内容图片
						floor_message: '我发表的回复贴所对应的被回复贴的内容',  // 我发表的回复贴所对应的被回复贴的内容
						fid: '关注的主贴的群组ID',  // 关注的主贴的群组ID
						authorid: '关注的主贴的作者ID',  // 关注的主贴的作者ID
						author: '关注的主贴的作者名',  // 关注的主贴的作者名
						name: '网店美工',  // 关注的主贴的群组名 如：网店美工
						avatarimg: require('./../images/robbin.jpg'),  // 关注的主贴的作者头像
						grouptitle: '新手上路',  // 关注的主贴的作者用户等级 如：新手上路
						scount: '2',  // 关注的主贴是否已点赞 1为已赞，2为未赞
						uid: '关注的圈友的ID',  // 关注的圈友的ID
						username: '关注的圈友的用户名',  // 关注的圈友的用户名
						threads: '44',  // 关注的圈友的主贴数
						follower: '100',  // 关注的圈友的粉丝数
					},
				],
				count: 0,
				bIsIssueTopic: true,
				bIsIssueComment: false,
				bIsFollowTopic: false,
				bIsFollowAuthor: false,
				bIsPullDown: true,
				bIsSlideUp: true,
				booRefrash: false,
				booLoadon: true,
				uid: '',
				pageCount: 0,
				comp_name: '',
				child_author: '',
				child_pid: '',
				bIsComment: false,
				commentItem: {},
				bIsNoCont: false,
			}
		},
		beforeCreate() {
			// document.title = localStorage.comp_name?JSON.parse(localStorage.comp_name):".";
		},
		mounted() {
			// 初始状态
			let that = this;
			
			this.$store.state.comp_name = JSON.parse(localStorage.comp_name);
			this.comp_name = this.$store.state.comp_name;
			// document.title = this.comp_name;

			let allEl = document.querySelectorAll('div.mineorder')[0].children;
			allEl[0].className = "active";
			this.$store.state.uid = JSON.parse(localStorage.uid);
			this.uid = this.$store.state.uid;

			// init
			this.pageCount = 0;
			this.private = [];
			this.assortBtn("ISSUE_TOPIC", function() {});

			document.body.onload = function() {
				that.initRefrashOrLoadon();

				// to top
				let topObj = {
					targetEl: document.querySelector('div.main'),
					// footerEl: document.querySelector('div.footer'),
				}
				that.returnToTop(topObj);
			};
		},
		methods: {
			orderActive: function(e) {
				let that = this;
				let currentEl = e.target;
				if(currentEl.tagName != "P") {
					currentEl = currentEl.parentNode;
				}
				let allEl = document.querySelectorAll('div.mineorder p');
				for(let i = 0; i < allEl.length; i++) {
					let item = allEl[i];
					item.className = "";
				}

				currentEl.className = "active";

				this.pageCount = 0;
				this.private = [];
				this.count = 0;
				this.assortBtn(currentEl.title, function() {});
				this.booLoadon = true;
				this.initRefrashOrLoadon();
			},
			assortBtn: function(title, afterLoadonCallback) {
				let that = this;
				this.bIsNoCont = false;
				switch(title) {
					case "ISSUE_TOPIC": {

						this.bIsIssueTopic = true;
						let url = window.publicPath + '/home.php';
						let params = {
							op: 'home_private', 
							mythread: 1, 
							page: that.pageCount
						}
						this.ajax4Order(url, params, function(res) {
							setTimeout(function() {
								that.drawPages(res);
								afterLoadonCallback(that.booLoadon);
							}, 50)
						});
						break;
					}
					case "ISSUE_COMMENT": {
						this.bIsIssueComment = true;
						let url = window.publicPath + '/home.php';
						let params = {
							op: 'home_private', 
							mypost: 1, 
							page: that.pageCount
						}
						this.ajax4Order(url, params, function(res) {
							setTimeout(function() {
								that.drawPages(res);
								afterLoadonCallback(that.booLoadon);
							}, 50)
						});
						break;
					}
					case "FOLLOW_TOPIC": {
						this.bIsFollowTopic = true;
						let url = window.publicPath + '/home.php';
						let params = {
							op: 'home_private', 
							focusthread: 1, 
							page: that.pageCount
						}
						this.ajax4Order(url, params, function(res) {
							setTimeout(function() {
								that.drawPages(res);
								afterLoadonCallback(that.booLoadon);
							}, 50)
						});
						break;
					}
					case "FOLLOW_AUTHOR": {
						this.bIsFollowAuthor = true;
						let url = window.publicPath + '/home.php';
						let params = {
							op: 'home_private', 
							focususer: 1, 
							page: that.pageCount
						}
						this.ajax4Order(url, params, function(res) {
							setTimeout(function() {
								that.drawPages(res);
								afterLoadonCallback(that.booLoadon);
							}, 50)
						});
						break;
					}
				}
			},
			initRefrashOrLoadon: function() {
				let that = this;

				// init
				let target = document.querySelector('div.mine');
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
					++that.pageCount;
					if(that.bIsIssueTopic) {
						that.assortBtn("ISSUE_TOPIC", afterLoadonCallback);
					}
					else if(that.bIsIssueComment) {
						that.assortBtn("ISSUE_COMMENT", afterLoadonCallback);
					}
					else if(that.bIsFollowTopic) {
						that.assortBtn("FOLLOW_TOPIC", afterLoadonCallback);
					}
					else if(that.bIsFollowAuthor) {
						that.assortBtn("FOLLOW_AUTHOR", afterLoadonCallback);
					}
				});
			},
			drawPages: function(res) {
				let that = this;
				let result = res.body;

				// mine detail info
				if(result.myinfo) {
					that.myinfo = result.myinfo;

					that.myinfo.avatarimg += "?" + Math.round(Math.random()*8999 + 1000);
				}

				// count 是否上滑加载？
				if(result.count) {
					that.count = result.count;
				}

				// 发表的话题
				if(result.private) {
					if(result.private.length > 0) {
						result.private.forEach(function(item, index) {
							that.private.push(item);
						});
					}
					
					if(that.count > result.private.length) {
						that.booLoadon = false;
					}
				}

				if(!that.private || that.private.length <= 0) {
					that.bIsNoCont = true;
				}
			},
			ajax4Order: function(url, params, afterPostOkCallback) {
				this.$http.post(url, params, {emulateJSON: true}).then(function(res) {  // mythread,mypost,focusthread,focususer
					// console.log(res);
					afterPostOkCallback(res);
				}, function(error) {
					// console.log(error);
					window.location.href = window.publicPath + "/dist/error404/error404.html"; 
				});
			},
			refrashOrLoadonByScroll: function(obj, refrashCallback, loadonCallback) {
				RefrashOrLoadonByScroll(obj, refrashCallback, loadonCallback);
			},
			returnToTop: function(obj) {
				ReturnToTop(obj);
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
			clickToFollowSb: function(userinfo) {
				let that = this;
				this.$http.post(window.publicPath + '/home.php', {op: 'user_focus', fuid: userinfo.uid}, {emulateJSON: true}).then(function(res) {
					// console.log(res);
					let result = res.body;

					switch(Number(result.result)) {
						case 1: {
							// 关注
							userinfo.follower++;
							that.myinfo.fUsers++;
							userinfo.followed = 1;
							break;
						}
						case 2: {
							// 取关
							userinfo.follower--;
							that.myinfo.fUsers--;
							userinfo.followed = 2;
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
			linkToUpdateHeadpic: function() {
				// window.location.href = window.publicPath + "/dist/updateHeadpic/updateHeadpic.html";
				let reurl = "c_" + "updateHeadpic";
				window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
			},
			addClickActive: function(e) {
				e.currentTarget.parentNode.style.background = "rgba(0, 0, 0, 0.05)";
			},
		},
		watch: {
			'bIsIssueTopic': function(newVal, oldVal) {
				if(newVal) {
					this.bIsIssueComment = false;
					this.bIsFollowTopic = false;
					this.bIsFollowAuthor = false;
				}
			},
			'bIsIssueComment': function(newVal, oldVal) {
				if(newVal) {
					this.bIsIssueTopic = false;
					this.bIsFollowTopic = false;
					this.bIsFollowAuthor = false;
				}
			},
			'bIsFollowTopic': function(newVal, oldVal) {
				if(newVal) {
					this.bIsIssueComment = false;
					this.bIsIssueTopic = false;
					this.bIsFollowAuthor = false;
				}
			},
			'bIsFollowAuthor': function(newVal, oldVal) {
				if(newVal) {
					this.bIsIssueComment = false;
					this.bIsFollowTopic = false;
					this.bIsIssueTopic = false;
				}
			},
		},
		components: {
			'commentarea': commentarea,
		},
	});
</script>
<style type="text/css" media="screen">
	
</style>