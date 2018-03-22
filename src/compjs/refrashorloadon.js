function RefrashOrLoadon(obj, refrashCallback, loadonCallback) {
	let that = this;
	// console.log("我是组件: aaa");

	// 下拉刷新+上滑加载
	let target = obj.target;  // 需要下拉上滑的div
	let refrashEl = obj.refrashEl;  // 下拉刷新div
	let loadonEl = obj.loadonEl;  // 上滑加载div
	let footerEl = obj.footerEl;  // 脚（注：如果没有，则长度为零）
	let booRefrash = obj.booRefrash;
	let booLoadon = obj.booLoadon;
	let lastEmoveY = null;
	let distance = 0;
	let windowHeight = document.body.offsetHeight;
	let tHeight = target.offsetHeight;
	let footerHeight = 0;
	if(footerEl) {
		footerHeight = footerEl.offsetHeight;
	}
	
	let bIsRefrash = false;
	let bIsLoadon = false;
	let more = obj.more;
	
	// 下拉
	let elHeight = refrashEl.offsetHeight;
	let realMoveTop = -elHeight;

	// 上滑
	let dlHeight = loadonEl.offsetHeight;

	// 下拉、上滑 释放
	let pullDownTimer = null;
	let slideUpTimer = null;

	target.addEventListener("touchstart", touchstartEvent, false);
	function touchstartEvent(eStart) {
		if(!bIsRefrash && !bIsLoadon) {
			lastEmoveY = null;
			distance = 0;
			loadonEl.style.cssText = "display: none";
			tHeight = target.offsetHeight;
			if(footerEl) {
				footerHeight = footerEl.offsetHeight;
			}
			elHeight = refrashEl.offsetHeight;
			windowHeight = document.body.offsetHeight;
			target.addEventListener("touchmove", touchmoveEvent, false);
			target.addEventListener("touchend", touchendEvent, false);

			// clear timer
			clearInterval(pullDownTimer);
			clearInterval(slideUpTimer);
		}
	};
	function touchmoveEvent(eMove) {
		eMove.preventDefault();
		let nowEmoveY = eMove.targetTouches[0].clientY;
		if(lastEmoveY == null) {
			lastEmoveY = nowEmoveY;
		}
		distance = nowEmoveY - lastEmoveY;
		lastEmoveY = nowEmoveY;

		if(distance >= 0) {  // 下拉
			realMoveTop = realMoveTop + distance;
			target.style.cssText = "top: " + realMoveTop + "px";
			// console.log(realMoveTop + "下拉")

			if(booRefrash) {  // 是否需要下拉加载？
				if(realMoveTop >= -elHeight) {
					refrashEl.children[0].innerHTML = "下拉刷新";

					if(realMoveTop >= elHeight*0.5) {
						refrashEl.children[0].innerHTML = "释放后刷新";

						bIsRefrash = true;

						if(realMoveTop >= elHeight) {
							realMoveTop = elHeight;
						}
					}
				}
			}
			else {
				if(realMoveTop >= -elHeight) {
					realMoveTop = -elHeight;
					target.style.cssText = "top: " + realMoveTop + "px";
				}
			}
			
		}else if(distance < 0 && tHeight > windowHeight) {  // 上滑
			realMoveTop = realMoveTop + distance;
			target.style.cssText = "top: " + realMoveTop + "px";
			// console.log(realMoveTop + "上滑")

			if(booLoadon) {
				loadonEl.style.cssText = "";
				dlHeight = loadonEl.offsetHeight;
				tHeight = target.offsetHeight;
				if(realMoveTop <= -(tHeight-windowHeight-footerHeight)) {
					loadonEl.children[0].innerHTML = "上滑加载";

					if(realMoveTop <= -(tHeight-windowHeight)) {
						realMoveTop = -(tHeight-windowHeight);
						target.style.cssText = "top: " + realMoveTop + "px";

						if(more == 1) {
							loadonEl.children[0].innerHTML = '<img src="'+ window.publicPath + '/dist/images/ant.gif">';
							bIsLoadon = true;
						}else {
							bIsLoadon = false;
						}
					}
				}
			}
			else {
				if(realMoveTop <= -(tHeight-windowHeight)) {
					dlHeight = 0;
					realMoveTop = -(tHeight-windowHeight-dlHeight)
					target.style.cssText = "top: " + realMoveTop + "px";
				}
			}
		}
	};
	function touchendEvent(eEnd) {
		// console.log(distance);
		if(distance >= 0 && !bIsRefrash) {  // 下拉
			if(distance > 30) {
				distance = 30
			}
			if(distance < 10) {
				distance = 10
			}
			let speed = distance;
			pullDownTimer = setInterval(function() {
				realMoveTop = realMoveTop + distance;
				target.style.cssText = "top: " + realMoveTop + "px";
				distance -= 0.2;
				// console.log(distance);

				if(distance <= 0) {
					distance = 0;
					clearInterval(pullDownTimer);
				}

				if(realMoveTop >= -elHeight) {
					realMoveTop = -elHeight
					target.style.cssText = "top: " + realMoveTop + "px";
					distance = 0;
					clearInterval(pullDownTimer);
				}
			}, 5);
		}else if(distance < 0 && tHeight > windowHeight && !bIsLoadon) {  // 上滑
			if(distance < -30) {
				distance = -30
			}
			if(distance > -10) {
				distance = -10
			}
			let speed = distance;
			slideUpTimer = setInterval(function() {
				realMoveTop = realMoveTop + distance;
				target.style.cssText = "top: " + realMoveTop + "px";
				distance += 0.2;
				// console.log(distance);

				if(distance >= 0) {
					distance = 0;
					clearInterval(slideUpTimer);
				}

				if(realMoveTop <= -(tHeight-windowHeight)) {
					realMoveTop = -(tHeight-windowHeight-dlHeight)
					target.style.cssText = "top: " + realMoveTop + "px";
					distance = 0;
					clearInterval(slideUpTimer);
				}
			}, 5);
		}

		if(bIsRefrash) {
			bIsRefrash = false;
			target.removeEventListener("touchmove", touchmoveEvent, false);
			// refrashEl.children[0].innerHTML = "刷新";
			refrashEl.children[0].innerHTML = '<img src="'+ window.publicPath + '/dist/images/ant.gif">';
			target.style.cssText = "top: 0px";

			refrashCallback(function(bRefrash) {
				booRefrash = bRefrash;
				realMoveTop = 0;
				let disTimer = setInterval(function() {
					realMoveTop -= 10;
					if(realMoveTop > -elHeight) {
						target.style.cssText = "top: " + realMoveTop + "px";
					}else {
						target.style.cssText = "top: " + (-elHeight) + "px";
						clearInterval(disTimer);
					}
				}, 10);
			});
		}

		if(bIsLoadon) {
			bIsLoadon = false;
				target.removeEventListener("touchmove", touchmoveEvent, false);

				loadonCallback(function(bLoadon) {
					// do nothing
					loadonEl.children[0].innerHTML = '加载成功';
					booLoadon = bLoadon;
				});
		}
	};
};
export { RefrashOrLoadon };