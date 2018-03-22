<template>
	<div class="main">
		<div class="login clearfix">
			<div class="header">
				<div class="logo">
					<img src="./../images/logo.png" height="189" width="190" alt="logo">
				</div>
			</div>

			<div class="validate">
				<div class="tel">
					<label v-show='!bIsByUser'>
						<span class="icon iconfont">&#xe648;</span>
						<input @focus='afterInputFocus("telinput")' @blur='afterInputBlur("telinput")' type="text" name="telinput" v-model='telVal' :value="telVal.trim()" placeholder="手机号" size="20">
					</label>
					<!-- <label v-show='bIsByUser'>
						<span class="icon iconfont">&#xe60b;</span>
						<input @focus='afterInputFocus("userinput")' @blur='afterInputBlur("userinput")' type="text" name="userinput" v-model='userVal' :value="userVal.trim()" placeholder="用户名" size="20">
					</label> -->
					<p class="tipsone" v-show='bIsTipsone'>{{tipsone}}</p>
				</div>
				<div class="idcode">
					<label v-show='!bIsByUser'>
						<span class="icon iconfont">&#xe603;</span>
						<input @focus='afterInputFocus("idcode")' @blur='afterInputBlur("idcode")' type="text" name="idcode" v-model='idcodeVal' :value="idcodeVal.trim()" placeholder="验证码" size="10">
					</label>
					<!-- <label v-show='!bIsByUser'>
						<span class="icon iconfont">&#xe669;</span>
						<input @blur='afterInputBlur("password")' type="password" name="password" v-model='passwordVal' :value="passwordVal.trim()" placeholder="登录密码" size="10">
					</label> -->
					<span v-show='!bIsByUser&&!bIsCountdown' class="getidcode" @click='post4IdCode()'>获取验证码</span>
					<span v-show='!bIsByUser&&bIsCountdown' class="countdown">倒计时<b>60</b>秒</span>
					<p class="tipstwo" v-show='bIsTipstwo'>{{tipstwo}}</p>
					<!-- <p class="tipstwo" v-show='bIsCodeError'>验证码错误！</p>
					<p v-show='bIsLoginTips'>6-14个字符，包括字母、数字、符号至少两种，不允许有空格</p> -->
				</div>
				<div class="pw" v-show='bIsFirstLogin'>
					<label v-show='!bIsByUser'>
						<span class="icon iconfont">&#xe669;</span>
						<input @blur='afterInputBlur("password")' type="password" name="password" v-model='passwordVal' :value="passwordVal.trim()" placeholder="登录密码" size="10">
					</label>
					<p class="tipsthree" v-show='bIsTipsthree'>{{tipsthree}}</p>
				</div>
			</div>

			<div v-show='!bIsByUser' class="nextstap" @click='post4Regist()'>下一步</div>
			<div v-show='bIsByUser' class="nextstap" @click='post4Login()'>下一步</div>
		</div>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	import md5 from 'md5';
	export default({
		data() {
			return {
				bIsByUser: false,
				bIsCountdown: false,
				bIsCodeError: false,
				bIsLoginTips: false,
				telVal: '',
				userVal: '',
				idcodeVal: '',
				passwordVal: '',
				countDownTimer: null,
				bIsRegistNext: true,
				bIsLoginNext: true,
				bIsTipsone: false,
				tipsone: '用户名已存在！',
				bIsTipstwo: false,
				tipstwo: '验证码错误！',
				bIsTipsthree: false,
				tipsthree: '登录密码/手机号码错误！',
				bIsFirstLogin: false,
			}
		},
		mounted() {
			console.log("login------------------------------------------------------------------------");
			// document.title = "登录/注册";

			// document.body.onload = function() {
			// 	document.querySelector('body').addEventListener("click", function(e) {console.log(e);}, false);
			// };
		},
		methods: {
			afterInputFocus: function(strName) {
				// input focus聚焦 
				let that = this;

				switch(strName) {
					case "telinput": {
						this.bIsTipsone = false;
						break;
					}
					case "userinput": {
						this.bIsTipsone = false;
						break;
					}
					case "idcode": {
						this.bIsTipstwo = false;
						break;
					}
					case "password": {
						this.bIsTipsthree = false;
						break;
					}
				}
			},
			afterInputBlur: function(strName) {
				// input blur失焦
				let that = this;
				let strVal = document.querySelector('input[name='+ strName + ']').value;
				let userPattern = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
				let telPattern = /^1(3|4|5|7|8)\d{9}$/;

				switch(strName) {
					case "telinput": {
						if(!telPattern.test(strVal)){
							this.bIsTipsone = true;
							this.tipsone = "请输入正确的手机号码";
						}
						else{
							this.$http.post(window.publicPath1 + '/wechat_member.php', {action: 'check_tel', tel: strVal}, {emulateJSON:true}).then(function(res) {
								// console.log(res);
								let result = res.body;
								that.bIsTipsone = true;
								switch(Number(result.result)) {
									case 1: {
										// 不存在
										that.bIsTipsone = false;
										that.bIsFirstLogin = true;
										break;
									}
									case -6: {
										// 已存在
										that.bIsTipsone = false;
										that.bIsFirstLogin = false;
										break;
									}
									case -4: {
										// 格式错误
										that.bIsFirstLogin = false;
										that.tipsone = "格式错误";
										break;
									}
								}
							}, function(error) {
								// console.log(error);
								window.location.href = window.publicPath + "/dist/error404/error404.html"; 
							});
						}
						break;
					}
					case "userinput": {
						this.$http.post(window.publicPath1 + '/wechat_member.php', {action: 'check_username', username: this.userVal}, {emulateJSON:true}).then(function(res) {
							// console.log(res);
							let result = res.body;
							that.bIsTipsone = true;
							switch(Number(result.result)) {
								case 1: {
									// 可用
									that.bIsTipsone = false;
									break;
								}
								case -1: {
									// 格式错误
									that.tipsone = "格式错误";
									break;
								}
								case -2: {
									// 包含系统屏蔽字符(用户名可包含中英文，数字，—，-)
									that.tipsone = "包含系统屏蔽字符(用户名可包含中英文，数字，-，_)";
									break;
								}
								case -3: {
									// 已存在
									// that.tipsone = "用户名已存在！";
									that.bIsTipsone = false;
									break;
								}
							}
						}, function(error) {
							// console.log(error);
							window.location.href = window.publicPath + "/dist/error404/error404.html"; 
						});
						break;
					}
					case "idcode": {
						break;
					}
					case "password": {
						break;
					}
				}

				// console.log("input value: " + this.telVal);
			},
			post4Regist: function() {
				let that = this;
				let telPattern = /^1(3|4|5|7|8)\d{9}$/;
				let bIsNull = /^\s*$/g;

				let bIsCanPost = false;
				let params = {};
				if(this.bIsFirstLogin) {
					bIsCanPost = telPattern.test(this.telVal) && !bIsNull.test(this.idcodeVal) && !bIsNull.test(this.passwordVal);
					params = {
						action: 'shot_login', 
						tel: this.telVal, 
						seccode: this.idcodeVal, 
						password: md5(this.passwordVal)
					};
				}
				else {
					bIsCanPost = telPattern.test(this.telVal) && !bIsNull.test(this.idcodeVal);
					params = {
						action: 'shot_login', 
						tel: this.telVal, 
						seccode: this.idcodeVal,
					};
				}

				if(bIsCanPost) {
					if(this.bIsLoginNext) {
						this.bIsLoginNext = false;

						this.Loading.show(1);
						this.$http.post(window.publicPath1 + '/wechat_member.php', params, {emulateJSON:true}).then(function(res) {
							// console.log(res);
							
							that.Loading.hide(1);
							
							that.bIsLoginNext = true;

							// alert(res.bodyText);

							if(res) {
								let result;
								let resReg = /\{\"result\"([^\}])+\}/g;
								let bodyText = res.bodyText;
								if(!res.body && bodyText.match(resReg).length > 0) {  // Object.prototype.toString.call(res.body) === "[object String]"
									result = JSON.parse(bodyText.match(resReg));
								}
								else {
									result = res.body;
								}

								// that.bIsTipstwo = true;
								if(result && result.result) {
									switch(result.result) {
										case "add_success": {
											// 成功并跳转到2界面
											that.bIsTipstwo = false;
											that.bIsByUser = true;
											break;
										}
										case "update_success": {
											// 成功并跳转到主界面
											that.bIsTipstwo = false;
											// window.location.href = window.publicPath + "/dist/communityhome/communityhome.html"; 
											let reurl = "c_" + "communityhome";
											window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
											break;
										}
										case "noCode": {
											// 未发送验证码
											that.bIsTipstwo = true;
											that.tipstwo = '未发送验证码';
											break;
										}
										case "mysql_Error": {
											// 信息添加错误
											that.bIsTipsthree = true;
											that.tipsthree = '信息添加错误';
											break;
										}
										case "codeOutTime": {
											// 验证码超时
											that.bIsTipstwo = true;
											that.tipstwo = '验证码超时';
											break;
										}
										case "codeError": {
											// 验证码错误
											that.bIsTipstwo = true;
											that.tipstwo = '验证码错误';
											break;
										}
										case "telcheng": {
											// 手机号更改，请重新发送
											that.bIsTipsthree = true;
											that.tipsthree = '手机号更改，请重新发送';
											break;
										}
										default: {
											// 验证码错误
											that.bIsTipstwo = true;
											that.tipstwo = "登录/注册失败";
											break;

										}
									}
								}
							}
						}, function(error) {
							// console.log(error);
							
							that.Loading.hide(1);

							that.bIsLoginNext = true;
							window.location.href = window.publicPath + "/dist/error404/error404.html"; 
						});
					}
					
				}else {
					// console.log("do nothing");
					return;
				}
			},
			post4IdCode: function() {
				let telPattern = /^1(3|4|5|7|8)\d{9}$/;
				let that = this;

				// bis telphone number available?
				if(telPattern.test(this.telVal)) {
					let count = 60;
					this.bIsCountdown = true;
					clearInterval(this.countDownTimer);

					// count down
					this.countDownTimer = setInterval(function() {
						let countDownEl = document.querySelector('span.countdown').childNodes.item(1);
						countDownEl.innerHTML = count;
						count--;
						if(count < 0) {
							clearInterval(that.countDownTimer);
							that.bIsCountdown = false;

							count = 60;
							countDownEl.innerHTML = count;
						}
					}, 1000);

					// post , {emulateJSON:true}
					this.$http.post(window.publicPath1 + '/get_verify.php', {tel: this.telVal}, {emulateJSON:true}).then(function(res) {
						// console.log(res);
						let result = res.body;
						that.bIsTipsone = true;
						if(0 < result.res) {
							// 发送成功
							that.bIsTipsone = false;
						}else if(-4 == result.res || -41 == result.res) {
							// 手机格式错误
							that.tipsone = "手机格式错误";
						}else if(-1 == result.res || -11 == result.res) {
							// 手机号有误或被禁用，请输入其他手机号
							that.tipsone = "手机号有误或被禁用，请输入其他手机号";
						}else {
							// 接口错误，短信发送失败
							that.tipsone = "短信发送失败";
						}

					}, function(error) {
						// console.log(error);
						that.bIsTipsone = true;

						// 请求失败
						that.tipsone = "短信发送失败";
					});
				}else {
					this.bIsTipsone = true;
					this.tipsone = "请输入正确的手机号码";
				}
			},
			post4Login: function() {
				let that = this;
				let bIsNull = /^\s*$/g;
				if(!bIsNull.test(this.userVal) && !bIsNull.test(this.passwordVal)) {
					if(this.bIsRegistNext){
						this.bIsRegistNext = false;
						this.$http.post(window.publicPath1 + '/wechat_member.php', {action: 'wechat_reg', username: this.userVal, password: this.passwordVal}, {emulateJSON:true}).then(function(res) {
							// console.log(res);
							that.bIsRegistNext = true;
							let result = res.body;
							switch(Number(result.result)) {
								case 1: {
									// 成功并跳转主界面
									// window.location.href = window.publicPath + "/dist/communityhome/communityhome.html"; 
									let reurl = "c_" + "communityhome";
									window.location.href = window.publicPath5 + '/wechat.php?page=redirect&url=' + reurl;
									break;
								}
								case 0: {
									// 信息添加错误
									alert("信息添加错误");
									break;
								}
								case -1: {
									// 用户名格式错误
									alert("用户名格式错误");
									break;
								}
								case -2: {
									// 用户名包含系统屏蔽字符
									alert("用户名包含系统屏蔽字符");
									break;
								}
								case -3: {
									// 用户名已存在
									alert("用户名已存在");
									break;
								}
								case -5: {
									// 密码长度小于6
									alert("密码长度小于6");
									break;
								}
							}
						}, function(error) {
							// console.log(error);
							that.bIsRegistNext = true;
							window.location.href = window.publicPath + "/dist/error404/error404.html"; 
						});
					}
				}else {
					// console.log("do nothing");
					return;
				}
			},
		},
		watch: {
			'telVal': function(newVal, oldVal) {
				this.telVal = newVal.replace(/\s+/g,'');
			},
			'idcodeVal': function(newVal, oldVal) {
				this.idcodeVal = newVal.replace(/\s+/g,'');
			},
		}
	});
</script>
<style lang="less" scoped>
</style>