/**
 * kaican
 * 刷新的div、加载的div、主div
 * 引入插件-->import {RefrashOrLoadonByScroll} from './../compjs/refrashorloadonbyscroll.js';
 * refrashOrLoadonByScroll: function(obj, refrashCallback, loadonCallback) {
 * 	RefrashOrLoadonByScroll(obj, refrashCallback, loadonCallback);
 * }
 * init-->document.body.onload
 * 样式-->见 main.less 'refrash or loadon'
 */
function RefrashOrLoadonByScroll(obj, refrashCallback, loadonCallback) {
	let target = obj.target;
	let refrashEl = obj.refrashEl;
	let loadonEl = obj.loadonEl;
	let footerEl = obj.footerEl;
	let booRefrash = obj.booRefrash;
	let booLoadon = obj.booLoadon;
	loadonEl.style.cssText = "display: none;";
	let taElHeight = target.offsetHeight;
	let reElHeight = refrashEl.offsetHeight;
	let windowHeight = document.body.offsetHeight;
	let bIsScrollEvent = false;
	let lastEmoveY = null;
	let distance = 0;
	let realMoveTop = -reElHeight;
	let bIsAtRefrash = false;  // 是否正在刷新（如果正在刷新，则不能触发其他事件）
	// let bIsAtLoadon = false;  // 是否正在加载（如果正在加载，则不能触发其他事件）

	document.querySelector(".main").addEventListener("touchstart", touchstartEvent, false);
	document.querySelector(".main").addEventListener("scroll", toScroll, false);
	setTimeout(function() {
		window.scroll(0, 1);
	}, 100);
	// window.addEventListener("touchmove", function(e) {e.preventDefault();}, false);

	function touchstartEvent(eStart) {
		// eStart.preventDefault();
		// eStart.returnValue = false;
		if(!bIsAtRefrash) {
			// console.log("touch------start");
			
			bIsScrollEvent = true;
			taElHeight = target.offsetHeight;

			lastEmoveY = null;
			distance = 0;
			realMoveTop = -reElHeight;
			document.querySelector(".main").addEventListener("touchmove", touchMoveEvent, false);
			
			document.querySelector(".main").addEventListener("touchend", touchEndEvent, false);
		}
	};

	function touchMoveEvent(eMove) {
		// eMove.preventDefault();
		if(!bIsAtRefrash) {
			// console.log("touch------move");
			let nowEmoveY = eMove.targetTouches[0].clientY;
			if(lastEmoveY == null) {
				lastEmoveY = nowEmoveY;
			}
			distance = nowEmoveY - lastEmoveY;
			lastEmoveY = nowEmoveY;

			if(window.isAndroid) {
				// 下拉触发事件
				if(distance >= 0) {
					// 控制下拉速度
					if(distance > 12) {
						distance = 12;
					}

					// 当scrollTop为 0 时，可能触发刷新事件
					if(document.querySelector(".main").scrollTop <= 0 && booRefrash) {
						// 下拉运动
						realMoveTop += distance;
						refrashEl.children[0].innerHTML = "下拉刷新";
						refrashEl.style.cssText = "top: " + realMoveTop + "px";
						eMove.preventDefault();

						// 下拉极限
						if(realMoveTop >= 0) {
							realMoveTop = 0;
							refrashEl.style.cssText = "top: " + realMoveTop + "px";
						}
					}
				}
			}

			if(window.isiOS) {
				// 下拉触发事件
				if(distance > 0) {
					// 控制下拉速度
					if(distance > 12) {
						distance = 12;
					}

					// 当scrollTop为 0 时，可能触发刷新事件
					if(document.querySelector(".main").scrollTop <= 0 && booRefrash) {
						// 下拉运动
						realMoveTop += distance;
						refrashEl.children[0].innerHTML = "下拉刷新";
						refrashEl.style.cssText = "top: " + realMoveTop + "px";
						eMove.preventDefault();

						// 下拉极限
						if(realMoveTop >= 0) {
							realMoveTop = 0;
							refrashEl.style.cssText = "top: " + realMoveTop + "px";
						}
					}
				}
			}
		}
	};

	function touchEndEvent(eEnd) {
		// document.body.removeEventListener("touchmove", touchMoveEvent, false);
		if(!bIsAtRefrash) {
			if(booRefrash) {
				// console.log("touch------end");
				if(realMoveTop >= 0) {
					bIsAtRefrash = true;
					let antSrc = require('./../images/ant.gif');
					refrashEl.children[0].innerHTML = '<img src=' + antSrc + '>';  //'+ window.publicPath + '/dist/images/ant.gif
					refrashCallback(function(strTips) {
						// document.body.removeEventListener("touchend", touchEndEvent, false);
						refrashEl.children[0].innerHTML = "刷新成功";
						refrashEl.children[0].style.cssText = "background: #009688; color: #fff;";
						setTimeout(function() {
							bIsAtRefrash = false;
							refrashEl.children[0].style.cssText = "";
							realMoveTop = -reElHeight;
							refrashEl.style.cssText = "top: " + realMoveTop + "px";	
						}, 1000);
					});
				}
				else if(realMoveTop < 0 && realMoveTop > -reElHeight) {
					realMoveTop = -reElHeight;
					refrashEl.style.cssText = "top: " + realMoveTop + "px";	
				}
			}
		}
	};

	function toScroll(eScroll) {
		eScroll.preventDefault();
		if(!bIsAtRefrash) {
			if(bIsScrollEvent) {
				// console.log("touch------end------scroll");

				// 开始显示加载
				if(document.querySelector(".main").scrollTop >= (taElHeight - windowHeight - reElHeight) && booLoadon) {
					loadonEl.style.cssText = "";
					loadonEl.children[0].innerHTML = "上滑加载";

					// 触发加载
					if(document.querySelector(".main").scrollTop >= (taElHeight - windowHeight - 1)) {  // -1 ： offset 取值，有小数进一
						// loadon
						bIsScrollEvent = false;
						let antSrc = require('./../images/ant.gif');
						loadonEl.children[0].innerHTML = '<img src=' + antSrc + '>';
						loadonCallback(function(boolean) {
							loadonEl.style.cssText = "display: none;";
							booLoadon = boolean;
						});
					}
				}
			}
		}
	};

	// 防抖动函数  
    function debounce(func, wait, immediate) {  
        var timeout;  
        return function() {  
            var context = this, args = arguments;  
            var later = function() {  
                timeout = null;  
                if (!immediate) func.apply(context, args);  
            };  
            var callNow = immediate & !timeout;  
            clearTimeout(timeout);  
            timeout = setTimeout(later, wait);  
            if (callNow) func.apply(context, args);  
        };  
    };
};

export { RefrashOrLoadonByScroll };