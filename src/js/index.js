import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
// import router from './../router';

// import test from './test/test.vue';
import index from './../compparent/index.vue';
import css from './../less/index.less';
import main from './../less/main.less';
import mainjs from './../compjs/main.js';

Vue.use(VueResource);
Vue.use(VueRouter);

var vm = new Vue({
	el: '#app',
	data: {},
	// render: z=>z(test)
	render: z=>z(index)
});