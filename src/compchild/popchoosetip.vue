<template>
	<div class="chooseTip">
		<div class="choTipBox clearfix">
			<p>{{strTips}}</p>
			<span @click='tipCallback(false)'>取消</span>
			<span @click='tipCallback(true)'>确定</span>
		</div>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	import css from './../less/popchoosetip.less';
	export default ({
		data() {
			return {
				// strTips: '确定取消管理员吗？',
			}
		},
		props: ['strTips'],
		methods: {
			tipCallback: function(bool) {
				this.$emit('hide', false);
				this.$emit('callback', bool);
			},
		},
	});
</script>
<style lang="less" scoped></style>