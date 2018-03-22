exports.install = function(Vue, options) {
	Vue.prototype.LocalStorage = {
		getItem: function(key) {
			let storage = window.localStorage;
			if(storage) {
				return JSON.parse(storage.getItem(key));
			}
			else {
				console.log("浏览器不支持 localStorage");
				return null;
			}
		},
		setItem: function(key, value) {
			let storage = window.localStorage;
			if(storage) {
				storage.setItem(key, JSON.stringify(value));
			}
			else {
				console.log("浏览器不支持 localStorage");
			}
		},
		removeItem: function(key) {
			let storage = window.localStorage;
			if(storage) {
				storage.removeItem(key);
			}
			else {
				console.log("浏览器不支持 localStorage");
			}
		},
		clear: function() {
			let storage = window.localStorage;
			if(storage) {
				storage.clear();
			}
			else {
				console.log("浏览器不支持 localStorage");
			}
		},
		length: function() {
			let storage = window.localStorage;
			if(storage) {
				return storage.length;
			}
			else {
				console.log("浏览器不支持 localStorage");
				return null;
			}
		},
		getKey: function(i) {
			let storage = window.localStorage;
			if(storage) {
				return storage.key(i);
			}
			else {
				console.log("浏览器不支持 localStorage");
				return null;
			}
		},
	};

	Vue.prototype.Loading = {
		show: function(key) {
			let boxEl = document.createElement('div');
			let imgEl = document.createElement('img');
			boxEl.appendChild(imgEl);
			boxEl.id = 'loading_' + key;
			boxEl.className = 'loading';
			imgEl.src = require('./../images/loading_0.gif');
			document.body.appendChild(boxEl);
		},
		hide: function(key) {
			// console.log("loading hide");
			let boxEl = document.getElementById('loading_' + key);
			if(boxEl) {
				document.body.removeChild(boxEl);
			}
		},
	};

	Vue.prototype.DomLoading = {
		show: function(key) {
			let boxEl = document.createElement('div');
			let imgEl = document.createElement('img');
			boxEl.appendChild(imgEl);
			boxEl.id = 'domLoading_' + key;
			boxEl.className = 'domLoading';
			imgEl.src = require('./../images/loading_0.gif');
			document.body.appendChild(boxEl);
		},
		hide: function(key) {
			let boxEl = document.getElementById('domLoading_' + key);
			if(boxEl) {
				document.body.removeChild(boxEl);
			}
		},
	};

	Vue.prototype.getConnection = {
		status: function() {
			var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
			return connection;
		},
	};
};