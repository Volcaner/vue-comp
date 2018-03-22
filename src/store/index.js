import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

let state = {
	'aaa': 0,
	ismanager: null
}

export default new Vuex.Store({
	state
});