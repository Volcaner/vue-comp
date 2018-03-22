/**
 * kaican
 * 签到积分 +3  动态效果
 */

function FadeAway(obj) {
	// console.log("dsadsadsa");

	var el = document.createElement("div");
	el.setAttribute("id", "fadeAway");
	el.innerHTML = obj.text;
	el.style.fontSize = "0.55466667rem";
	el.style.color = "#939393";
	el.style.left = "2rem";
	el.style.top = "0.78933333rem";
	el.style.position = "absolute";
	el.style.opacity = 1;
	obj.parentNode.appendChild(el);

	var fadeEl = document.querySelector("#fadeAway");
	var fadeTimer = setInterval(function() {
		fadeEl.style.opacity = fadeEl.style.opacity - 0.02;
		fadeEl.style.top = (parseFloat(fadeEl.style.top) - 0.01) + "rem";

		if(fadeEl.style.opacity <= 0) {
			clearInterval(fadeTimer);

			obj.parentNode.removeChild(el);
		}
	}, 10);
};

export { FadeAway };