<template>
	<div class="main">
		<div id="team" class="team">
			<div class="compinfo clearfix">
				<div class="compIcon">
					<img :src='compIcon' alt="">
				</div>

				<div class="compName">
					<h1>{{compName}}</h1>
					<p class="clearfix">
						<span>话题<b>{{compThreads}}</b></span>
						<span>关注<b>{{compUsers}}</b></span>
					</p>
				</div>
			</div>
			<div class="briefintro">
				<span>简介内容</span>
				<p>{{description}}</p>
			</div>
			<div class="mgteam">
				<span>管理团队</span>
				<ul class="clearfix">
					<template v-for='item in manager'>
						<li>
							<span @click='linkToSbDetailInfo(item.uid)'>
								<img :src='item.avatarimg' alt="">
								<b v-if='Number(item.level) == 1' class="icon iconfont">&#xe748;</b>
							</span>
							<b>{{item.username}}</b>
							<input type="button" name="altsb" value="@TA发表话题" @click='enterTopic(item)'>
						</li>
					</template>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	export default({
		data() {
			return {
				description: '',
				manager: [
					{
						username: '',
						uid: '',
						level: '',
					},
				],
				uid: '',
				comp_name: '',

				// comp info
				compName: '--',
				compThreads: '0',
				compUsers: '0',
				compIcon: require('../images/robbin.jpg'),
			}
		},
		mounted() {
			let that = this;
			
			this.$store.state.comp_name = JSON.parse(localStorage.comp_name);
			this.comp_name = this.$store.state.comp_name;
			// document.title = this.comp_name;

			this.uid = JSON.parse(localStorage.uid);

			this.$http.post(window.publicPath + '/home.php', {op: 'group_managers'}, {emulateJSON: true}).then(function(res) {
				// console.log(res);
				let result = res.body;
				that.manager = [];

				if(result && result.groupusers) {
					that.description = result.groupusers.description;
					if(result.groupusers.manager && result.groupusers.manager.length > 0) {
						that.manager = result.groupusers.manager;

						that.manager.forEach(function(man, mindex) {
							man.avatarimg += "?" + Math.round(Math.random()*8999 + 1000);
						});
					}

					if(result.groupusers.info) {
						that.compName = result.groupusers.info.name?result.groupusers.info.name:'--';
						that.compThreads = result.groupusers.info.threads?result.groupusers.info.threads:'0';
						that.compUsers = result.groupusers.info.users?result.groupusers.info.users:'0';
						that.compIcon = result.groupusers.info.icon?result.groupusers.info.icon:'../images/robbin.jpg';
					}
				}
			}, function(error) {
				// console.log(error);
				window.location.href = window.publicPath + "/dist/error404/error404.html"; 
			});
		},
		methods: {
			enterTopic: function(item) {
				let userName = escape(item.username);
				// window.location.href = window.publicPath + "/dist/issuetopic/issuetopic.html?alt_uid=" + item.uid + "&alt_username=" + userName; 
				let reurl = "c_" + "issuetopic";
				window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl + "&alt_uid=" + item.uid + "&alt_username=" + userName;
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
		},
		watch: {

		},
	});
</script>
<style type="text/css" media="screen">
	
</style>