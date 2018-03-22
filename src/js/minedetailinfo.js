import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import store from './../store/index';
// import router from './../router';

// import test from './test/test.vue';
import index from './../compparent/minedetailinfo.vue';
import css from './../less/minedetailinfo.less';
import main from './../less/main.less';
import mainjs from './../compjs/main.js';

Vue.use(VueResource);
Vue.use(VueRouter);

var vm = new Vue({
	el: '#app',
	store,
	data: {},
	// render: z=>z(test)
	render: z=>z(index)
});