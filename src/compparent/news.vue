<template>
	<div class="main">
		<div id="news" class="news">
			<div v-show='bIsPullDown' class="refrash">
				<p>下拉刷新</p>
			</div>

			<div class="public">
				<div class="allRead" > <!-- v-show='parseInt(news)>0' -->
					<span @click='clickToReadAll()' v-bind:class="[{readallok: parseInt(news)<=0}]"><b class="icon iconfont">&#xe60a;</b>全部已读</span>
					<!-- <b class="icon iconfont" @click='showEdit()'>&#xe656;</b> -->

					<div class="show_btn">
						<span @click='showEdit()' class="icon iconfont">&#xe656;</span>
					</div>
				</div>
				<ul v-if='mynews&&mynews.length > 0'>
					<template>
						<li class="clearfix" v-for='item in mynews'>
							<div class="user_info clearfix">
								<div class="user_pic" @click='linkToSbDetailInfo(item.authorid)'>
									<img :src='item.avatarimg' alt="user">
									<b v-if='parseInt(item.new)==1'></b>
								</div>
								<div class="user_name">
									<p class="username"><span>{{item.author}}</span></p>
									<p class="datetime">{{item.subtime}}</p>
								</div>
							</div>

							<!-- <div class="user_article" @click='linkToTopicDetail(item.from_id)'> -->
							<div class="user_article" @click='clickToViewNews(item)'>
								<p class="ait" v-html='item.message'></p>
								<p class="whichtopic">
									<span>来自话题</span><b>{{item.subject}}</b>
								</p>
							</div>
						</li>
					</template>
				</ul>

				<div v-if='!mynews||mynews.length <= 0' class="noNews">
					<span>
						<img src="./../images/nonews.png" alt="">
					</span>
					<p>还没有收到消息哦～</p>
				</div>
			</div>

			<div v-show='bIsSlideUp' class="loadon">
				<p>上滑加载</p>
			</div>
		</div>
	</div>
