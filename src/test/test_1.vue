<template>
	<div id="test_1">
		<p>{{ what }}</p>
		<p>{{ this.massage.massage2 }}</p>
		<button @click='clickEvent'>click</button>
	</div>
</template>
<script>
	export default({
		data() {
			return {
				what: 'what is that?',
				obj: {msg: 'shashasha'}
			}
		},
		props: ['massage'],
		methods: {
			clickEvent: function() {
				var that = this;
				this.$emit('child', that.obj)
			}
		}
	});
</script>
<style>
	
</style>