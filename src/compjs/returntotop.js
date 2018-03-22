function ReturnToTop(obj) {
	let parent = obj.targetEl;
	let footer = obj.footerEl;

	let footerHeight = 0;
	if(footer) {
		footerHeight = footer.offsetHeight;
	}
	let windowHeight = obj.targetEl.offsetHeight;

	// 新生 element 
	let toTop = document.createElement("div");
	parent.appendChild( toTop, obj.targetEl ); 
	toTop.classList.add("toTop");
	toTop.style.cssText = "bottom:" + footerHeight + "px;";

	if(obj.targetEl.scrollTop <= windowHeight) {
		toTop.style.cssText = "bottom:" + footerHeight + "px; display: none;";
	}

	obj.targetEl.addEventListener("scroll", onScroll, false);

	function onScroll() {
		toTop.addEventListener("click", clickToTop, false);
		if(obj.targetEl.scrollTop > windowHeight) {
			toTop.style.cssText = "bottom:" + footerHeight + "px;";
		}
		else if(obj.targetEl.scrollTop <= windowHeight) {
			toTop.style.cssText = "bottom:" + footerHeight + "px; display: none;";
		}
	};
	function clickToTop() {
		let scrollTop = obj.targetEl.scrollTop;
		let speed = 50;

		if(scrollTop/50 > 1000) {
			speed = scrollTop/1000;
		}

		let scrollTimer = setInterval(function() {
			scrollTop -= speed;
			obj.targetEl.scrollTop = scrollTop;

			if(scrollTop <= 0) {
				scrollTop = 0;
				obj.targetEl.scrollTop = scrollTop;
				clearInterval(scrollTimer);
			}
		}, 1);
	};
};

export {ReturnToTop};