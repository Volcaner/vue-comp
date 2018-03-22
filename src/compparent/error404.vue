<template>
	<div class="main">
		<div class="error">
			<div class="errorPic">
				<img src="./../images/error.png" height="393" width="196" alt="">
			</div>
			<div class="errorTips">
				<p>Error 404<br />哎呀，页面找不到了</p>
				<p><span @click='refrashToLastPage()'>刷新</span></p>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	export default({
		data() {
			return {

			}
		},
		mounted() {

		},
		methods: {
			refrashToLastPage: function() {
				window.history.back();
				location.reload();
			},
		},
	});
</script>
<style lang="less" scoped>
	@backColor: #009688;
	@iconColor: #ff3f80;
	.main{
		position: relative;
		width: 100%;
		height: 100%;
		margin: 0 auto;
	}
	.error{
		position: relative;
		width: 100%;
		// height: 100px;
		background: #fff;

		>div.errorPic{
			padding-top: 130px;

			>img{
				margin: 0 auto;
				display: block;
			}
		}

		>div.errorTips{

			>p{
				text-align: center;
				margin-top: 36px;
				font-size: 26px;
				color: #777;

				>span{
					font-size: 26px;
					color: #fff;
					padding: 17px 34px;
					background: @backColor;
					border-radius: 5px 5px;
				}
			}
		}
	}
</style>