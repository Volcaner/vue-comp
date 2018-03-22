<template>
	<div id="main">
		<p>{{ massage1 }}</p>
		<input type="text" name="" v-model='massage2'>
		<test_1 :massage='reversedMessage' @child='my_child'></test_1>
	</div>
</template>
<script>
	import test_1 from './test_1.vue';

	export default({
		data() {
			return {
				massage1: 3,
				massage2: ''
			}
		},
		components: {
			test_1
		},
		methods: {
			my_child: function(obj) {
				console.log(obj);
			}
		},
		computed: {
			reversedMessage: function() {
				return {
					massage2: this.massage2+100
				};
			}
		}
	});
</script>
<style>
	
</style>