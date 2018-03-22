<template>
	<div class="mgPop">
		<!-- <div class="return_btn">
			<span class="icon iconfont">&#xe656;</span>
			<p>返回</p>
		</div> -->
		<!-- <div class="mgHide">
			<span class="icon iconfont" @click='click2HideMgSb'>&#xe608;</span>
		</div> -->
		<div class="mg_btns">
			<ul>
				<li class="clearfix">
					<p>设置<span class="icon iconfont" @click='click2HideMgSb'>&#xe7b1;</span></p>
				</li>
				<li class="clearfix">
					<div class="remark_area clearfix">
						<label>备注</label>
						<input v-model='strRemark' type="text" name="remark" placeholder="请输入备注" maxlength="10">
						<button type="" value="ok" @click='post4SetRemark'>确定</button>
					</div>
				</li>
				<li class="clearfix">
					<p>禁言</p>
					<div class="ban_btn">
						<span class="ifban" @click='setBan(!bIsBan); post4SetBan();'></span>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	import css from './../less/mgsbdata.less';
	export default ({
		data() {
			return {
				bIsBan: false,
				strRemark: '',
			}
		},
		props: ['banned', 'chaUid'],
		mounted() {
			let that = this;
			if(this.banned == 1) {
				this.bIsBan = true;
			}
			else{
				this.bIsBan = false;
			}
			this.setBan(this.bIsBan);
		},
		methods: {
			setBan: function(bool) {
				let that = this;
				let banEl = document.querySelector(".ifban");
				this.bIsBan = bool;
				if(this.bIsBan) {
					banEl.className = "ifban ban_active";
				}
				else {
					banEl.className = "ifban";
				}
			},
			post4SetBan: function() {
				let that = this;
				this.$http.post(window.publicPath3 + '/home.php', {op: 'change_ban', cha_uid: this.chaUid, type: this.bIsBan?1:-1,}, {emulateJSON: true}).then(function(res) {
					// console.log(res);
					let result = res.body;
					if(Number(result) > 0){
						// 修改成功
						alert("修改成功");
					}
					else if(Number(result) == -4) {
						// 没有操作权限
						alert("没有操作权限");
						that.bIsBan = !that.bIsBan;
						that.setBan(that.bIsBan);
					}
					else if(Number(result) == 0) {
						// 修改失败
						alert("修改失败");
						that.bIsBan = !that.bIsBan;
						that.setBan(that.bIsBan);
					}
					else if(Number(result) == -2) {
						// 操作有误
						alert("操作有误");
						that.bIsBan = !that.bIsBan;
						that.setBan(that.bIsBan);
					}
				}, function(error) {
					// console.log(error);
					window.location.href = window.publicPath + "/dist/error404/error404.html"; 
				});
			},
			click2HideMgSb: function() {
				this.$emit('close', "");
			},
			post4SetRemark: function() {
				let that = this;
				let bIsNull = /^\s*$/g;
				if(!bIsNull.test(this.strRemark)) {
					this.$http.post(window.publicPath + '/home.php', {op: 'set_name', newname: this.strRemark, p_uid: this.chaUid}, {emulateJSON: true}).then(function(res) {
						// console.log(res);
						let result = res.body;

						if(Number(result.result) > 0) {
							// 修改成功
							// that.click2HideMgSb();
							alert("修改成功");
							that.$emit('uapdateRemark', that.strRemark);
						}
						else if(Number(result.result) == 0) {
							// 修改失败
							alert("修改失败");						}
						else if(Number(result.result) == -1) {
							// newname超过20字符
							alert("备注超过20字符");	
						}
						else if(Number(result.result) == -3) {
							// 昵称重复
							alert("昵称重复");	
						}
						else if(Number(result.result) == -4) {
							// 没有权限（群主权限）
							alert("没有权限");
						}
					}, function(error) {
						// console.log(error);
						window.location.href = window.publicPath + "/dist/error404/error404.html"; 
					});
				}
				else{
					alert("不能为空！");
				}
			},
		},
	});
</script>
<style lang="less" scoped></style>