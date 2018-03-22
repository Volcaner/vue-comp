<template>
	<div class="proBar">
		<div class="progress_box">
			<div class="bar_box">
				
			</div>
		</div>
	</div>
</template>
<script type="text/javascript" charset="utf-8" async defer>
	import css from './../less/progressBar.less';
	export default ({
		data() {
			return {
				
			}
		},
		props: ['barnum'],
		methods: {
			tipCallback: function(bool) {
				this.$emit('hide', false);
				this.$emit('callback', bool);
			},
		},
		watch: {
			'barnum': function(newVal, oldVal) {
				// console.log(newVal);

				let progress_box = document.querySelector(".progress_box");
				let bar_box = document.querySelector(".bar_box");
				let fontsize = parseFloat(document.querySelector("html").style.fontSize);
				let total = parseFloat(progress_box.getBoundingClientRect().width);
				let barW = total*newVal/fontsize;
				bar_box.style.width = barW + "rem";
			},
		},
	});
</script>
<style lang="less" scoped></style>