</template>
<script>
	import {RefrashOrLoadonByScroll} from './../compjs/refrashorloadonbyscroll.js';
	import {ReturnToTop} from './../compjs/returntotop.js';
	export default({
		data() {
			return {
				uid: '',
				mynews: [
					// {
					// 	author: 'fdafd',  // 回复人的用户名
					// 	authorid: 'fdsfsa',  // 回复人的用户ID
					// 	avatarimg: require('./../images/robbin.jpg'),  // 回复人的头像
					// 	from_id: 'fdsda', // 被回复贴所在的主贴ID
					// 	subject: '这个帖很吊！',  // 被回复贴所在的主贴标题
					// 	message: '你这人。。。',  // 回复的消息内容 
					// 	new: '1',  // 该消息是否查看（1未查看，0已查看）
					// 	id: 'dsa',  // 消息ID
					// 	subtime: '2017-04-27 21:46:47',  // 回复的时间 格式：2017-04-27 21:46:47
					// },
				],
				news: '',
				count: 0,
				pageCount: 0,
				comp_name: '',
				booRefrash: false,
				booLoadon: true,
				bIsShowEdit: false,
				bIsShow: false,
				bIsNoNews: false,
			}
		},
		mounted() {
			let that = this;
		
			this.$store.state.comp_name = JSON.parse(localStorage.comp_name);
			this.comp_name = this.$store.state.comp_name;
			// document.title = this.comp_name;

			this.$store.state.uid = JSON.parse(localStorage.uid);
			this.uid = this.$store.state.uid;

			this.pageCount = 0;
			let url = window.publicPath + '/home.php';
			let params = {
				op: 'my_news', 
				page: this.pageCount
			};
			this.ajax(url, params, function(res) {
				let result = res.body;

				if(result.count) {
					that.count = result.count;
				}

				if(result.news) {
					that.news = result.news;
				}

				if(result.mynews) {
					if(result.mynews.length > 0) {
						result.mynews.forEach(function(item, index) {
							item.avatarimg += "?" + Math.round(Math.random()*8999 + 1000);
							that.mynews.push(item);
						});
					}
					
					if(that.count > result.mynews.length) {
						that.booLoadon = false;
					}
				}
			});

			// 下拉刷新+上滑加载
			document.body.onload = function() {
				// init
				let target = document.querySelector('div.news');
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
					let params = {
						op: 'my_news', 
						page: ++that.pageCount
					};
					that.ajax(url, params, function(res) {
						setTimeout(function() {
							let result = res.body;
							if(result.mynews) {
								if(result.mynews.length > 0) {
									result.mynews.forEach(function(item, index) {
										that.mynews.push(item);
									});
								}
								
								if(that.count > result.mynews.length) {
									that.booLoadon = false;
								}
							}

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

			// 下拉触发 编辑
			this.initShowEdit();
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
					window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl +"&p_uid=" + authorid;
				}
			},
			clickToViewNews: function(item) {
				let that = this;
				let numNew = parseInt(item.new);

				if(1 == numNew) {
					this.$http.post(window.publicPath + '/home.php', {op: 'news_view', id: item.id}, {emulateJSON: true}).then(function(res) {
						// console.log(res);
						let result = res.body;

						switch(parseInt(result)) {
							case 1: {
								// 1查看成功
								that.linkToTopicDetail(item.from_id);
								break;
							}
							case 0: {
								// 不为1则查看失败
								break;
							}
						}
					}, function(error) {
						// console.log(error);
						window.location.href = window.publicPath + "/dist/error404/error404.html"; 
					});
				}
				else if(0 == numNew) {
					that.linkToTopicDetail(item.from_id);
				}
			},
			clickToReadAll: function() {
				if(parseInt(this.news) > 0) {
					let url = window.publicPath + '/home.php';
					let params = {
						op: 'allnews_view'
					};
					this.ajax(url, params, function(res) {
						location.reload();
					});
				}
			},
			showEdit: function(bool) {
				let that = this;
				let allReadEl = document.querySelector('div.allRead');
				let targetEl = document.querySelector('div.news');
				let showBtnEl = document.querySelector('div.show_btn').children[0];
				let elHeight = allReadEl.offsetHeight;
				let speed = 5;
				let elTop = 0;
				if(bool) {
					this.bIsShow = true;
				}
				else {
					this.bIsShow = !this.bIsShow;
				}

				if(this.bIsShow && !this.bIsShowEdit) {
					showBtnEl.className = "spanRotate icon iconfont";
					that.bIsShowEdit = true;
					elTop = -elHeight;
					let showTimer = setInterval(function() {
						elTop += speed;
						allReadEl.style.cssText = "top: " + elTop + "px;";
						targetEl.style.cssText = "top: " + (elTop+elHeight) + "px;";
						if(elTop >= 0) {
							elTop = 0;
							allReadEl.style.cssText = "top: " + elTop + "px;";
							targetEl.style.cssText = "top: " + (elTop+elHeight) + "px;";
							clearInterval(showTimer);
						}
					}, 10);
				}
				else if(!this.bIsShow && this.bIsShowEdit) {
					showBtnEl.className = "icon iconfont";
					that.bIsShowEdit = false;
					elTop = 0;
					let hideTimer = setInterval(function() {
						elTop -= speed;
						allReadEl.style.cssText = "top: " + (elTop) + "px;";
						targetEl.style.cssText = "top: " + (elTop+elHeight) + "px;";
						if(elTop <= -elHeight) {
							elTop = -elHeight;
							allReadEl.style.cssText = "top: " + elTop + "px;";
							targetEl.style.cssText = "top: " + (elTop+elHeight) + "px;";
							clearInterval(hideTimer);
						}
					}, 10);
				}
			},
			initShowEdit: function() {
				let that = this;
				let lastEmoveY = null;
				let distance = 0;
				if(!this.bIsShowEdit) {
					document.body.addEventListener("touchstart", function(eStart) {
						// alert(eStart.targetTouches[0].clientY);
						document.body.addEventListener("touchmove", touchmoveEvent, false);
					}, false);
				}

				function touchmoveEvent(eMove) {
					eMove.preventDefault();
					let nowEmoveY = eMove.targetTouches[0].clientY;
					if(lastEmoveY == null) {
						lastEmoveY = nowEmoveY;
					}
					distance = nowEmoveY - lastEmoveY;
					lastEmoveY = nowEmoveY;

					if(document.body.scrollTop <= 0 && distance >= 0) {
						if(eMove.targetTouches[0].screenY >= 0 && eMove.targetTouches[0].screenY <= 150) {
							that.showEdit(true);
							document.body.removeEventListener("touchmove", touchmoveEvent, false);
						}
						else {
							document.body.removeEventListener("touchmove", touchmoveEvent, false);
						}
					}
					else {
						if(eMove.targetTouches[0].screenY >= 0 && eMove.targetTouches[0].screenY <= 150) {
							that.showEdit(true);
							document.body.removeEventListener("touchmove", touchmoveEvent, false);
						}
						else {
							document.body.removeEventListener("touchmove", touchmoveEvent, false);
						}
					}
				};
			},
		},
	});
</script>
<style type="text/css" media="screen">
	
</style>